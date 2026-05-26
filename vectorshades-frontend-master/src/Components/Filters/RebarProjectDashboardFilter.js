import { Close } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import styles from "../../../styles/Filters.module.css";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRebarClients } from "../../Constants/rebarClients";

const RebarProjectDashboardFilter = ({ setIsFilterOpen, render, onChange, children }) => {
    const [FilterObject, setFilterObject] = useState({});
    const [selectionObject, setselectionObject] = useState([]);
    const [ClientSelectionObject, setClientSelectionObject] = useState([]);
    const { clients: RebarClients } = useRebarClients();

    const location = ['kochi', 'chennai'];

    const clearFilter = () => {
        setFilterObject({});
        setselectionObject([]);
        setClientSelectionObject([]);
        setIsFilterOpen(false);
    };

    useEffect(() => {
        setFilterObject((prev) => {
            const updated = { ...prev };
            if (ClientSelectionObject.length === 0) delete updated.client;
            else updated.client = ClientSelectionObject;
            return updated;
        });
    }, [ClientSelectionObject]);

    useEffect(() => {
        setFilterObject((prev) => {
            const updated = { ...prev };
            if (selectionObject.length === 0) delete updated.location;
            else updated.location = selectionObject;
            return updated;
        });
    }, [selectionObject]);

    useEffect(() => {
        if (onChange) onChange(FilterObject);
    }, [FilterObject]);

    const handleInputChange = (key, value) => {
        setFilterObject((prev) => ({ ...prev, [key]: value }));
    };

    const toggleFilterBoolean = (key) => {
        setFilterObject((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className={onChange ? styles.report_container : styles.job_flt_container}>
            <div className={styles.flt_title}>
                <h4>Filters</h4>
                {!onChange && <Close onClick={() => setIsFilterOpen(false)} style={{ cursor: "pointer" }} />}
            </div>
            <Divider />

            <div className={styles.price_range}>
                <h4>Billing Backlog</h4>
                <p>Get the Job where Billing Backlog is in the range</p>
            </div>
            <div className={styles.price_range_box}>
                <div>
                    <label>Min</label>
                    <input type="number" defaultValue={0} onChange={(e) => handleInputChange("billing_backlog_start", e.target.value)} />
                </div>
                <div>
                    <label>Max</label>
                    <input type="number" defaultValue={0} onChange={(e) => handleInputChange("billing_backlog_end", e.target.value)} />
                </div>
            </div>

            <div className={styles.type_of_places}>
                <div className={styles.type_of_place}>
                    <div
                        style={{ borderColor: FilterObject.workInProgress ? "red" : "lightgrey" }}
                        onClick={() => toggleFilterBoolean("workInProgress")}
                    >
                        <h4>Work In Progress</h4>
                        <p>Projects currently in progress</p>
                    </div>
                    <div
                        style={{ borderColor: FilterObject.onHold ? "red" : "lightgrey" }}
                        onClick={() => toggleFilterBoolean("onHold")}
                    >
                        <h4>On Hold</h4>
                        <p>Filter Only Hold Jobs</p>
                    </div>
                </div>
            </div>

            <br />
            <div className={styles.price_range}>
                <h4>Select Client</h4>
                <p>Select Required Client</p>
            </div>

            <div className={styles.rooms}>
                <h4>Options</h4>

                {/* Clients */}
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
                            const isSelected = ClientSelectionObject.includes(item);
                            const selectedStyle = {
                                backgroundColor: "black",
                                color: "white",
                            };
                            return (
                                <div
                                    key={item}
                                    style={isSelected ? selectedStyle : {}}
                                    onClick={() => {
                                        if (isSelected) {
                                            setClientSelectionObject((prev) => prev.filter((e) => e !== item));
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

                {/* Locations */}
                <div className={styles.rooms_option}>
                    <h5>Location</h5>
                    <div className={styles.options}>
                        {location.map((item) => {
                            const isSelected = selectionObject.includes(item);
                            const selectedStyle = {
                                backgroundColor: "black",
                                color: "white",
                            };
                            return (
                                <div
                                    key={item}
                                    style={isSelected ? selectedStyle : {}}
                                    onClick={() => {
                                        if (isSelected) {
                                            setselectionObject((prev) => prev.filter((e) => e !== item));
                                        } else {
                                            setselectionObject((prev) => [...prev, item]);
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

export default RebarProjectDashboardFilter;
