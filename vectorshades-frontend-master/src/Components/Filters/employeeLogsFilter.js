import { Close } from "@mui/icons-material";
import { Divider, Slider } from "@mui/material";
import { useState, useEffect } from "react";
import styles from "../../../styles/Filters.module.css";
import SelectUserInput from "../SelectUserInput";

const EmployeeLogsFilter = ({ onChange }) => {
    const [FilterObject, setfilterObject] = useState({
        created_start: '',
        created_end: '',
        id: ''
    })
    const [Employee, setEmployee] = useState()

    const handleChange = (value) => {
        FilterObject.id = value._id
        setEmployee(value)
        onChange(FilterObject)
    };

    const handleStartChange = (e) => {

        FilterObject.created_start = e.target.value
        onChange(FilterObject)
    };

    const handleEndChange = (e) => {
        FilterObject.
            created_end = e.target.value
        onChange(FilterObject)
    };

    const handleEmployeeDelete = () => {
        setEmployee(null)
    }

    return (
        <>
            <div className={styles.report_container} style={{ height: '10em', zIndex: 100 }} >
                <SelectUserInput createJob={true} returnUser={handleChange} returnRaw={true} deleteUser={handleEmployeeDelete} />
                <div className={styles.price_range} >
                    <h4>Date Range</h4>
                    <p>Get hour logs in the specified range</p>
                </div>
                <div className={styles.price_range_box}>
                    <div>
                        <label>Start</label>
                        <input type="date" defaultValue={0} onChange={handleStartChange} />
                    </div>
                    <div>
                        <label>End</label>
                        <input type="date" defaultValue={0} onChange={handleEndChange} />
                    </div>
                </div>
                <br />
            </div>
            <br />
        </>
    );
};

export default EmployeeLogsFilter;
