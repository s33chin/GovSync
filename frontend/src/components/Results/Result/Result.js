import React from 'react';

import './Result.css';

export default function Result(props) {
    return(
    <div className="card result">
            <div className="card-body">
                <h6 className="title-style">{props.document.content}</h6>
            </div>
    </div>
    );
}