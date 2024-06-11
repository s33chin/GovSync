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
                <a href="/search?q=*">
                    <img className="logo" src="/images/cognitive-search.png" alt="Cognitive Search"></img>
                </a>
                <p className="poweredby lead">Powered by Azure Cognitive Search</p>
                <SearchBar postSearchHandler={navigateToSearchPage}></SearchBar>
                <div className="image-container">
                    <a href="https://www.justice.gov/" target="_blank">
                        <img src="/images/justice-small.png" alt="DOJ" />
                    </a>
                    <a href="https://www.hud.gov/" target="_blank">
                        <img src="/images/housing-medium.png" alt="DOH" />
                    </a>
                    <a href="https://www.ed.gov/" target="_blank">
                        <img src="/images/edu-medium.png" alt="DOE" />
                    </a>
                    <a href="https://www.nyc.gov/site/nypd/index.page" target="_blank">
                        <img src="/images/police-small.png" alt="NYPD" />
                    </a>
                </div>
            </div>
        </main>
    );
};