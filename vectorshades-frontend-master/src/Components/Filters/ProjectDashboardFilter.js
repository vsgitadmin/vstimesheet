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
  const client = ['TCS', 'Google', 'Microsoft', 'Oracle', 'IBM']

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
      <div className={onChange ? styles.report_container : styles.job_flt_container}  >
        <div className={styles.flt_title} >
          <h4>Filters</h4>
          {!onchange && <Close onClick={() => setIsFilterOpen(false)} style={{ cursor: "pointer" }} />}
        </div>
        <Divider />

        <div className={styles.price_range} >
          <h4>PO Price</h4>
          <p>Get the Job where PO Price is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.po_price_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.po_price_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>CO Price</h4>
          <p>Get the Job where CO Price is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.co_price_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.co_price_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Billed</h4>
          <p>Get the Job where Billed is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.billed_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.billed_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Billing Backlog</h4>
          <p>Get the Job where Billing Backlog is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.billing_backlog_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.billing_backlog_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>OFA Backlog</h4>
          <p>Get the Job where OFA Backlog is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.ofa_backlog_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.ofa_backlog_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>FAB Backlog</h4>
          <p>Get the Job where FAB Backlog is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.fab_backlog_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.fab_backlog_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Bid Hours</h4>
          <p>Get the Job where Bid Hours is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.bid_hours_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.bid_hours_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>CO Hours</h4>
          <p>Get the Job where CO Hours is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.co_hours_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.co_hours_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Used Hours</h4>
          <p>Get the Job where Used Hours is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.used_hours_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.used_hours_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Backlog Hours</h4>
          <p>Get the Job where Backlog Hours is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Min</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.backlog_hours_start = e.target.value} />
          </div>
          <div>
            <label>Max</label>
            <input type="number" defaultValue={0} onChange={(e) => FilterObject.backlog_hours_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Created Start</h4>
          <p>Get the Job where Created Start is in the range</p>
        </div>
        <div className={styles.price_range_box}>
          <div>
            <label>Start</label>
            <input type="date" defaultValue={0} onChange={(e) => FilterObject.created_start = e.target.value} />
          </div>
          <div>
            <label>End</label>
            <input type="date" defaultValue={0} onChange={(e) => FilterObject.created_end = e.target.value} />
          </div>
        </div>
        <div className={styles.price_range} >
          <h4>Select Client </h4>
          <p>Select Required Client</p>
        </div>
        <div className={styles.rooms}>
          <h4>Options</h4>
          <div className={styles.rooms_option} >
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
          </div>
        </div>
        {children}
        <Divider />
        {!onChange && <div className={styles.clear_flt} >
          <button onClick={clearFilter}>Clear all</button>
          <button onClick={() => render(FilterObject)}>Filter</button>
        </div>}

      </div>
    </>
  );
};

export default Filter;
