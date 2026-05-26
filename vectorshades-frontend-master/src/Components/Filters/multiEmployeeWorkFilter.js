import { Close } from "@mui/icons-material";
import { Checkbox, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Slider, TextField } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import styles from "../../../styles/Filters.module.css";
import SelectUserInput from "../SelectUserInput";
import EmployeeWorkHoursByDepartment from "./EmployeeWorkHrsByDepartment";
import { ParentStore } from "../../../pages/_app";

/**
 * SelectMultiEmployeeFilter
 * 
 * Props:
 *  - onChange: function called with filter object { employeeId, fromDate, toDate }
 */
const SelectMultiEmployeeFilter = ({ onChange }) => {
    const [filterByDept, setFilterByDept] = useState('user');
    const [employees, setEmployees] = useState(null);
    const [department, setdepartment] = useState('')
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const { ParentState } = useContext(ParentStore)

    const handleChange = (value) => {
        console.log(value)
        setEmployees(value);
    };

    const handleEmployeeDelete = () => {
        setEmployeeId(null);
    };

    // Notify parent whenever any filter changes
    useEffect(() => {
        if (filterByDept !== 'users') onChange({ employees, fromDate, toDate, department, filterByDept });
    }, [employees, fromDate, toDate]);

    return (
        <>
            <div className={styles.report_container} style={{ height: 'auto', zIndex: 100 }}>
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        value={filterByDept}
                        onChange={(e) => setFilterByDept(e.target.value)}
                    >
                        <FormControlLabel
                            value="user"
                            control={<Radio />}
                            label="By Users"
                        />
                        <FormControlLabel
                            value="department"
                            control={<Radio />}
                            label="By Filters"
                        />
                        <FormControlLabel
                            value="rebarOrSteel"
                            control={<Radio />}
                            label="By Department"
                        />
                    </RadioGroup>
                </FormControl>
                {filterByDept === 'department' && <EmployeeWorkHoursByDepartment onChange={onChange} />}
                {filterByDept === 'user' && <>
                    <SelectUserInput
                        createJob={true}
                        returnUser={handleChange}
                        returnRaw={true}
                        multiSelect={true}
                        deleteUser={handleEmployeeDelete}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <TextField
                            label="From"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="To"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                </>}
                {filterByDept === 'rebarOrSteel' && <>
                    <div className={styles.price_range_box}>
                        <div>
                            <label>Department</label>
                            <select onChange={(e) => setdepartment(e.target.value)}>
                                <option hidden>select department</option>
                                {['SA','RB'].includes(ParentState?.auth.role) && <option key={'rebar'} value={'rebar'}>Rebar</option> }
                                {['SA','STL'].includes(ParentState?.auth.role) && <option key={'steel'} value={'steel'}>Steel</option>} 

                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <TextField
                            label="From"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="To"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                </>}

            </div>
            <br />
        </>
    );
};

export default SelectMultiEmployeeFilter;
