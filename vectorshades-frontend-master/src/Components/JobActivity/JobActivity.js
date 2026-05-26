import styles from "./JobActivity.module.css";

const JobActivity = ({ direct, total, added, removed, updated, date }) => {
  const dateObj = new Date(date)
  return (
    <>
      <div className={styles.job_activity_container}>
        <div className={styles.side_commits_main}>
          <div className={styles.progress_circle}>
          </div>
        </div>
        <div className={styles.main_width} >
          <h5 style={{ marginLeft: "23px" }}>{`${dateObj.toDateString()} ${dateObj.toTimeString()}`}</h5>
          <div className={styles.main_commits_container} >
            {direct &&
              <div className={styles.main_total_changes} >
                <h3>Direct Changes</h3>
                <br />
                {Object.keys(direct).map((key) => {
                  return (
                    <div className={styles.main_total_progress} >
                      <div className={styles.main_progress_commit}>
                        <div className={styles.main_progress_bar}>
                          <div className={styles.main_progress_circle}></div>
                        </div>
                      </div>
                      <div className={styles.main_progress_box} >{key} : {direct[key]}</div>
                    </div>
                  )
                })}
              </div>
            }

            {total &&
              <div className={styles.main_total_changes} >
                <h3>Main Total Changes</h3>
                <br />
                {Object.keys(total).map((key) => {
                  return (
                    <div className={styles.main_total_progress} >
                      <div className={styles.main_progress_commit}>
                        <div className={styles.main_progress_bar}>
                          <div className={styles.main_progress_circle}></div>
                        </div>
                      </div>
                      <div className={styles.main_progress_box} >{total[key]}</div>
                    </div>
                  )
                })}
              </div>
            }

            {/* {added || removed || updated && <h2>Point Logs</h2>} */}

            {added &&
              <div className={styles.main_total_changes} >
                <h3>Added Points</h3>
                <br />
                {added.map((value) => {
                  return (
                    <div className={styles.main_total_progress} >
                      <div className={styles.main_progress_commit}>
                        <div className={styles.main_progress_bar}>
                          <div className={styles.main_progress_circle}></div>
                        </div>
                      </div>
                      <div className={styles.main_progress_box} >{value}</div>
                    </div>
                  )
                })}
              </div>
            }

            {removed &&
              <div className={styles.main_total_changes} >
                <h3>Removed Points</h3>
                <br />
                {removed.map((value) => {
                  return (
                    <div className={styles.main_total_progress} >
                      <div className={styles.main_progress_commit}>
                        <div className={`${styles.main_progress_bar} ${styles.red_box}`}>
                          <div className={`${styles.main_progress_circle} ${styles.red_box}`}></div>
                        </div>
                      </div>
                      <div className={`${styles.main_progress_box} ${styles.red_box}`} >{value}</div>
                    </div>
                  )
                })}
              </div>
            }


            {updated &&
              <div className={styles.main_total_changes} >
                <h3>Updated Points</h3>
                <br />
                {updated.map((object) => {
                  object['point'] = object.name
                  return (
                    <table className={styles.ja_table} >
                      <thead>
                        <tr>
                          {Object.keys(object).map((key) => <td>{key}</td>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {Object.keys(object).map((key) => {
                            let splited = object[key].split(' ')
                            return <td>{splited[0]}</td>
                          })}
                        </tr>
                        <tr>
                          {Object.keys(object).map((key) => {
                            let splited = object[key].split(' ')
                            return <td>{splited.at(-1)}</td>
                          })}
                        </tr>
                      </tbody>
                    </table>
                  )
                })}
              </div>
            }

            {/* <div className={styles.main_total_changes} >
          <br />
          <div className={styles.sub_heading} >
            <h4>Updated Points</h4>
          </div>
          <table className={styles.ja_table} >
            <tr>
              <th>hours</th>
              <th>total cost</th>
              <th>bid hour</th>
              <th>name</th>
              <th>point</th>
            </tr>
            <tr>
              <td>212</td>
              <td>3392</td>
              <td>1061138.563707</td>
              <td>name</td>
              <td>backend</td>
            </tr>
            <tr>
              <td>212</td>
              <td>3392</td>
              <td>1061138.563707</td>
              <td>name</td>
              <td>backend</td>
            </tr>
          </table>
        </div> */}

          </div>
        </div>

      </div>
    </>
  );
};

export default JobActivity;
