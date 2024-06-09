import React from 'react';

import './Result.css';

export default function Result(props) {
    const maxLength = 50;
    const content = props.document.content.length > maxLength ? props.document.content.substring(0, maxLength) + '...' : props.document.content;

    return (
        <div className="card result">
            <img className="card-img-top" src={'/images/research-paper.png'} alt="Place Holder"></img>
            <div className="card-body">
                <h6 className="title-style">{content}</h6>
            </div>
        </div>
    );
}