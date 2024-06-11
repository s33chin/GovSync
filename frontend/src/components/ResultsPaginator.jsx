import React, { useState } from "react";
import Paginator from "./Paginator";
import Result from "./Result";

const ResultsPaginator = ({ results, handleAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <div className="resultsDisplay">
        {currentResults.map((result, index) => (
          <Result
            key={index}
            title={result.title}
            summary={result.summary}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <Paginator
        resultsPerPage={resultsPerPage}
        totalResults={results.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
};

export default ResultsPaginator;
