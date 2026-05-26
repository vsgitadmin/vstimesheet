import ProfileImage from '../ProfileImage/Image';
import styles from '../../../styles/Hr.module.css'
import { useContext, useEffect, useState } from 'react';
import { getAllBasicEmployees } from "../../Controllers/Employee/index"
import { Button, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { ParentStore } from '../../../pages/_app';
import { Download } from '@mui/icons-material';

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
    return ['SA','STL','RB','PA'].includes( ParentState?.auth?.role)
  }

  return (
    <div className='container' >
      <h1>Production report</h1>
      <p className='mt_1 grey' >View the list of employees and their details</p>
      <div className={styles.em_search_filter_main}>
        <div className={styles.ar_search_filter} >
          <input placeholder='Search' type="text" onChange={searchEmployeeFunction} />
        </div>
      </div>

      <table className={styles.lvs_table} >
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

        {
          employees.map((emp) => {
            return <tr>
              <td>
                <ProfileImage id={emp._id} size={45} />
                <div>
                  {emp.firstName} {emp.lastName}
                </div>
              </td>
              <td>{emp.designation}</td>
              <td>{emp.department}</td>
              <td className={styles.view_button} >
                {emp.online && <span style={{ background: 'green' }} className={styles.approved} >Online</span>}
                {!emp.online && <span style={{ background: '#800000ac' }} className={styles.approved} >Offline</span>}
              </td>
              <td>{emp.phone}0000000000</td>
              <td>{emp.personalEmail}</td>
              {isValidAdmin() && <>
                <td>{emp.projectsAssigned}</td>
                <td>{emp.tasksAssigned}</td>
              </>}
              {isValidAdmin() && <td><Button variant='outlined' onClick={() => handleViewClick(emp._id)}>View</Button></td>}
              {isValidAdmin() &&  <td><IconButton variant='outlined' ><Download /></IconButton></td>}
            </tr>
          })
        }
      </table>
    </div>
  );
}

export default EmpsList;
