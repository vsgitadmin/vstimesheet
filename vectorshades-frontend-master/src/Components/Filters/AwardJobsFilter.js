import { Close } from "@mui/icons-material";
import { Divider, Slider } from "@mui/material";
import { useState, useEffect } from "react";
import styles from "../../../styles/Filters.module.css";
import { useClients } from "../../Constants/clients";
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Filter = ({ setIsFilterOpen, render, onChange, children }) => {
  const [value, setValue] = useState([20, 80]);
  const [FilterObject, setFilterObject] = useState({});
  const [selectionObject, setselectionObject] = useState([])
  const [ClientSelectionObject, setClientSelectionObject] = useState([])
  const { clients } = useClients();

  const location = ['kochi', 'chennai']

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const clearFilter = () => {
    setFilterObject({})
    setselectionObject({})
    setIsFilterOpen(false)
  }


  useEffect(() => {
    if (ClientSelectionObject.length === 0) delete FilterObject['client']
    else FilterObject['client'] = ClientSelectionObject
  }, [ClientSelectionObject])

  useEffect(() => {
    if (selectionObject.length === 0) delete FilterObject['location']
    else FilterObject['location'] = selectionObject
  }, [selectionObject])


  useEffect(() => {
    if (onChange) onChange(FilterObject)
  }, [FilterObject])


  return (
    <>
      <div className={onChange ? styles.report_container : styles.awrd_container}  >
        <div className={styles.flt_title} >
          <h4>Filters</h4>
          {!onChange && <Close onClick={() => setIsFilterOpen(false)} style={{ cursor: "pointer" }} />}
        </div>
        <Divider />
        <div className={styles.price_range} >
          <h4>Start Date</h4>
          <p>Get the Job where start date is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Start Date</label>
            <input type="Date" onChange={(e) => FilterObject.start = e.target.value} />
          </div>
          <div>
            <label>End Date</label>
            <input type="Date" onChange={(e) => FilterObject.end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Tonnage</h4>
          <p>Get the Job where Tonnage is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.tonnageStart = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.tonnageEnd = e.target.value} />
          </div>
        </div>
        <div className={styles.rooms}>
          <h4>Options</h4>
          <div className={styles.rooms_option} >
            <h5>Location</h5>
            <div className={styles.options} >
              {location.map((item, index) => {
                const selectedStyle = {
                  backgroundColor: 'black',
                  color: 'white'
                }
                return (
                  <div style={selectionObject.includes(item) ? selectedStyle : {}} onClick={() => {
                    if (selectionObject.includes(item)) setselectionObject(selectionObject.filter((e) => e !== item))
                    else setselectionObject((e) => [...e, item])
                  }}>{item}</div>
                )
              })}
            </div>
            <br />
            <h5>Clients <DoneAllIcon onClick={() => setClientSelectionObject(Object.keys(clients))} style={{ fill: '#e64848' }} /> </h5>

            <div className={styles.options} >
              {Object.keys(clients).map((item, index) => {
                const selectedStyle = {
                  backgroundColor: 'black',
                  color: 'white'
                }
                return (
                  <div style={ClientSelectionObject.includes(item) ? selectedStyle : {}} onClick={() => {
                    if (ClientSelectionObject.includes(item)) setClientSelectionObject(ClientSelectionObject.filter((e) => e !== item))
                    else setClientSelectionObject((e) => [...e, item])
                  }}>{item}</div>
                )
              })}
            </div>
          </div>
        </div>
        {children}
        <Divider />
        {!onChange &&
          <div className={styles.clear_flt} >
            <button onClick={clearFilter}>Clear all</button>
            <button onClick={() => render(FilterObject)}>Filter</button>
          </div>
        }
      </div>
    </>
  );
};

export default Filter;
