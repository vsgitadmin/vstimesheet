import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/router';
import styles from '../../../../styles/Hr.module.css'
import ProfileImage from '../../ProfileImage/Image';
import React from 'react';

const EmployeeTable = ({employeesData}) => {

    const router = useRouter()

  return (
    <>
       <table className={styles.lvs_table} >
          <tr>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Joined On</th>
            <th>Status</th>
            <th>Online/Offline</th>
            <th>View</th>
          </tr>

          {employeesData.map((data, index) => {
            let dt = data.joining.substring(0, data.joining.indexOf('T'));
            dt = new Date(dt);
            dt = dt.toLocaleString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return (
              <tr id={index} >
                <td>
                  <ProfileImage size={45} />
                  <div>
                  {`${data.firstName} ${data.lastName}`}
                  </div>
                </td>
                <td>{data.designation}</td>
                <td>{dt}</td>
                <td className={styles.view_button} >
                    {data.active == false && data.working == false && <span style={{ background: 'green' }} className={styles.approved} >Onboarding</span> }
                    {data.onBench == true && <span style={{ background: '#fb5607' }} className={styles.approved} >On Bench</span> }
                    {data.resigned == true && <span style={{ background: '#ef233c' }} className={styles.approved} >Resigned</span> }
                </td>
                <td className={styles.view_button} >
                    {data.online && <span style={{ background: 'green' }} className={styles.approved} >Online</span>}
                    {!data.online && <span style={{ background: '#800000ac' }} className={styles.approved} >Offline</span>}
                </td>
                <td className={styles.view_button} >
                  <button onClick={() => router.push(`/admin/dashboard/employee/profile/${data._id}`)}><Visibility style={{ fontSize: "15px", fill: "white" }} />VIEW</button>
              </td>
              </tr>
            )
          })}
                
        </table>
    </>
  )
}

export default EmployeeTable