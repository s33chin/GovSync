export default function Chat() {

    let aborter = new AbortController();
    let autoAbortTimeout = null;

    const outputRef = document.querySelector("#outputRef");
    const loadingRef = document.querySelector("#loadingRef");
    const userQueryRef = document.querySelector("#userQueryRef");
    const cancelQueryRef = document.querySelector("#cancelQueryRef");
    const submitQueryRef = document.querySelector("#submitQueryRef");
    const statusLabelRef = document.querySelector("#statusLabelRef");

    userQueryRef.value =
        "what is the state of education in 2023 according to US government? Send me the full analysis by email.";

    cancelQueryRef.addEventListener("click", () => {
        aborter.abort();
        aborter = new AbortController();
        cancelQueryRef.classList.add("hidden");
        submitQueryRef.classList.remove("hidden");
        loadingRef.classList.add("hidden");
    });

    submitQueryRef
        .addEventListener("click", async (event) => {
            const { value } = userQueryRef;
            if (value) {
                statusLabelRef.innerHTML = "waiting";
                outputRef.innerHTML = "";

                loadingRef.classList.remove("hidden");
                outputRef.classList.add("hidden");
                cancelQueryRef.classList.remove("hidden");
                submitQueryRef.classList.add("hidden");

                autoTimeout();
                submitQuery(value);
            }
        });

    function autoTimeout() {
        autoAbortTimeout = setTimeout(() => {
            cancelQueryRef.click();
            outputRef.classList.remove("hidden");
            if (outputRef.innerHTML === "") {
                outputRef.innerHTML = "Your Assistant could not fetch data. Please try again!"
            }
        }, 60_000); // cancel request if it times out
    }

    function submitQuery(body) {
        const { API_URL = 'http://localhost:3000' } = import.meta.env;
        fetch(`${API_URL}/api/assistant`, {
            body,
            method: "POST",
            signal: aborter.signal
        }).then(response => response.body)
            .then(processReadableStream);
    }

    function processReadableStream(stream) {
        stream.pipeTo(new WritableStream({
            write(chunk, controller) {
                const value = new TextDecoder().decode(chunk);
                if (value.startsWith('@')) {
                    statusLabelRef.innerHTML = value.replace('@', '');
                    return;
                }

                loadingRef.classList.add("hidden");
                outputRef.classList.remove("hidden");

                outputRef.innerHTML += value;
                outputRef.scrollTop = outputRef.scrollHeight; // scroll to bottom
            },
            start(controller) {
                clearTimeout(autoAbortTimeout); // cancel 
            },
            close(controller) {
                cancelQueryRef.classList.add("hidden");
                submitQueryRef.classList.remove("hidden");
                loadingRef.classList.add("hidden");
                outputRef.classList.remove("hidden");
                if (outputRef.innerHTML === "") {
                    outputRef.innerHTML = "Whoops, something went wrong. Please try again!"
                }
            },
            abort(reason) {
                console.log(reason);
            },
        })).catch(console.error);
    }
    return (
        <main>
            <section class="input__container">
                <label class="input">
                    <textarea id="userQueryRef" class="input__field" placeholder="Hi htere..." cols="10" rows="10"></textarea>
                    <span class="input__label">User message</span>
                </label>
                <button id="submitQueryRef">Run</button>
                <button id="cancelQueryRef" class="hidden">Cancel</button>
            </section>
            <p class="text__hint">
                Your Assistant can make mistakes. Consider checking important
                information. All financial and stock data mentioned below is fictitious!
            </p>
            <section class="output__container">
                <div id="loadingRef" class="loader__container hidden">
                    <span class="spinner"><span class="spinner__tail"></span></span>
                    <p>Working on it (<span id="statusLabelRef">waiting</span>)</p>
                </div>
                <div id="outputRef" class="hidden"></div>
            </section>
        </main>

    );

}

