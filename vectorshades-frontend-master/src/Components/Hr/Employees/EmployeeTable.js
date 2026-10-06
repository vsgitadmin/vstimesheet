import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useRouter } from 'next/router';
import styles from '../../../../styles/EmployeesList.module.css'
import ProfileImage from '../../ProfileImage/Image';
import React from 'react';

const EmployeeTable = ({ employeesData }) => {

  const router = useRouter()

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Joined On</th>
            <th>Status</th>
            <th>Online/Offline</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {employeesData.map((data, index) => {
            let dt = data.joining.substring(0, data.joining.indexOf('T'));
            dt = new Date(dt);
            dt = dt.toLocaleString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return (
              <tr key={data._id || index}>
                <td>
                  <div className={styles.tablePerson}>
                    <ProfileImage id={data._id} size={34} />
                    {`${data.firstName} ${data.lastName}`}
                  </div>
                </td>
                <td>{data.designation}</td>
                <td>{dt}</td>
                <td>
                  {data.active === false && data.working === false && <span className={`${styles.statusPill} ${styles.statusOnboarding}`}>Onboarding</span>}
                  {data.onBench === true && <span className={`${styles.statusPill} ${styles.statusOnBench}`}>On Bench</span>}
                  {data.resigned === true && <span className={`${styles.statusPill} ${styles.statusResigned}`}>Resigned</span>}
                </td>
                <td>
                  {data.online ? <span className={`${styles.statusPill} ${styles.statusOnline}`}>Online</span>
                    : <span className={`${styles.statusPill} ${styles.statusOffline}`}>Offline</span>}
                </td>
                <td>
                  <button type="button" className={styles.viewBtn} onClick={() => router.push(`/admin/dashboard/employee/profile/${data._id}`)}>
                    <VisibilityOutlinedIcon />VIEW
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTable
