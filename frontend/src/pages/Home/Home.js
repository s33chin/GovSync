import React from "react";
import { useHistory } from "react-router-dom";
import SearchBar from '../../components/SearchBar/SearchBar';
import "./Home.css";
import "../../pages/Search/Search.css";

export default function Home() {
    const history = useHistory();
    const navigateToSearchPage = (q) => {
        if (!q || q === '') {
            q = '*'
        }
        history.push('/search?q=' + q);
    }

    return (
        <main className="main main--home">
            <div className="row home-search">
                <img className="logo" src="/images/cognitive-search.png" alt="Cognitive Search"></img>
                <p className="poweredby lead">Powered by Azure Cognitive Search</p>
                <SearchBar postSearchHandler={navigateToSearchPage}></SearchBar>
                <h2>Available Goverment Datasets</h2>
                <div className="image-container">
                    <img src="/images/justice.png" alt="Image 1" />
                    <img src="/images/Housing_and_Urban.png" alt="Image 2" />
                    <img src="/images/education.png" alt="Image 3" />
                </div>
            </div>
        </main>
    );
};
