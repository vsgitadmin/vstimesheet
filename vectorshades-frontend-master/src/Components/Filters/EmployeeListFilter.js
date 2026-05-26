import { Close } from "@mui/icons-material";
import { Divider, Slider } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../../../styles/Filters.module.css";
import designations from "../../Constants/designation";
import departments from "../../Constants/departments";

const Filter = ({ setIsFilterOpen, render, onChange, children }) => {

  const [value, setValue] = useState([20, 80]);
  const [FilterObject, setFilterObject] = useState({});
  const [selectionObject, setselectionObject] = useState({})


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
      <div className={onChange ? styles.report_container : styles.emp_container}  >
        <div className={styles.flt_title} >
          <h4>Filters</h4>
          {!onChange && <Close onClick={() => setIsFilterOpen(false)} style={{ cursor: "pointer" }} />}
          
        </div>
        <Divider />
        <div className={styles.price_range} >
          <h4>Joining Date</h4>
          <p>Get the employees where joining date is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Start Date</label>
            <input type="Date" onChange={(e) => FilterObject.startDate = e.target.value} />
          </div>
          <div>
            <label>End Date</label>
            <input type="Date" onChange={(e) => FilterObject.endDate = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Checks</h4>
          <p>Click if these conditions should match</p>
        </div>
        <div className={styles.type_of_places}>
          <div className={styles.type_of_place} >
            <div style={{ borderColor: FilterObject.working ? 'red' : 'lightgrey' }} onClick={() => setFilterObject((e) => ({ ...e, working: !e.working }))}>
              <h4>Working</h4>
              <p>Filter Only working employees</p>
            </div>
            <div style={{ borderColor: FilterObject.online ? 'red' : 'lightgrey' }} onClick={() => setFilterObject((e) => ({ ...e, online: !e.online }))}>
              <h4>Online</h4>
              <p>Filter Only online employees</p>
            </div>
          </div>
        </div>
        <div className={styles.rooms}>
          <h4>Options</h4>
          <div className={styles.rooms_option} >
            <h5>Designation</h5>
            <div className={styles.options} >
              {designations.map((item, index) => {
                const selectedStyle = {
                  backgroundColor: 'black',
                  color: 'white'
                }
                return (
                  <div style={selectionObject?.designation === index ? selectedStyle : {}} onClick={() => {
                    setFilterObject((e) => ({ ...e, designation: item }))
                    setselectionObject((e) => ({ ...e, designation: index }))
                  }}>{item}</div>
                )
              })}
            </div>
          </div>
          <div className={styles.rooms_option} >
            <h5>Department</h5>
            <div className={styles.options} >
              {departments.map((item, index) => {
                const selectedStyle = {
                  backgroundColor: 'black',
                  color: 'white'
                }
                return (
                  <div style={selectionObject.department === index ? selectedStyle : {}} onClick={() => {
                    setFilterObject((e) => ({ ...e, department: item }))
                    setselectionObject((e) => ({ ...e, department: index }))
                  }}>{item}</div>
                )
              })}
            </div>
          </div>
        </div>
        {children}
        <Divider />
        {!onChange && <div className={styles.clear_flt} >
          <button onClick={clearFilter}>Clear all</button>
          <button onClick={() => render(FilterObject)}>Show 165  homes</button>
        </div>
        }
      </div>
    </>
  );
};

export default Filter;
