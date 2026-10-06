import ProfileImage from '../ProfileImage/Image';
import styles from '../../../styles/EmployeeList.module.css'
import { useContext, useEffect, useState } from 'react';
import { getAllBasicEmployees } from "../../Controllers/Employee/index"
import { Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { ParentStore } from '../../../pages/_app';
import { Download } from '@mui/icons-material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import InboxIcon from '@mui/icons-material/Inbox';

function EmpsList() {
  const { ParentState } = useContext(ParentStore)
  const [employees, setEmployees] = useState([])
  const router = useRouter()

  useEffect(() => { fetchEmployees() }, [])

  const fetchEmployees = (search) => {
    getAllBasicEmployees({ search }).then((res) => {
      setEmployees(res.data.response.data)
    }).catch((err) => console.log(err))
  }

  const searchEmployeeFunction = (e) => {
    let search = e.target.value
    if (search && search != '') fetchEmployees(e.target.value)
    else fetchEmployees()
  }

  const handleViewClick = (id) => {
    router.push(`/admin/dashboard/projects/employee/performance/${id}`)
  }

  const isValidAdmin = () => {
    return ['SA', 'STL', 'RB', 'PA'].includes(ParentState?.auth?.role)
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><GroupsOutlinedIcon /></span>Production report</h1>
          <p className={styles.subtitle}>View the list of employees and their details</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchOutlinedIcon />
          <input placeholder='Search employees...' type="text" onChange={searchEmployeeFunction} />
        </div>
        <span className={styles.countBadge}><strong>{employees.length}</strong> employee{employees.length === 1 ? '' : 's'}</span>
      </div>

      {employees.length > 0 ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Online/Offline</th>
                <th>Phone</th>
                <th>Email</th>
                {isValidAdmin() && <>
                  <th>Projects assigned</th>
                  <th>Tasks assigned</th>
                  <th>Action</th>
                  <th>Download</th>
                </>
                }
              </tr>
            </thead>
            <tbody>
              {
                employees.map((emp) => {
                  return <tr key={emp._id}>
                    <td>
                      <div className={styles.empCell}>
                        <ProfileImage id={emp._id} size={38} />
                        <span>{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td>{emp.designation}</td>
                    <td>{emp.department}</td>
                    <td>
                      <span className={`${styles.statusPill} ${emp.online ? styles.statusOnline : styles.statusOffline}`}>
                        <FiberManualRecordIcon />{emp.online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td>{emp.phone || '—'}</td>
                    <td>{emp.personalEmail}</td>
                    {isValidAdmin() && <>
                      <td>{emp.projectsAssigned}</td>
                      <td>{emp.tasksAssigned}</td>
                    </>}
                    {isValidAdmin() && <td>
                      <button type="button" className={styles.viewBtn} onClick={() => handleViewClick(emp._id)}>
                        <VisibilityOutlinedIcon />View
                      </button>
                    </td>}
                    {isValidAdmin() && <td>
                      <Tooltip title="Download">
                        <button type="button" className={styles.downloadBtn}><Download fontSize="small" /></button>
                      </Tooltip>
                    </td>}
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <InboxIcon />
          <h4>No employees found</h4>
          <p>Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}

export default EmpsList;
