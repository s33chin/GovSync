const { Readable } = require("node:stream");
const { app } = require("@azure/functions");

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { DefaultAzureCredential, getBearerTokenProvider } = require("@azure/identity");

const mailer = require("./mailer");

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const azureApiKey = process.env["AZURE_OPENAI_API_KEY"];
const deploymentId = process.env["AZURE_OPENAI_DEPLOYMENT_ID"];
const searchEndpoint = process.env["AZURE_AI_SEARCH_ENDPOINT"];
const searchKey = process.env["AZURE_AI_SEARCH_API_KEY"];
const searchIndex = process.env["AZURE_AI_SEARCH_INDEX"];
const EMAIL_RECEIVER = process.env["EmailReceiver"];
const OPENAI_FUNCTION_CALLING_SKIP_SEND_EMAIL = process.env["OpenAIFunctionCallingSkipSendEmail"];

// Important: Errors handlings are removed intentionally. If you are using this sample in production
// please add proper error handling.

// Create a OpenAIClient to send queries
const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

const assistantDefinition = {
    name: "GovSync Assistant",
    instructions:
        "You are a helpful assistant that helps researchers gains insight from datasets available to you. "
        + "You also know how to generate a full body email formatted as rich html. Do not use other format than rich html."
        + "Only use the functions you have been provideded with",
    tools: [
        {
            type: "function",
            function: {
                name: "writeAndSendEmail",
                description:
                    "Provides an email subject, and body content in plain text, and the same body in html",
                parameters: {
                    type: "object",
                    properties: {
                        subject: {
                            type: "string",
                            description: "The subject of the email. Limit to maximum 50 characters",
                        },
                        html: {
                            type: "string",
                            description: "The body text of the email in html",
                        },
                    },
                    required: ["subject", "html"],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "searchAzureIndex",
                description:
                    "Searches Azure Cognitive Search index and returns results.",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The search query",
                        },
                    },
                    required: ["query"],
                },
            },
        }
    ],
    model: deploymentId,
};

async function* processQuery(userQuery) {
    console.log('Step 0: Connect and acquire an OpenAI instance');
    const openai = await client.getOpenAI();

    console.log('Step 1: Retrieve or Create an Assistant');
    let assistant;
    if (deploymentId) {
        assistant = await openai.beta.assistants.retrieve(deploymentId);
    } else {
        assistant = await openai.beta.assistants.create(assistantDefinition);
    }

    console.log('Step 2: Create a Thread');
    const thread = await openai.beta.threads.create();

    console.log('Step 3: Add a Message to the Thread');
    const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userQuery,
    });

    console.log('Step 4: Create a Run (and stream the response)');
    const run = openai.beta.threads.runs.stream(thread.id, {
        assistant_id: assistant.id,
        stream: true,
    });

    console.log('Step 5: Read streamed response', { run });
    for await (const chunk of run) {
        const { event, data } = chunk;

        console.log('processing event', { event, data });

        if (event === "thread.run.created") {
            yield "@created";
            console.log('Processed thread.run.created');
        }
        else if (event === "thread.run.queued") {
            yield "@queued";
            console.log('Processed thread.run.queued');
        }
        else if (event === "thread.run.in_progress") {
            yield "@in_progress";
            console.log('Processed thread.run.in_progress');
        }
        else if (event === "thread.message.delta") {
            const delta = data.delta;

            if (delta) {
                const value = delta.content[0]?.text?.value || "";
                yield value;
                console.log('Processed thread.message.delta', { value });
            }
        }
        else if (event === "thread.run.failed") {
            const value = data.last_error.message;
            yield value;
            console.log('Processed thread.run.failed', { value });
        }
        else if (event === "thread.run.requires_action") {
            yield* handleRequiresAction(openai, data, data.id, data.thread_id);
        }
        // else if ... handle the other events as needed
    }

    console.log('Done!');
}

async function* handleRequiresAction(openai, run, runId, threadId) {
    console.log('Handle Function Calling', { required_action: run.required_action.submit_tool_outputs.tool_calls });
    try {
        const toolOutputs = await Promise.all(
            run.required_action.submit_tool_outputs.tool_calls.map(
                async (toolCall) => {
                    if (toolCall.function.name === "writeAndSendEmail") {
                        const args = JSON.parse(toolCall.function.arguments);
                        return {
                            tool_call_id: toolCall.id,
                            output: await writeAndSendEmail(
                                args.subject,
                                args.html
                            ),
                        };
                    }
                    else if (toolCall.function.name === "searchAzureIndex") {
                        const args = JSON.parse(toolCall.function.arguments);
                        return {
                            tool_call_id: toolCall.id,
                            output: await searchAzureIndex(args.query),
                        };
                    }
                    return toolCall;
                }
            )
        );

        // Submit all the tool outputs at the same time
        yield* submitToolOutputs(openai, toolOutputs, runId, threadId);
    } catch (error) {
        console.error("Error processing required action:", error);
    }
}

async function* submitToolOutputs(openai, toolOutputs, runId, threadId) {
    try {
        // Use the submitToolOutputsStream helper
        console.log('Call Tool output and stream the response');
        const asyncStream = openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runId,
            { tool_outputs: toolOutputs }
        );
        for await (const chunk of asyncStream) {
            const { event, data } = chunk;
            // console.log({ event, data });
            if (event === "thread.message.delta") {
                // stream message back to UI
                const { delta } = data;

                if (delta) {
                    const value = delta.content[0]?.text?.value || "";
                    yield value;
                    console.log('Processed thread.message.delta (tool output)', { value });
                }
            }
            // else if ... handle the other events as needed
        }
    } catch (error) {
        console.error("Error submitting tool outputs:", error);
    }
}

async function searchAzureIndex(query) {
    const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
    const searchClient = new SearchClient(searchEndpoint, searchIndex, new AzureKeyCredential(searchKey));
    
    const searchResults = await searchClient.search(query);
    return searchResults.results.map(result => result.document);
}

async function writeAndSendEmail(subject, html) {
    if (OPENAI_FUNCTION_CALLING_SKIP_SEND_EMAIL === 'true') {
        console.log('Dry mode enabled. Skip sending emails');
        return 'Fake email sent!!';
    }

    const info = await mailer.sendEmail({
        to: EMAIL_RECEIVER, subject, html
    });

    return info.messageId;
}

// API definition
app.setup({ enableHttpStream: true });
app.http("assistant", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request) => {
        console.log(`Http function processed request for url "${request.url}"`);
        const query = await request.text();

        return {
            headers: {
                'Content-Type': 'text/plain',
                "Transfer-Encoding": "chunked"
            }, body: Readable.from(processQuery(query))
        };
    },
});
