import styles from '../../../styles/Hr.module.css'
import ProfileImage from '../ProfileImage/Image';

const EmployeeListProjectStatus = ({projectStats}) => {


  return (
    <div className='container' >

        <div>
            <h2>Employee Project Status</h2>
            <p className='grey mt_1' >Check list of employees and their project status</p>
        </div>

        <div className={styles.ar_search_filter}>
           <input placeholder='Search' type="text" />
        </div>

       <table className={`${styles.lvs_table} mt_3`} >
          <tr>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Joined On</th>
            <th>Total Projects Worked</th>
            {/*<th>No of Project Assigned</th>*/}
            <th>No of in Progress Projects</th>
            <th>No of Completed Projects</th>
          </tr>
           {projectStats?.map((emp)=>{
               return <tr  >
                   <td>
                       <ProfileImage size={45} id={emp._id} />
                       <div>{emp.name}</div>
                   </td>
                   <td>{emp.designation}</td>
                   <td>{new Date(emp.joining).toLocaleDateString()}</td>
                   <td>{emp.projectStats?.length}</td>
                   {/*<td>{emp.projectStats?.length}</td>*/}
                   <td>{emp.projectStats?.filter((e)=>{return e.status==='In Progress'}).length}</td>
                   <td>{emp.projectStats?.filter((e)=>e.completed).length}</td>
               </tr>
           })}
        </table>
    </div>
  )
}

export default EmployeeListProjectStatus