import React from "react";

const Result = ({ title, summary, handleAddToCart }) => {
  return (
    <div className="singleResult">
      <h4>{title}</h4>
      <p>{summary}</p>
      <button onClick={() => handleAddToCart({ title, summary })}>+</button>
    </div>
  );
};

export default Result;
