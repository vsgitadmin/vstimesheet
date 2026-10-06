import { useEffect, useState } from 'react'
import { ArrowForward, FiberManualRecord } from '@mui/icons-material'
import styles from '../../../../styles/HrDashboard.module.css'
import 'react-circular-progressbar/dist/styles.css'
import { Bar, BarChart, Cell, Pie, PieChart, Tooltip, XAxis } from 'recharts'
import { getEmployeeHRDashboardController } from '../../../Controllers/Employee/index'
import { toast } from 'react-toastify'
import Loader from '../../Loader/loader'
import ProfileImage from '../../ProfileImage/Image'
import Link from 'next/link'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined'
import AccountBox from '@mui/icons-material/AccountBox'
import Healing from '@mui/icons-material/Healing'

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

  const STAT_TILES = [
    { key: 'totalEmployees', label: 'Total Employees', icon: <GroupsOutlinedIcon /> },
    { key: 'totalTodayLeaves', label: 'Number of Leave', icon: <EventBusyOutlinedIcon /> },
    { key: 'totalNewEmployees', label: 'New Employees', icon: <PersonAddOutlinedIcon /> },
  ]

  if (Loading) return <Loader />
  else
    return (
      <>
        <div className={styles.page}>
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h1><span className={styles.titleIcon}><HomeOutlinedIcon /></span>Dashboard</h1>
              <p className={styles.subtitle}>An overview of your organization's workforce and activity</p>
            </div>
          </div>

          <div className={styles.statRow}>
            {STAT_TILES.map((tile) => (
              <div className={styles.statCard} key={tile.key}>
                <span className={styles.statIconTile}>{tile.icon}</span>
                <div>
                  <h3>{tile.label}</h3>
                  <h2>{DashboardData[tile.key]}</h2>
                </div>
              </div>
            ))}
            <div className={styles.statCard}>
              <span className={styles.statIconTile}><SentimentSatisfiedAltOutlinedIcon /></span>
              <div>
                <h3>Happiness Rate</h3>
                <h2>80%</h2>
              </div>
            </div>
          </div>

          <div className={styles.midRow}>
            <div className={styles.card}>
              <div className={styles.cardTitle}><h3>Working Format</h3></div>
              <div className={styles.pieWrap}>
                <PieChart width={220} height={220} >
                  <Pie data={pieChartData} cx={110} cy={110} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <text x={110} y={104} textAnchor="middle" fontSize={13} fill="#999">Total</text>
                  <text x={110} y={126} textAnchor="middle" fontSize={18} fontWeight="700" >{DashboardData.totalEmployees}</text>
                </PieChart>
              </div>
              <div className={styles.legend}>
                <div><FiberManualRecord style={{ fill: "#0088FE" }} />Emp Working</div>
                <div><FiberManualRecord style={{ fill: "#00C49F" }} />Emp On Leave</div>
                <div><FiberManualRecord style={{ fill: "#FFBB28" }} />Emp Not Logged</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><h3>Employee Status</h3></div>
              <div className={styles.statusTableWrap}>
                <table className={styles.statusTable}>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Job Title</th>
                      <th>Team Lead</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DashboardData.latestFewEmployees?.map((item) => {
                      return (
                        <tr key={item._id}>
                          <td>
                            <div className={styles.statusPerson}>
                              <ProfileImage size={30} id={item._id} />
                              <span>{item.firstName}</span>
                            </div>
                          </td>
                          <td>{item.designation}</td>
                          <td>{item.department}</td>
                          <td>
                            <span className={`${styles.pill} ${item.working ? styles.pillGood : styles.pillMuted}`}>{item.working ? 'Working' : 'Not working'}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className={styles.cardFootnote}>Showing latest employees</div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><h3>Requests</h3></div>
              <div className={styles.requestList}>
                <div className={styles.requestRow}>
                  <span className={styles.requestIcon}><AccountBox /></span>
                  <h4>Profile Update</h4>
                  <h4>{DashboardData.activationRequest}</h4>
                </div>
                <div className={styles.requestRow}>
                  <span className={styles.requestIcon}><Healing /></span>
                  <h4>Sick Leaves</h4>
                  <h4>{DashboardData.leaveRequest}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.card}>
              <div className={styles.cardTitle}><h3>Department Analytics</h3></div>
              <div className={styles.chartScroll}>
                <BarChart
                  width={480}
                  height={280}
                  data={data}
                >
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="uv" fill="#8884d8" />
                </BarChart>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <h3>Recruitment Progress</h3>
                <Link className={styles.cardLink} href={"/admin/dashboard/hr/employees"}>View all <ArrowForward /></Link>
              </div>
              {DashboardData.recruitement.length > 0 ? (
                <div className={styles.chartScroll}>
                  <table className={styles.recruitTable}>
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Designation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DashboardData.recruitement.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div className={styles.recruitPerson}>
                              <ProfileImage size={30} id={item?._id} />
                              <span>{`${item.firstName} ${item.lastName}`}</span>
                            </div>
                          </td>
                          <td>{item.designation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState} >
                  <img src="https://i.ibb.co/Z848pmN/png-transparent-onboarding-computer-icons-human-resource-management-others-miscellaneous-service-log.png" alt="" />
                  <h3>No Onboarding</h3>
                  <p>No onboarding process right now</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
}

export default Dashboard
