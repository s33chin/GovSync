import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <>
      <div className="App">
        <Navbar />
        <main id="home">
          <SearchBar />
          <h2 id="about">SAY NO TO CRIME</h2>
        </main>
        <footer id="contact">
          <p>Github: GovSync by Microsoft</p>
        </footer>
      </div>
    </>
  );
}

export default App;
