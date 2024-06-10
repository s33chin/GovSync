import { useEffect, useRef } from 'react';
import './Chat.css';

export default function Chat() {
    const aborter = useRef(new AbortController());
    const autoAbortTimeout = useRef(null);

    const outputRef = useRef(null);
    const loadingRef = useRef(null);
    const userQueryRef = useRef(null);
    const cancelQueryRef = useRef(null);
    const submitQueryRef = useRef(null);
    const statusLabelRef = useRef(null);

    const handleCancel = () => {
        aborter.current.abort();
        aborter.current = new AbortController();
        cancelQueryRef.current.classList.add("hidden");
        submitQueryRef.current.classList.remove("hidden");
        loadingRef.current.classList.add("hidden");
        if (autoAbortTimeout.current) {
            clearTimeout(autoAbortTimeout.current);
        }
    };

    const handleSubmit = async () => {
        const { value } = userQueryRef.current;
        if (value) {
            statusLabelRef.current.innerHTML = "waiting";
            outputRef.current.innerHTML = "";

            loadingRef.current.classList.remove("hidden");
            outputRef.current.classList.add("hidden");
            cancelQueryRef.current.classList.remove("hidden");
            submitQueryRef.current.classList.add("hidden");

            setAutoTimeout();
            await submitQuery(value);
        }
    };

    const setAutoTimeout = () => {
        autoAbortTimeout.current = setTimeout(() => {
            handleCancel();
            outputRef.current.classList.remove("hidden");
            if (outputRef.current.innerHTML === "") {
                outputRef.current.innerHTML = "Your Assistant could not fetch data. Please try again!";
            }
        }, 60000); // cancel request if it times out
    };

    const submitQuery = async (body) => {
        const { API_URL = 'http://localhost:3000' } = import.meta.env;
        try {
            const response = await fetch(`${API_URL}/api/assistant`, {
                body,
                method: "POST",
                signal: aborter.current.signal
            });
            const reader = response.body.getReader();
            processReadableStream(reader);
        } catch (error) {
            console.error('Error fetching data:', error);
            handleCancel();
            outputRef.current.innerHTML = "An error occurred while fetching data. Please try again!";
        }
    };

    const processReadableStream = async (reader) => {
        const decoder = new TextDecoder();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                if (chunk.startsWith('@')) {
                    statusLabelRef.current.innerHTML = chunk.replace('@', '');
                } else {
                    loadingRef.current.classList.add("hidden");
                    outputRef.current.classList.remove("hidden");
                    outputRef.current.innerHTML += chunk;
                    outputRef.current.scrollTop = outputRef.current.scrollHeight; // scroll to bottom
                }
            }
        } catch (error) {
            console.error('Error processing stream:', error);
            outputRef.current.innerHTML = "An error occurred while processing data. Please try again!";
        } finally {
            handleStreamClose();
        }
    };

    const handleStreamClose = () => {
        cancelQueryRef.current.classList.add("hidden");
        submitQueryRef.current.classList.remove("hidden");
        loadingRef.current.classList.add("hidden");
        outputRef.current.classList.remove("hidden");
        if (outputRef.current.innerHTML === "") {
            outputRef.current.innerHTML = "Whoops, something went wrong. Please try again!";
        }
    };

    useEffect(() => {
        const cancelBtn = cancelQueryRef.current;
        const submitBtn = submitQueryRef.current;
        
        cancelBtn.addEventListener("click", handleCancel);
        submitBtn.addEventListener("click", handleSubmit);

        return () => {
            cancelBtn.removeEventListener("click", handleCancel);
            submitBtn.removeEventListener("click", handleSubmit);
            if (autoAbortTimeout.current) {
                clearTimeout(autoAbortTimeout.current);
            }
        };
    }, []);

    return (
        <main>
            <section className="input__container">
                <label className="input">
                    <textarea
                        ref={userQueryRef}
                        className="input__field"
                        placeholder="Hi there..."
                        cols="10"
                        rows="10"
                    ></textarea>
                    <span className="input__label">User message</span>
                </label>
                <button ref={submitQueryRef}>Run</button>
                <button ref={cancelQueryRef} className="hidden">Cancel</button>
            </section>
            <p className="text__hint">
                Your Assistant can make mistakes. Consider checking important
                information.
            </p>
            <section className="output__container">
                <div ref={loadingRef} className="loader__container hidden">
                    <span className="spinner">
                        <span className="spinner__tail"></span>
                    </span>
                    <p>Working on it (<span ref={statusLabelRef}>waiting</span>)</p>
                </div>
                <div ref={outputRef} className="hidden"></div>
            </section>
        </main>
    );
}
