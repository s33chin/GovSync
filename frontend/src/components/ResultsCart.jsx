import React from "react";
import AIChat from "./AIChat";

const ResultsCart = ({ cart }) => {
  const CartItems = ({ cart }) => (
    <>
      {cart.map((item, index) => (
        <div className="resultItem" key={index}>
          <h5>{item.title}</h5>
          <p>{item.summary}</p>
        </div>
      ))}
    </>
  );

  return (
    <div className="resultsCart">
      <h3>Results Cart</h3>
      <CartItems cart={cart} />
      <AIChat />
    </div>
  );
};

export default ResultsCart;
