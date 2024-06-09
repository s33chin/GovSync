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

    const datasets = [
        { name: "Department of Justice (DOJ)", image: "/images/justice.png" },
        { name: "Department of Housing and Urban Development (HUD)", image: "/images/Housing_and_Urban.png" },
        { name: "Department of Education", image: "/images/education.png" },
        { name: "Police Departments", image: "/images/police-department-logo.png" }
    ];

    return (
        <main className="main main--home">
            <div className="row home-search">
                <img className="logo" src="/images/cognitive-search.png" alt="Cognitive Search"></img>
                <p className="poweredby lead">Powered by Azure Cognitive Search</p>
                <SearchBar postSearchHandler={navigateToSearchPage}></SearchBar>
            </div>
            <div className="row datasets">
                {datasets.map((dataset, index) => (
                    <div key={index} className="dataset">
                        <img src={dataset.image} alt={dataset.name} />
                        <p>{dataset.name}</p>
                    </div>
                ))}
            </div>
        </main>
    );
};
