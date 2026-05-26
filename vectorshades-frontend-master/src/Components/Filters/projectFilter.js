import { useState, useEffect } from "react";
import styles from "../../../styles/Filters.module.css";

const CompProjectFilter = ({ onChange }) => {
  const [filterObject, setFilterObject] = useState({
    rebar: false,
    year: "",
    location: ""
  });

  const years = ["2021", "2022", "2023", "2024", "2025","2026"];

  const handleRebarChange = (e) => {
    setFilterObject((prev) => ({
      ...prev,
      rebar: e.target.checked
    }));
  };

  const handleYearChange = (e) => {
    setFilterObject((prev) => ({
      ...prev,
      year: e.target.value
    }));
  };

  const handleLocationChange = (e) => {
    setFilterObject((prev) => ({
      ...prev,
      location: e.target.value
    }));
  };

  useEffect(() => {
    onChange(filterObject);
  }, [filterObject]);

  return (
    <>
      <div className={styles.report_container} style={{ height: "8em", zIndex: 100 }}>
        <div className={styles.price_range}>
          <h4>Project Filters</h4>
          <p>Filter projects by Rebar, Year, and Location</p>
        </div>
        <br/>
        <div>
            <label>Rebar</label>
            <input
              type="checkbox"
              checked={filterObject.rebar}
              onChange={handleRebarChange}
            />
          </div>
        <br/>

        <div className={styles.price_range_box}>
          <div>
            <label>Year</label>
            <select onChange={handleYearChange} value={filterObject.year}>
              <option hidden>Select year</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Location</label>
            <select onChange={handleLocationChange} value={filterObject.location}>
              <option hidden>Select location</option>
              <option value="Chennai">Chennai</option>
              <option value="Kochi">Kochi</option>
              {/* Add more locations as needed */}
            </select>
          </div>
        </div>
      </div>
      <br />
    </>
  );
};

export default CompProjectFilter;
