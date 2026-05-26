import { Search } from "@mui/icons-material";
import styles from "../../../styles/Employee.module.css";
import style from "../../../styles/Hr.module.css";
import ProfileImage from "../ProfileImage/Image";
import { getEmployeeWorkStatusController } from "../../Controllers/Employee";
import { useEffect, useState } from "react";
import Loader from "../Loader/loader";

export default function WorkStatus() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [workData, setWorkData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  function getWorkStatusSummary(data) {
    const totalEmployees = data.length;

    let workingEmployees = 0;
    let notWorkingEmployees = 0;
    let noProjectsAssigned = 0;
    let noTasksAssigned = 0;

    data.forEach(emp => {
      if (emp.isWorking) workingEmployees++;
      else notWorkingEmployees++;

      if (emp.totalProjects === 0) noProjectsAssigned++;
      if (emp.totalTasks === 0) noTasksAssigned++;
    });

    setSummary({
      totalEmployees,
      workingEmployees,
      notWorkingEmployees,
      noProjectsAssigned,
      noTasksAssigned,
    });
  }

  const fetchWorkStatus = async (searchQuery = '') => {
    const { data } = await getEmployeeWorkStatusController({ search: searchQuery });
    setWorkData(data.response.data);
    getWorkStatusSummary(data.response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkStatus();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
      fetchWorkStatus(debouncedSearch);
  }, [debouncedSearch]);

  if (loading) return <Loader />;

  return (
    <>
      <div className={styles.sp_container}>
        <section className="jobs" style={{ padding: 0, margin: 0 }}>
          <div style={{ fontSize: "25px" }} className="head">
            <h1>Work Status</h1>
          </div>
        </section>
        <p className="mt_1 grey">
          Track the work status of employees to ensure project completion and resource allocation.
        </p>

        <div className={style.ar_search_filter}>
          <input
            placeholder="Search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ cursor: "pointer" }}>
            <Search />
          </div>
        </div>

        <div className="job_month_analytics">
          <div className="job_analytics_title">
            <h2>Summary</h2>
            <h3>Analytics</h3>
          </div>
          <div className="job_analytics_title">
            <h3>Total Employees</h3>
            <h2>{summary?.totalEmployees}</h2>
          </div>
          <div className="job_analytics_title">
            <h3>Working Count</h3>
            <h2>{summary?.workingEmployees}</h2>
          </div>
          <div className="job_analytics_title">
            <h3>Idle Count</h3>
            <h2>{summary?.notWorkingEmployees}</h2>
          </div>
          <div className="job_analytics_title">
            <h3>No Projects Assigned</h3>
            <h2>{summary?.noProjectsAssigned}</h2>
          </div>
          <div className="job_analytics_title">
            <h3>No Tasks Assigned</h3>
            <h2>{summary?.noTasksAssigned}</h2>
          </div>
        </div>

        <div className={styles.sales_cards_container}>
          {workData.map(({ employee, isWorking, totalProjects, totalTasks, currentTask }) => (
            <div className={`${styles.sales_card} workst_card`} key={employee.id}>
              <div className={styles.sales_person}>
                <ProfileImage id={employee.id} />
                <div>
                  <h4>{employee.firstName + ' ' + employee.lastName}</h4>
                  <h5>{employee.designation}</h5>
                  <h5>{employee.email}</h5>
                </div>
              </div>

              <span style={{ backgroundColor: isWorking ? 'green' : '#80808054' }} className="label">
                {isWorking ? 'ON WORK' : 'IDLE'}
              </span>

              <div className="workst_bt1">
                <p><span>Total Projects</span> - {totalProjects}</p>
                <p><span>Total Tasks Assigned</span> - {totalTasks}</p>
              </div>

              {currentTask && (
                <div className="workst_bt2">
                  <p>{currentTask.name}</p>
                  <p>South Steel</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
