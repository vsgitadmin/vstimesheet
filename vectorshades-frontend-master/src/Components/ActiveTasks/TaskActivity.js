import { Tooltip } from "@mui/material";
import styles from "./TaskActivity.module.css";

const extractTimeFromDate = (date) => {
  const d = new Date(date)
  return d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit", hour12:true})
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Asia/Kolkata', timeZoneName: 'short', hour12: true
  }).format(new Date(dateString));
}

const TaskActivity = ({ data }) => {
  return (
    <>
      <div className={styles.job_activity_container}>
        <div className={styles.main_width} >
          <div className={styles.main_commits_container} >
            <div className={styles.main_total_changes} style={{position:'relative',left:'-30px'}}>
              {/* <h3>{new Date(k).toLocaleDateString(undefined,{month:"short", day:"2-digit",year:"numeric"})}</h3> */}
              <br />
              {data.map((obj) => {
                return (
                  <div className={styles.main_total_progress} >
                    <div className={styles.main_progress_commit}>
                      <div className={styles.main_progress_bar}>
                        <div className={styles.main_progress_circle}></div>
                      </div>
                    </div>
                    <div className={styles.main_progress_box} style={{padding:'1.7rem', backgroundColor: obj.edited ? '#93979396':'', marginBottom:'10px'}}> {formatDate(obj.createdAt)} : {obj.text}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default TaskActivity;
