import { Close } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import styles from "../../../styles/Filters.module.css";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRebarClients } from "../../Constants/rebarClients";

const RebarJobsFilter = ({ setIsFilterOpen, render, onChange, children }) => {
    const [value, setValue] = useState([20, 80]);
    const [FilterObject, setFilterObject] = useState({});
    const [selectionObject, setselectionObject] = useState([]);
    const [ClientSelectionObject, setClientSelectionObject] = useState([]);
    const { clients: RebarClients } = useRebarClients();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const clearFilter = () => {
        setFilterObject({});
        setselectionObject([]);
        setClientSelectionObject([]);
        setIsFilterOpen(false);
    };

    useEffect(() => {
        if (ClientSelectionObject.length === 0) {
            setFilterObject((prev) => {
                const { client, ...rest } = prev;
                return rest;
            });
        } else {
            setFilterObject((prev) => ({ ...prev, client: ClientSelectionObject }));
        }
    }, [ClientSelectionObject]);

    useEffect(() => {
        if (selectionObject.length === 0) {
            setFilterObject((prev) => {
                const { location, ...rest } = prev;
                return rest;
            });
        } else {
            setFilterObject((prev) => ({ ...prev, location: selectionObject }));
        }
    }, [selectionObject]);

    const handleDateChange = (key, value) => {
        setFilterObject((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (onChange) onChange(FilterObject)
    }, [FilterObject])

    return (
        <div className={onChange ? styles.report_container : styles.job_flt_container}>
            <div className={styles.flt_title}>
                <h4>Filters</h4>
                {!onChange && <Close onClick={() => setIsFilterOpen(false)} style={{ cursor: "pointer" }} />}
            </div>
            <Divider />
            <div className={styles.price_range}>
                <h4>Start Date</h4>
                <p>Get the Job where start date is in the range</p>
            </div>
            <div className={styles.price_range_box}>
                <div>
                    <label>Start Date</label>
                    <input
                        type="date"
                        onChange={(e) => handleDateChange("start", e.target.value)}
                    />
                </div>
                <div>
                    <label>End Date</label>
                    <input
                        type="date"
                        onChange={(e) => handleDateChange("end", e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.price_range}>
                <h4>Checks</h4>
                <p>Click if these conditions should match</p>
            </div>
            <div className={styles.type_of_places}>
                <div className={styles.type_of_place}>
                    <div
                        style={{ borderColor: FilterObject.awarded === true ? 'red' : 'lightgrey' }}
                        onClick={() => setFilterObject((prev) => ({ ...prev, awarded: true }))}
                    >
                        <h4>Awarded</h4>
                        <p>Filter Only Awarded Jobs</p>
                    </div>
                    <div
                        style={{ borderColor: FilterObject.awarded === false ? 'red' : 'lightgrey' }}
                        onClick={() => setFilterObject((prev) => ({ ...prev, awarded: false }))}
                    >
                        <h4>Non Awarded Jobs</h4>
                        <p>Filter Only Non Awarded Jobs</p>
                    </div>
                    <div
                        style={{ borderColor: FilterObject.onHold === true ? 'red' : 'lightgrey' }}
                        onClick={() => setFilterObject((prev) => ({ ...prev, onHold: true }))}
                    >
                        <h4>On Hold Jobs</h4>
                        <p>Filter Only On Hold Jobs</p>
                    </div>
                    <div
                        style={{
                            borderColor:
                                FilterObject.awarded === undefined && FilterObject.onHold === undefined
                                    ? 'red'
                                    : 'lightgrey'
                        }}
                        onClick={() => {
                            setFilterObject((prev) => {
                                const { awarded, onHold, ...rest } = prev;
                                return rest;
                            });
                        }}
                    >
                        <h4>All Jobs</h4>
                        <p>Fetch All Jobs</p>
                    </div>
                </div>
            </div>
            <div className={styles.rooms}>
                <h4>Options</h4>
                <div className={styles.rooms_option}>
                    <h5>
                        Clients{" "}
                        <DoneAllIcon
                            onClick={() => setClientSelectionObject(Object.keys(RebarClients))}
                            style={{ fill: "#e64848", cursor: "pointer" }}
                        />
                    </h5>
                    <div className={styles.options}>
                        {Object.keys(RebarClients).map((item) => {
                            const selectedStyle = {
                                backgroundColor: "black",
                                color: "white",
                            };
                            const isSelected = ClientSelectionObject.includes(item);
                            return (
                                <div
                                    key={item}
                                    style={isSelected ? selectedStyle : {}}
                                    onClick={() => {
                                        if (isSelected) {
                                            setClientSelectionObject((prev) =>
                                                prev.filter((e) => e !== item)
                                            );
                                        } else {
                                            setClientSelectionObject((prev) => [...prev, item]);
                                        }
                                    }}
                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {children}
            <Divider />
            {!onChange && (
                <div className={styles.clear_flt}>
                    <button onClick={clearFilter}>Clear all</button>
                    <button onClick={() => render(FilterObject)}>Filter</button>
                </div>
            )}
        </div>
    );
};

export default RebarJobsFilter;
