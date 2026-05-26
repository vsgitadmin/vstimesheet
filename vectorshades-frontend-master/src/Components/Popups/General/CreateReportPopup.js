import { useState, useEffect } from 'react';
import { AssignmentOutlined, CategoryOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { Checkbox, Modal } from '@mui/material';
import CreateReportFilter from '../../Filters/CreateReportFilter';
import styles from './Popup.module.css'
import style from '../../../../styles/Filters.module.css'
import EmployeeListFilter from '../../Filters/EmployeeListFilter'
import JobsListFilter from '../../Filters/AllJobsFilter'
import AwardedJobsFilter from '../../Filters/AwardJobsFilter'
import DashboardJobsFilter from '../../Filters/ProjectDashboardFilter'
import LeavesFilter from '../../Filters/LeavesFilter'
import SelectEmployeeFilter from '../../Filters/EmployeeFilter';
import EmployeeLogsFilter from '../../Filters/employeeLogsFilter';
import CompanyLogsFilter from '../../Filters/companyLogsFilter';
import SelectMultiEmployeeFilter from '../../Filters/multiEmployeeWorkFilter';
import CompProjectFilter from '../../Filters/projectFilter';
import RebarJobsFilter from '../../Filters/rebarJobsFilter';
import RebarAwardJobsFilter from '../../Filters/RebarAwardJobsFiler';
import RebarProjectDashboardFilter from '../../Filters/RebarProjectDashboardFilter';

const CreateReportPopup = ({ createReportPopup, setCreateReportPopup, createReport, Keys }) => {
  const [data, setdata] = useState({})
  const [filter, setfilter] = useState({})
  const [availableKeys, setavailableKeys] = useState([]);
  const [type, settype] = useState("employee")
  const [allKeysSelected, setallKeysSelected] = useState(false)
  const [selectedKeys, setselectedKeys] = useState([])
  const handleClose = () => setCreateReportPopup(false);

  const createReportFunction = (e) => {
    e.preventDefault()
    const body = { ...data, ['queryObject']: filter, ['keys']: selectedKeys, ['type']: e.target[2].value }
    createReport(body)
  }

  useEffect(() => {
    setselectedKeys([])
    setavailableKeys(Keys[type]); data.type = type; settype(type)
  }, [availableKeys, createReportPopup, setCreateReportPopup])

  const addKey = (key) => {
    if (selectedKeys.includes(key)) setselectedKeys(selectedKeys.filter(k => k !== key));
    else setselectedKeys([...selectedKeys, key]);
  }

  const SelectFileds = () => {
    return (
      <>
        <div className={styles.cr_title}>
          <h2>Select Fields</h2>
          <Checkbox checked={allKeysSelected} onClick={(e) => {
            setallKeysSelected(e.target.checked)
            if(e.target.checked === false){
              setselectedKeys([])
            }else{
              setselectedKeys(availableKeys)
            }
          }}/>
        </div>
        <div className={style.rooms} key={data}>
          <div className={style.rooms_option} >
            <div className={style.options} >
              {availableKeys?.map((key) => {
                const selectedStyle = {
                  backgroundColor: 'black',
                  color: 'white'
                }
                return (
                  <div style={selectedKeys.includes(key) ? selectedStyle : {}} onClick={() => addKey(key)}>{key}</div>
                )
              })}
            </div>
          </div>
        </div>
      </>
    )
  }

  const fetchLeaves = (query) => {
    return true
  }

  return (
    <>
      <Modal open={createReportPopup} onClose={handleClose} >
        <form onSubmit={createReportFunction} className={styles.create_report_popup}>
          <div className={styles.cr_title}>
            <h2>Report Details</h2>
          </div>
          <div className={styles.cr_basic_details}>
            <div className={styles.cr_basic_detail}>
              <h3><AssignmentOutlined />Name</h3>
              <input name={"name"} type="text" placeholder='eg. employee analytics' onChange={(e) => data.name = e.target.value} />
            </div>
            <div className={styles.cr_basic_detail}>
              <h3><InsertDriveFileOutlined />File</h3>
              <input name={"file"} type="text" placeholder='eg. employee_data_1' onChange={(e) => data.file = e.target.value} />
            </div>
            <div className={styles.cr_basic_detail}>
              <h3><CategoryOutlined />Type</h3>
              <select name={"type"} onChange={(e) => { setavailableKeys(Keys[e.target.value]); data.type = e.target.value; settype(e.target.value) }} >
                <option hidden>Select Data</option>
                <option value="employee">Employee</option>
                <option value="jobs">Jobs</option>
                <option value="awardedJobs">Awarded jobs</option>
                <option value="projectJobs">Project Dashboard</option>
                <option value="rebarJobs">Rebar Jobs</option>
                <option value="rebarAwardedJobs">Rebar Awarded jobs</option>
                <option value="rebarAwardedDashboardJobs">Rebar Project Dashboard</option>
                <option value="employeeWorkHrs">Employee Work Hours</option>
                <option value="projectProduction">Project Production</option>
                <option value="projectBilling">Project Billing</option>
                <option value="employeeProductionHrs">Employee Production Hrs</option>
                <option value="employeeBillingReport">Employee Billing</option>
                <option value="employeeLogsReport">Employee Logs</option>
                <option value="CompanyLogsFilter">Company Logs</option>
                {/* <option value="leaves">Leaves</option> */}
              </select>
            </div>
          </div>
          <div key={type}>
            {type === "employee" &&
              <EmployeeListFilter render={null} setIsFilterOpen={true} onChange={(filterObj) => setfilter(filterObj)}>
                <SelectFileds />
              </EmployeeListFilter>
            }
            {type === "leaves" &&
              <LeavesFilter onChange={(filterObj) => setfilter(filterObj)} render={null} toggledFilter={true} setToggledFilter={null} fetchLeaves={fetchLeaves} setIsFilterOpen={null}>
                <SelectFileds />
              </LeavesFilter>
            }
            {type === "jobs" &&
              <JobsListFilter render={null} setIsFilterOpen={true} onChange={(filterObj) => setfilter(filterObj)} >
                <SelectFileds />
              </JobsListFilter>
            }
            {type === "awardedJobs" &&
              <AwardedJobsFilter render={null} setIsFilterOpen={true} onChange={(filterObj) => setfilter(filterObj)} >
                <SelectFileds />
              </AwardedJobsFilter>}
            {type === "projectJobs" &&
              <DashboardJobsFilter render={null} setIsFilterOpen={true} onChange={(filterObj) => setfilter(filterObj)} >
                <SelectFileds />
              </DashboardJobsFilter>
            }
            {
              type === "employeeProductionHrs" &&
              <>
                <SelectEmployeeFilter onChange={(e) => setfilter({ id: e })} >
                  <SelectFileds />
                </SelectEmployeeFilter>
              </>
            }
            {
              type === "rebarJobs" &&
              <>
                <RebarJobsFilter render={null} setIsFilterOpen={true} onChange={(filterObj) => setfilter({ ...filterObj, rebar: true, report: true })} >
                  <SelectFileds />

                </RebarJobsFilter>
              </>
            }
            {
              type === "rebarAwardedJobs" &&
              <>
                <RebarAwardJobsFilter render={null} setIsFilterOpen={true} onChange={(filterObj) => setfilter({ ...filterObj, rebar: true, report: true })} >
                  <SelectFileds />
                </RebarAwardJobsFilter>
              </>
            }
            {
              type === "rebarAwardedDashboardJobs" &&
              <>
                <RebarProjectDashboardFilter render={null} setIsFilterOpen={true} onChange={(filterObj) => setfilter({ ...filterObj, rebar: true, report: true })} >
                  <SelectFileds />

                </RebarProjectDashboardFilter>
              </>
            }
            {
              type === "employeeWorkHrs" &&
              <>
                <SelectMultiEmployeeFilter onChange={(e) => setfilter(e)} />
              </>
            }
            {
              type === "employeeBillingReport" &&
              <>
                <SelectEmployeeFilter onChange={(e) => setfilter({ id: e })} />
                <SelectFileds />
              </>
            }
            {
              type === "employeeLogsReport" &&
              <>
                <EmployeeLogsFilter onChange={(e) => setfilter({ ...e })} />
                <SelectFileds />
              </>
            }
            {
              type === "CompanyLogsFilter" &&
              <>
                <CompanyLogsFilter onChange={(e) => setfilter({ ...e })} />
                <SelectFileds />
              </>
            }
            {
              type === "projectProduction" &&
              <>
                <CompProjectFilter onChange={(e) => setfilter({ ...e })} />
                <SelectFileds />
              </>
            }
            {
              type === "projectBilling" &&
              <>
                <CompProjectFilter onChange={(e) => setfilter({ ...e })} />
                <SelectFileds />

              </>
            }
          </div>
          <div className={styles.cr_create_btn}>
            <button type={'submit'} >CREATE</button>
            <button onClick={handleClose} >CANCEL</button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default CreateReportPopup