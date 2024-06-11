// ChatUI.js
import React from 'react';
import './ChatUI.css';

const ChatUI = ({
    userQueryRef,
    outputRef,
    loadingRef,
    cancelQueryRef,
    submitQueryRef,
    statusLabelRef,
    handleSubmit,
    handleCancel,
}) => {
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
                <button className= "chat-button" ref={submitQueryRef} onClick={handleSubmit}>Run</button>
                <button ref={cancelQueryRef} className="hidden" onClick={handleCancel}>Cancel</button>
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
};

export default ChatUI;
