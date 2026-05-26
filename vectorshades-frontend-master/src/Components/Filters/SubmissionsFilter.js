import { Close } from "@mui/icons-material";
import { Divider, FormControlLabel, Radio, RadioGroup, Slider } from "@mui/material";
import { useState, useEffect } from "react";
import styles from "../../../styles/Filters.module.css";
import SelectClientInput from "../SelectClientInput";
import SelectProjectInput from "../SelectProjectInput";
import { useClients } from "../../Constants/clients";


const SubmissionsFilter = ({ setIsFilterOpen, render, onChange, children }) => {
  const [value, setValue] = useState([20, 80]);
  const [FilterObject, setFilterObject] = useState({});
  const [selectionObject, setselectionObject] = useState({})
  const { clients } = useClients();


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const clearFilter = () => {
    setFilterObject({})
    setselectionObject({})
    setIsFilterOpen(false)
  }

  useEffect(() => {
    if (onChange) onChange(FilterObject)
  }, [FilterObject])


  return (
    <>
      <div className={styles.job_flt_container}  >
        <div className={styles.flt_title} >
          <h4>Filters</h4>
          {!onchange && <Close onClick={() => setIsFilterOpen(false)} style={{ cursor: "pointer" }} />}
        </div>
        <Divider sx={{ mb: 2 }} />

        <div className={styles.price_range} >
          <div className={styles.price_range} >
            <h4>Client</h4>
            {/* <p>Get the Job where PO Price is in the range</p> */}
          </div>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Location</label>
            <select onChange={(e) => FilterObject.location = e.target.value}>
              <option hidden>Select Location</option>
              <option value="Chennai">Chennai</option>
              <option value="Kochi">Kochi</option>
            </select>
          </div>
          <div>
            <label>Client</label>
            <select onChange={(e) => FilterObject.client = e.target.value}>
              <option hidden>Select Client</option>
              {Object.keys(clients).map((name) => {
                return (
                  <option value={name}>{name}</option>
                )
              })}
            </select>
          </div>
        </div>

        <div className={styles.price_range} style={{ marginTop: 10 }}>
          <div className={styles.price_range} >
            <h4>Project</h4>
            {/* <p>Get the Job where PO Price is in the range</p> */}
          </div>
        </div>
        <SelectProjectInput returnProject={(p) => { if (p) setFilterObject((prev) => ({ ...prev, project: p.projectName })) }} />

        {children}
        <Divider />
        <div className={styles.clear_flt} >
          <button onClick={clearFilter}>Clear all</button>
          <button onClick={() => render(FilterObject)}>Filter</button>
        </div>

      </div>
    </>
  );
};

export default SubmissionsFilter;
