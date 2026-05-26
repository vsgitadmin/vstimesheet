import { useEffect, useState } from 'react'
import { AccountBox, ArrowForward, FiberManualRecord, Healing, } from '@mui/icons-material'
import styles from '../../../../styles/Hr.module.css'
import 'react-circular-progressbar/dist/styles.css'
import { Bar, BarChart, Cell, Pie, PieChart, Tooltip, XAxis } from 'recharts'
import { getEmployeeHRDashboardController } from '../../../Controllers/Employee/index'
import { toast } from 'react-toastify'
import Loader from '../../Loader/loader'
import ProfileImage from '../../ProfileImage/Image'
import Link from 'next/link'

const Dashboard = () => {
  const [DashboardData, setDashboardData] = useState(null)
  const [Loading, setLoading] = useState(true)
  const [notLogged, setNotLogged] = useState(0)

  useEffect(() => {
    getEmployeeHRDashboardController()
      .then((res) => {
        setDashboardData(res.data.response.data)
        setNotLogged(
          res.data.response.data.totalEmployees -
          (res.data.response.data.employeeWorkingToday +
            res.data.response.data.totalTodayLeaves)
        )
      })
      .then(() => setLoading(false))
      .catch((err) => {
        toast.error('failed to load dashboard data')
      })
  }, [])
  //commenting for future reference
  // const data = [
  //     {
  //         name: "Page A",
  //         uv: 4000,
  //         pv: 2400,
  //         amt: 2400
  //     },
  //     {
  //         name: "Page B",
  //         uv: 3000,
  //         pv: 1398,
  //         amt: 2210
  //     },
  //     {
  //         name: "Page C",
  //         uv: 2000,
  //         pv: 9800,
  //         amt: 2290
  //     },
  //     {
  //         name: "Page D",
  //         uv: 2780,
  //         pv: 3908,
  //         amt: 2000
  //     },
  //     {
  //         name: "Page E",
  //         uv: 1890,
  //         pv: 4800,
  //         amt: 2181
  //     },
  //     {
  //         name: "Page F",
  //         uv: 2390,
  //         pv: 3800,
  //         amt: 2500
  //     },
  //     {
  //         name: "Page G",
  //         uv: 3490,
  //         pv: 4300,
  //         amt: 2100
  //     }
  // ];
  const data = DashboardData?.department?.map((item) => {
    return {
      name: item._id,
      uv: item.count,
    }
  })

  const pieChartData = [
    { name: 'Employees Working', value: DashboardData?.employeeWorkingToday },
    { name: 'Employees On Leave', value: DashboardData?.totalTodayLeaves },
    { name: 'Employees Not  Logged', value: notLogged },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (Loading) return <Loader />
  else
    return (
      <>
        <div className={styles.hrdash_container}>
          <div className={styles.hrdash_top}>
            <h2>Dashboard</h2>
          </div>
          <div className={styles.top_boxes}>
            <div className={styles.top_box}>
              <h3>Total employees</h3>
              <div>
                <h2>{DashboardData.totalEmployees}</h2>
              </div>
            </div>
            <div className={styles.top_box}>
              <h3>Number of Leave</h3>
              <div>
                <h2>{DashboardData.totalTodayLeaves}</h2>
              </div>
            </div>
            <div className={styles.top_box}>
              <h3>New employees</h3>
              <div>
                <h2>{DashboardData.totalNewEmployees}</h2>
              </div>
            </div>
            <div className={styles.top_box}>
              <h3>Happiness rate</h3>
              <div>
                <h2>80%</h2>
              </div>
            </div>
          </div>
          <div className={styles.mid_boxes}>
            <div className={`${styles.mid_box} ${styles.mid_box_1}`}>
              <h3>Working Format</h3>
              <div className={styles.working_format} >
                <PieChart width={300} height={300} >
                  <Pie data={pieChartData} cx={150} cy={150} innerRadius={80} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <text x={160} y={150} textAnchor="middle" fontSize={18} >Total</text>
                  <text x={160} y={175} textAnchor="middle" fontSize={20} style={{ fontWeight: "bolder" }} >{DashboardData.totalEmployees}</text>
                </PieChart>
              </div>
              <div className={styles.working_format_bottom}>
                <div>
                  <FiberManualRecord style={{ fill: "#0088FE" }} />
                  <h5>Emp Working</h5>
                </div>
                <div>
                  <FiberManualRecord style={{ fill: "#00C49F" }} />
                  <h5>Emp On Leave</h5>
                </div>
                <div>
                  <span style={{ background: "#" }} ></span>
                  <FiberManualRecord style={{ fill: "#FFBB28" }} />
                  <h5>Emp Not  Logged</h5>
                </div>
              </div>
            </div>
            <div className={`${styles.mid_box} ${styles.mid_box_2}`}>
              <div className={styles.emp_status}>
                <h3>Employee Status</h3>
              </div>
              <div className={styles.emp_status_table_main} >
                <table className={styles.emp_status_table}>
                  <tr>
                    <th>Employee Name</th>
                    <th>Job Title</th>
                    <th>Team Lead</th>
                    <th>Status</th>
                  </tr>
                  {DashboardData.latestFewEmployees?.map((item) => {
                    return (
                      <tr>
                        <td>
                          <div>
                            <ProfileImage size={35} id={item._id} />
                            <h4>{item.firstName}</h4>
                          </div>
                        </td>
                        <td>{item.designation}</td>
                        <td>{item.department}</td>
                        <td>
                          <div>{item.working ? 'working' : 'not working'}</div>
                        </td>
                      </tr>
                    )
                  })}
                </table>
              </div>
              <div className={styles.mid_box_table_bottom}>
                <h4>Showing latest employees</h4>
                <div>
                </div>
              </div>
            </div>
            <div className={`${styles.mid_box} ${styles.mid_box_3}`}>
              <h3>Requests</h3>
              <div className={styles.mid_box_3_list}>
                <div>
                  <AccountBox style={{ fill: 'grey' }} />
                  <h4>Profile Update</h4>
                  <h4>{DashboardData.activationRequest}</h4>
                </div>
                <div>
                  <Healing style={{ fill: 'grey' }} />
                  <h4>Sick Leaves</h4>
                  <h4>{DashboardData.leaveRequest}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottom_boxes}>
            <div className={styles.bottom_box_1}>
              <div className={styles.bottom_box_1_title} >
                <h3>Department Analytics</h3>
              </div>
              <BarChart
                width={500}
                height={300}
                data={data}
              >
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="uv" fill="#8884d8" />
              </BarChart>
            </div>
            <div className={styles.bottom_box_2}>
              <div>
                <h3>Recruitment progress</h3>
                <h3>
                  <Link href={"/admin/dashboard/hr/employees"}>View all <ArrowForward style={{ fill: 'var(--redTheme)' }} /></Link>
                </h3>
              </div>
              <table>
                <tr>
                  {DashboardData.recruitement.length > 0 && <>
                    <th>Full Name</th>
                    <th>Designation</th>
                  </>}
                </tr>
                {DashboardData.recruitement.length > 0 ? DashboardData.recruitement.map((item) => {
                  return (
                    <>
                      <tr>
                        <td>
                          <div>
                            <ProfileImage size={35} id={item?._id} />
                            <h4>{`${item.firstName} ${item.lastName}`}</h4>
                          </div>
                        </td>
                        <td>{item.designation}</td>
                      </tr></>
                  )
                }) :
                  <div className={styles.no_onboarding} >
                    <img src="https://i.ibb.co/Z848pmN/png-transparent-onboarding-computer-icons-human-resource-management-others-miscellaneous-service-log.png" alt="" />
                    <h3>No Onboarding</h3>
                    <p>No onboarding process right now</p>
                  </div>
                }

              </table>
            </div>
          </div>
        </div>
      </>
    )
}

export default Dashboard
