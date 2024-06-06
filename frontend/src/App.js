import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Result from "./components/Result";
import ResultsCart from "./components/ResultsCart";
import SearchBar from "./components/SearchBar";

function App() {
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);

  const dummyResults = [
    { title: "Result 1", summary: "This is the first result" },
    { title: "Result 2", summary: "This is the second result" },
    { title: "Result 3", summary: "This is the third result" },
    { title: "Result 4", summary: "This is the last result" },
  ];

  useEffect(() => {
    setResults(dummyResults);
  }, []);

  const handleAddToCart = (result) => {
    setCart([...cart, result]);
  };

  return (
    <>
      <div className="App">
        <Navbar />
        <main id="home">
          <section className="grid1">
            <SearchBar />
            <div className="resultsDisplay">
              {results.map((result, index) => (
                <Result
                  key={index}
                  title={result.title}
                  summary={result.summary}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
          <aside className="grid2">
            <ResultsCart cart={cart} />
          </aside>
        </main>
        <footer id="contact">
          <p>
            Github: <a href="https://github.com/s33chin/GovSync">GovSync</a> by
            Microsoft
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
