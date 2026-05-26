import { useState, useEffect } from "react";
import styles from "../../../styles/Filters.module.css";
import departments from "../../Constants/departments";
import designations from "../../Constants/designation";

const CompanyLogsFilter = ({ onChange }) => {
    const [FilterObject, setFilterObject] = useState({
        created_start: '',
        created_end: '',
        department: '',
        designation: '',
        location: ''
    });

    const handleStartChange = (e) => {
        setFilterObject((prevState) => ({
            ...prevState,
            created_start: e.target.value
        }));
    };

    const handleEndChange = (e) => {
        setFilterObject((prevState) => ({
            ...prevState,
            created_end: e.target.value
        }));
    };

    const handleDepartmentChange = (e) => {
        setFilterObject((prevState) => ({
            ...prevState,
            department: e.target.value
        }));
    };

    const handleDesignationChange = (e) => {
        setFilterObject((prevState) => ({
            ...prevState,
            designation: e.target.value
        }));
    };

    const handleLocationChange = (e) => {
        setFilterObject((prevState) => ({
            ...prevState,
            location: e.target.value
        }));
    };

    useEffect(() => {
        onChange(FilterObject);
    }, [FilterObject]);

    return (
        <>
            <div className={styles.report_container} style={{ height: '10em', zIndex: 100 }}>
                <div className={styles.price_range}>
                    <h4>Date Range</h4>
                    <p>Get hour logs in the specified range</p>
                </div>
                <div className={styles.price_range_box}>
                    <div>
                        <label>Start</label>
                        <input type="date" onChange={handleStartChange} />
                    </div>
                    <div>
                        <label>End</label>
                        <input type="date" onChange={handleEndChange} />
                    </div>
                </div>
                <br />
                <h4>Options</h4>
                <p>Get Logs Based on filters</p>
                <div className={styles.price_range_box}>
                    <div>
                        <label>Department</label>
                        <select onChange={handleDepartmentChange}>
                            <option hidden>select department</option>
                            {departments.map((key) => {
                                return (
                                    <option key={key} value={key}>{key}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label>Designation</label>
                        <select onChange={handleDesignationChange}>
                            <option hidden>select designation</option>
                            {designations.map((key) => {
                                return (
                                    <option key={key} value={key}>{key}</option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className={styles.price_range_box}>
                    <div>
                        <label>Location</label>
                        <select onChange={handleLocationChange}>
                            <option hidden>select Location</option>
                            <option value={'Chennai'}>Chennai</option>
                            <option value={'Kochi'}>Kochi</option>
                        </select>
                    </div>
                </div>
            </div>
            <br />
        </>
    );
};

export default CompanyLogsFilter;
