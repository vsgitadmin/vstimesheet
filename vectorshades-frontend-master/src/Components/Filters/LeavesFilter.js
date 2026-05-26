import { Divider } from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "../../../styles/Filters.module.css";
import { useEffect, useState } from "react";
import LeaveTypes from '../../Constants/leavetypes'

const LeavesFilter = ({ setIsFilterOpen, fetchLeaves, toggledFilter, setToggledFilter, render, children, onChange }) => {

  const [checks, setChecks] = useState({})
  const [leavetypes, setleavetypes] = useState([])
  const [dateFilter, setDateFilter] = useState({ startDate: null, endDate: null })

  const handleFilterSubmit = () => {
    setToggledFilter(true)
    fetchLeaves({ ...checks, leaveTypes: leavetypes, dateFilter, filter: true })
    setIsFilterOpen(false)
  }

  useEffect(() => {
    if (render) onChange({ ...checks, leaveTypes: leavetypes, dateFilter, filter: true })
  }, [checks, leavetypes, dateFilter])



  return (
    <div className={render === null ? `${styles.report_container} ${styles.leave_contr}` : `${styles.emp_container} ${styles.leave_contr}`}  >
      <div className={styles.flt_title} >
        <h4>Filters</h4>
        {render !== null && <Close onClick={() => setIsFilterOpen(false)} style={{ cursor: "pointer" }} />}
      </div>
      <Divider />
      <div className={styles.price_range} >
        <h4>Leave Date</h4>
        <p>Get the employees where joining date is in the range</p>
      </div>
      <div className={styles.price_range_box}>
        <div onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })} >
          <label>Start Date</label>
          <input type="Date" />
        </div>
        <div onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}>
          <label>End Date</label>
          <input type="Date" />
        </div>
      </div>
      <div className={styles.price_range} >
        <h4>Checks</h4>
        <p>Click if these conditions should match</p>
      </div>
      <div className={styles.type_of_places}>
        <div className={styles.type_of_place} >
          <div style={{ borderColor: checks.pod && 'red' }} onClick={() => { setChecks({ ...checks, pod: checks.pod ? null : true }) }}>
            <h4>Part of day</h4>
            <p>Filter Only part of day leaves</p>
          </div>
          <div style={{ borderColor: checks.approved && 'red' }} onClick={() => { setChecks({ ...checks, approved: checks.approved ? null : true }) }}>
            <h4>Approved</h4>
            <p>Filter Only approved leaves</p>
          </div>
        </div>
      </div>
      <div className={styles.rooms}>
        <h4>Options</h4>
        <div className={styles.rooms_option}  >
          <h5>Leave type</h5>
          <div className={styles.options} >
            {leavetypes && LeaveTypes.map((l) => {
              return <div onClick={() => {
                if (leavetypes.includes(l.key)) {
                  setleavetypes(leavetypes.filter((lt) => lt != l.key))
                } else {
                  setleavetypes([...leavetypes, ...[l.key]])
                }
              }} style={{ backgroundColor: leavetypes.includes(l.key) && 'red', color: leavetypes.includes(l.key) && 'white' }}>{l.name}</div>
            })}
          </div>
        </div>
      </div>
      {children}
      <Divider />
      <div className={styles.clear_flt} >
        <button>Clear all</button>
        {render !== null && <button onClick={handleFilterSubmit}>Show filtered leaves</button>}
      </div>
    </div>
  );
};

export default LeavesFilter;
