import { Close } from "@mui/icons-material";
import { Divider, Slider } from "@mui/material";
import { useState , useEffect} from "react";
import styles from "../../../styles/Filters.module.css";
import SelectUserInput from "../SelectUserInput";

const SelectEmployeeFilter = ({onChange}) => {
const [Employee, setEmployee] = useState()

  const handleChange = (value) => {
    setEmployee(value._id)
    onChange(value._id)
  };

  const handleEmployeeDelete = () => {
    setEmployee(null)
  }

  return (
    <>
      <div className={styles.report_container} style={{height:'10em',zIndex:100}} >
      <SelectUserInput createJob={true} returnUser={handleChange} returnRaw={true} deleteUser={handleEmployeeDelete} />
        </div>
        <br/>
    </>
  );
};

export default SelectEmployeeFilter;
