import {
  CalendarToday,
  KeyboardArrowDown,
  Schedule,
} from "@mui/icons-material/";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import styles from "./EmpoyeeTimeSheet.module.css";


const Middle = ({ CurrentMonth, filterTimesheet, employeeBasicData }) => {
  const [value, setValue] = useState(dayjs(new Date()));

  return (
    <>
      <div className={styles.middle_main}>
        <div className={styles.middle_mid}>
          <div className={styles.middle_dropdown}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                label="Select Year and Month"
                value={value}
                onChange={(newValue) => {
                  filterTimesheet({ month: newValue.$M, year: newValue.$y });
                  setValue(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
          </div>
          {employeeBasicData && (
            <div className={styles.working_time}>
              <Schedule style={{ fill: "grey" }} />
              <h4>Working Time:</h4>
              <h4>
                {employeeBasicData.startTime} - {employeeBasicData.endTime}{" "}
              </h4>
            </div>
          )}
        </div>
             {/* <div className={styles.report_ls} >
             <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From"
                value={value}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
              <DatePicker
                label="To"
                value={value}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
            <button className={styles.report_ls_btn} >Get Report</button>
          </div> */}
      </div>
    </>
  );
};

export default Middle;
