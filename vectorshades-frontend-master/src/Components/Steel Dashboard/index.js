import { AccessTimeOutlined, AccountBalanceOutlined, ArticleOutlined, AssignmentTurnedInOutlined, BadgeOutlined, CalendarMonthOutlined, CommentOutlined, CreditCardOutlined, FeedOutlined, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight, MonetizationOnOutlined, MoreVertOutlined, NotificationsOutlined, Tune } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import styles from '../../../styles/Finance.module.css'
import { getJobDashboardController } from '../../Controllers/Jobs/index'
import { useState, useEffect, useContext } from 'react'
import Loader from '../Loader/loader'
import { toast } from 'react-toastify'
import DateToMonthYear from '../../Helpers/General/DateToMonthYear'
import Link from 'next/link'
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts'
import months from '../../Constants/months'
import { ParentStore } from '../../../pages/_app'

const SteelDashboard = () => {
    const [Loading, setLoading] = useState(true)
    const [dashboardData, setdashboardData] = useState({})
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const { ParentState } = useContext(ParentStore);

    useEffect(() => {
        getJobDashboardController().then((data) => {
            setdashboardData(data.data.response.dashboard)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            toast.error('Failed to load dashboard')
        })
    }, [])


    const COLORS = ['#0088FE', '#00C49F'];

    const data = [
        { name: 'Group A', value: 400 },
    ];

    if (Loading) return <Loader />

    else return (
        <>
            <div className={styles.finance_container} >
                <div className={styles.finance_left} >
                    <div className={styles.fin_top}>
                        {ParentState && <h2>Good morning, {ParentState.auth.firstName}  ! </h2>}
                        <div>
                        </div>
                    </div>
                    <div className={styles.fin_cards}>
                        <div className={styles.fin_card}>
                            <div className={styles.fin_card_top}>
                                <CreditCardOutlined style={{ fontSize: "27px" }} />
                                <MoreVertOutlined style={{ fontSize: "27px" }} />
                            </div>
                            <div className={styles.fin_card_mid} >
                                <h2>{dashboardData.awardedJobs}</h2>
                            </div>
                            <div className={styles.fin_card_bottom} >
                                <p>Awarded Jobs</p>
                            </div>
                        </div>
                        <div className={styles.fin_card}>
                            <div className={styles.fin_card_top}>
                                <MonetizationOnOutlined style={{ fontSize: "27px" }} />
                                <MoreVertOutlined style={{ fontSize: "27px" }} />
                            </div>
                            <div className={styles.fin_card_mid} >
                                <h2>{dashboardData.completedProjects}</h2>
                            </div>
                            <div className={styles.fin_card_bottom} >
                                <p>Completed Projects</p>
                            </div>
                        </div>
                        <div className={styles.fin_card}>
                            <div className={styles.fin_card_top}>
                                <BadgeOutlined style={{ fontSize: "27px" }} />
                                <MoreVertOutlined style={{ fontSize: "27px" }} />
                            </div>
                            <div className={styles.fin_card_mid} >
                                <h2>{dashboardData.ongoingProjects}</h2>
                            </div>
                            <div className={styles.fin_card_bottom} >
                                <p>On Going Projects</p>
                            </div>
                        </div>
                        <div className={styles.fin_card}>
                            <div className={styles.fin_card_top}>
                                <AccountBalanceOutlined style={{ fontSize: "27px" }} />
                                <MoreVertOutlined style={{ fontSize: "27px" }} />
                            </div>
                            <div className={styles.fin_card_mid} >
                                <h2>{dashboardData.totalJobs}</h2>
                            </div>
                            <div className={styles.fin_card_bottom} >
                                <p>Total Jobs</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.fin_mid} >
                        <div className={styles.fin_mid_cards} >
                            <div className={styles.fin_mid_card} >
                                <h4>Total Client</h4>
                                <div>
                                    <h2>{dashboardData.totalClient}</h2>
                                </div>
                            </div>
                            <div className={styles.fin_mid_card} >
                                <h4>Total Sales</h4>
                                <div>
                                    <h2>${dashboardData.totalSales[0].totalCost}</h2>
                                </div>
                            </div>
                        </div>
                        <div className={styles.latest_projects} >
                            <div className={styles.table_top}>
                                <h3>Latest Projects</h3>
                            </div>
                            <div className={styles.latest_projects_table_main} >
                                <table className={styles.latest_projects_table} >
                                    <tr>
                                        <th>Client</th>
                                        <th>Project Name</th>
                                        <th>Created By</th>
                                        <th>Created At</th>
                                        <th>Est. Hours</th>
                                        <th>Hours</th>
                                        <th>Status</th>
                                    </tr>
                                    {dashboardData?.latestProjects?.map((i) => {
                                        const created_at = DateToMonthYear(i.createdAt)
                                        return (
                                            <tr key={i._id} >
                                                <td>{i.client}</td>
                                                <td>{i.projectName}</td>
                                                <td>{i.createdBy}</td>
                                                <td>{created_at}</td>
                                                <td>{i.estimatedHours}</td>
                                                <td>{i.hours}</td>
                                                <td>
                                                    <div>{i.status}</div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className={styles.fin_bottom} >
                        <div className={styles.fin_sales_top}>
                            <div className={styles.fin_sales_top_left} >
                                <div>
                                    <h2>Financials</h2>
                                    <h4>Jan 1, {currentYear} - Dec 30, {currentYear}</h4>
                                </div>
                                <div>
                                    <h4>Yearly Sales</h4>
                                    <h2>${dashboardData.yearlySales}</h2>
                                    {/* <p>Increase increased 15% from last month</p> */}
                                </div>
                            </div>
                            <div className={styles.fin_sales_top_right}>
                                <div className={styles.fin_sales_top_right_title} >
                                    <h2>Profitable Projects</h2>
                                </div>
                                <div className={styles.fin_sales_top_right_pie_chart} >
                                    {dashboardData.projectProfits.map((analytics) => {
                                        const { project, profit, range, percent } = analytics;
                                        const data = [
                                            { name: "Cost", value: profit },
                                            { name: "Other", value: range - profit }, // To make the pie chart display a total of 1 million
                                        ];

                                        return (
                                            <div>
                                                <PieChart width={200} height={200} key={project} >
                                                    <Pie data={data} cx={100} cy={100} innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value" >
                                                        {data.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                                <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>{project.length > 20
                                                    ? `${project.substring(0, 20)}...`
                                                    : project}</h4>
                                            </div>

                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={styles.fin_sales_bottom} >
                            <div>
                                <h3>{months[currentMonth].name} Financials</h3>
                                <h1>${dashboardData.monthlySales}</h1>
                            </div>
                            <div>
                                <h3>Award Pending worth</h3>
                                <h1>${dashboardData.pendingAwarded}</h1>
                            </div>
                            <div>
                                <h3>Profit Generated</h3>
                                <h1>${dashboardData.profitGenerated}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.finance_right} >
                    <div className={styles.fin_right_main} >
                        <div className={styles.fin_right_title} >
                            <h2>Your Management</h2>
                        </div>
                        {dashboardData?.latestSingleProject !== null ?
                            <div className={styles.formation_status} >
                                <>
                                    <div>
                                        <h3>{dashboardData?.latestSingleProject.projectName}</h3>
                                        <h4>created by : <span>{dashboardData?.latestSingleProject.createdBy}</span></h4>
                                    </div>
                                    <div className={styles.progress_bar}>
                                        <div className={styles.progress_bar_fill} style={{ width: `${(dashboardData?.latestSingleProject.hours / dashboardData?.latestSingleProject.estimatedHours) * 100}` }} ></div>
                                    </div>
                                    <div>
                                        <h4>Project Completed Successfully</h4>
                                        <h4>{dashboardData?.latestSingleProject.hours > dashboardData?.latestSingleProject.estimatedHours ? 'Completed off time' : 'Completed On Time'}</h4>
                                    </div>
                                    <button><Link href={`/admin/dashboard/projects/${dashboardData?.latestSingleProject._id}`}>View project</Link></button>
                                </>
                            </div>
                            : <div className={styles.project_not_found} >
                                <img src="https://i.ibb.co/zXB719c/no-data-removebg-preview-1.png" alt="" />
                                <h3>No Data</h3>
                                <p>No completed projects to display</p>
                            </div>}
                        <div className={styles.to_do_list}>
                            <h3>To Do list</h3>
                            {dashboardData?.employeeTODO?.map((i) => {
                                return (
                                    <div className={styles.to_do}>
                                        <div><FeedOutlined /></div>
                                        <div>
                                            <h4>{i.title}</h4>
                                            <h5>{DateToMonthYear(i.createdAt)}</h5>
                                        </div>
                                    </div>
                                )
                            })}

                            {dashboardData?.employeeTODO.length === 0 && <div className={`${styles.project_not_found} ${styles.no_todos}`} >
                                <img src="https://cdn-icons-png.flaticon.com/512/1950/1950715.png" alt="" />
                                <div>
                                    <h3>No To Do List</h3>
                                    <p>You don't have a to-do list right now</p>
                                </div>
                            </div>}

                        </div>
                        {/* <div className={styles.board_meeting}>
                            <h4>Board meeting</h4>
                            <h5>Feb 22 at 6:00 PM</h5>
                            <p>You have been invited to attend a <br /> meeting of the Board Directors</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SteelDashboard