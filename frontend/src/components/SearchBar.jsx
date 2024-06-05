import { useState } from "react";

const SearchBar = () => {
  const [keywords, setKeywords] = useState([]);
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const handleSearch = () => {
    let searchParams = {
      keywords: keywords,
      location: location,
      fromDate: fromDate,
      toDate: toDate,
      selectedDepartments: selectedDepartments,
    };

    console.log(searchParams);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value.split(","))}
        placeholder="Keywords"
      />
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter your Location"
      />
      <select
        multiple
        value={selectedDepartments}
        onChange={(e) =>
          setSelectedDepartments(
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
        style={{ overflowY: "hidden" }}
      >
        <option value="Department of Justice">Department of Justice</option>
        <option value="Department of Housing and Urban Development">
          Department of Housing and Urban Development
        </option>
        <option value="Local Police Department">Local Police Department</option>
        <option value="Department of Education">Department of Education</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
