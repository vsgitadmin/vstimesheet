import { AccountBalanceOutlined, BadgeOutlined, CalendarMonthOutlined, ChecklistOutlined, CreditCardOutlined, FeedOutlined, FolderOffOutlined, MonetizationOnOutlined, MoreVertOutlined, PaidOutlined, PendingActionsOutlined, PeopleAltOutlined, SavingsOutlined, TrendingUpOutlined } from '@mui/icons-material'
import styles from '../../../styles/Finance.module.css'
import { getJobDashboardController } from '../../Controllers/Jobs/index'
import { useState, useEffect, useContext } from 'react'
import Loader from '../Loader/loader'
import { toast } from 'react-toastify'
import DateToMonthYear from '../../Helpers/General/DateToMonthYear'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import months from '../../Constants/months'
import { ParentStore } from '../../../pages/_app'

const STAT_CARDS = [
    { key: 'awardedJobs', label: 'Awarded Jobs', icon: CreditCardOutlined, accent: 'icon_slate' },
    { key: 'completedProjects', label: 'Completed Projects', icon: MonetizationOnOutlined, accent: 'icon_sage' },
    { key: 'ongoingProjects', label: 'On Going Projects', icon: BadgeOutlined, accent: 'icon_sand' },
    { key: 'totalJobs', label: 'Total Jobs', icon: AccountBalanceOutlined, accent: 'icon_brand' },
]

const PIE_PALETTE = [
    ['#3568d4', '#dde6f9'],
    ['#1f7a4d', '#deefe4'],
    ['#c97f1a', '#f8ecd9'],
    ['#c73e3e', '#f6dede'],
];

const getStatusClass = (status, styles) => {
    const value = (status || '').toString().toLowerCase()
    if (value.includes('complete')) return styles.status_complete
    if (value.includes('progress')) return styles.status_progress
    if (value.includes('pending')) return styles.status_pending
    if (value.includes('hold') || value.includes('cancel')) return styles.status_hold
    return styles.status_default
}

const getInitials = (name) => {
    if (!name) return '—'
    const parts = name.trim().split(/\s+/)
    return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

const formatMoney = (value) => Number(value || 0).toLocaleString('en-US')

const Finance = () => {
    const router = useRouter()
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

    if (Loading) return <Loader />

    const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    const latestProject = dashboardData?.latestSingleProject
    const progressPercent = latestProject && latestProject.estimatedHours
        ? Math.min(100, Math.round((latestProject.hours / latestProject.estimatedHours) * 100))
        : 0
    const isOffTime = latestProject && latestProject.hours > latestProject.estimatedHours

    return (
        <div className={styles.finance_container} >
            <div className={styles.finance_left} >
                <div className={styles.fin_top}>
                    <div>
                        {ParentState && <h2>Good morning, {ParentState.auth.firstName}</h2>}
                        <p className={styles.fin_top_subtitle}>{todayLabel}</p>
                    </div>
                </div>

                <div className={styles.fin_cards}>
                    {STAT_CARDS.map(({ key, label, icon: Icon, accent }) => (
                        <div className={styles.fin_card} key={key}>
                            <div className={styles.fin_card_top}>
                                <div className={`${styles.icon_badge} ${styles[accent]}`}>
                                    <Icon style={{ fontSize: "21px" }} />
                                </div>
                                <button className={styles.card_menu_btn} type="button" aria-label="More options">
                                    <MoreVertOutlined style={{ fontSize: "19px" }} />
                                </button>
                            </div>
                            <div className={styles.fin_card_mid} >
                                <h2>{dashboardData[key]}</h2>
                            </div>
                            <div className={styles.fin_card_bottom} >
                                <p>{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.fin_mid} >
                    <div className={styles.fin_mid_cards} >
                        <div className={styles.fin_mid_card} >
                            <div className={`${styles.icon_badge} ${styles.icon_slate}`}>
                                <PeopleAltOutlined style={{ fontSize: "19px" }} />
                            </div>
                            <div className={styles.fin_mid_card_text}>
                                <h4>Total Client</h4>
                                <h2>{dashboardData.totalClient}</h2>
                            </div>
                        </div>
                        <div className={styles.fin_mid_card} >
                            <div className={`${styles.icon_badge} ${styles.icon_sage}`}>
                                <PaidOutlined style={{ fontSize: "19px" }} />
                            </div>
                            <div className={styles.fin_mid_card_text}>
                                <h4>Total Sales</h4>
                                <h2>${formatMoney(dashboardData.totalSales[0].totalCost)}</h2>
                            </div>
                        </div>
                    </div>
                    <div className={styles.latest_projects} >
                        <div className={styles.table_top}>
                            <h3>Latest Projects</h3>
                        </div>
                        <div className={styles.latest_projects_table_main} >
                            <table className={styles.latest_projects_table} >
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Project Name</th>
                                        <th>Created By</th>
                                        <th>Created At</th>
                                        <th>Est. Hours</th>
                                        <th>Hours</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData?.latestProjects?.length > 0 ? dashboardData.latestProjects.map((i) => {
                                        const created_at = DateToMonthYear(i.createdAt)
                                        const goToProject = () => router.push(`/admin/dashboard/projects/${i._id}`)
                                        return (
                                            <tr
                                                key={i._id}
                                                className={styles.project_row}
                                                onClick={goToProject}
                                                role="link"
                                                tabIndex={0}
                                                onKeyDown={(e) => { if (e.key === 'Enter') goToProject() }}
                                            >
                                                <td>{i.client}</td>
                                                <td className={styles.cell_strong}>{i.projectName}</td>
                                                <td>
                                                    <div className={styles.creator_cell}>
                                                        <span className={styles.avatar_badge}>{getInitials(i.createdBy)}</span>
                                                        {i.createdBy}
                                                    </div>
                                                </td>
                                                <td>{created_at}</td>
                                                <td className={styles.cell_num}>{i.estimatedHours}</td>
                                                <td className={styles.cell_num}>{i.hours}</td>
                                                <td>
                                                    <span className={`${styles.status_pill} ${getStatusClass(i.status, styles)}`}>{i.status}</span>
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan={7} className={styles.table_empty}>No projects to display yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className={styles.fin_bottom} >
                    <div className={styles.fin_sales_top}>
                        <div className={styles.fin_sales_top_left} >
                            <div className={styles.fin_sales_top_left_header}>
                                <h2>Financials</h2>
                                <h4>Jan 1, {currentYear} – Dec 30, {currentYear}</h4>
                            </div>
                            <div className={styles.fin_sales_top_left_figure}>
                                <h4><TrendingUpOutlined style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '6px' }} />Yearly Sales</h4>
                                <h2>${formatMoney(dashboardData.yearlySales)}</h2>
                            </div>
                        </div>
                        <div className={styles.fin_sales_top_right}>
                            <div className={styles.fin_sales_top_right_title} >
                                <h2>Profitable Projects</h2>
                            </div>
                            <div className={styles.fin_sales_top_right_pie_chart} >
                                {dashboardData?.projectProfits?.length > 0 ? dashboardData.projectProfits.map((analytics, index) => {
                                    if (!analytics) return null
                                    const { project, profit, range } = analytics;
                                    const rawPercent = range > 0 ? Math.round((profit / range) * 100) : 0
                                    const percentLabel = rawPercent > 100 ? '100%+' : `${rawPercent}%`
                                    const [profitColor, remainingColor] = PIE_PALETTE[index % PIE_PALETTE.length]
                                    const data = [
                                        { name: "Profit", value: profit, color: profitColor },
                                        { name: "Remaining", value: Math.max(range - profit, 0), color: remainingColor },
                                    ];

                                    return (
                                        <div className={styles.pie_chart_item} key={project} title={project}>
                                            <div className={styles.pie_chart_wrap}>
                                                <PieChart width={140} height={140} >
                                                    <Pie data={data} cx={70} cy={70} innerRadius={46} outerRadius={62} startAngle={90} endAngle={-270} paddingAngle={2} dataKey="value" stroke="none" >
                                                        {data.map((entry, i) => (
                                                            <Cell key={`cell-${i}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => `$${formatMoney(value)}`} />
                                                </PieChart>
                                                <div className={styles.pie_chart_center} style={{ color: profitColor }}>{percentLabel}</div>
                                            </div>
                                            <h4 className={styles.pie_chart_label}>{project.length > 20
                                                ? `${project.substring(0, 20)}...`
                                                : project}</h4>
                                            <p className={styles.pie_chart_sub}>${formatMoney(profit)} profit</p>
                                        </div>
                                    );
                                }) : <p className={styles.table_empty}>No profitable projects yet</p>}
                            </div>
                        </div>
                    </div>
                    <div className={styles.fin_sales_bottom} >
                        <div>
                            <div className={`${styles.fin_sales_bottom_icon} ${styles.icon_slate}`}>
                                <CalendarMonthOutlined style={{ fontSize: '18px' }} />
                            </div>
                            <div>
                                <h3>{months[currentMonth].name} Financials</h3>
                                <h1>${formatMoney(dashboardData.monthlySales)}</h1>
                            </div>
                        </div>
                        <div>
                            <div className={`${styles.fin_sales_bottom_icon} ${styles.icon_sand}`}>
                                <PendingActionsOutlined style={{ fontSize: '18px' }} />
                            </div>
                            <div>
                                <h3>Award Pending worth</h3>
                                <h1>${formatMoney(dashboardData.pendingAwarded)}</h1>
                            </div>
                        </div>
                        <div>
                            <div className={`${styles.fin_sales_bottom_icon} ${styles.icon_sage}`}>
                                <SavingsOutlined style={{ fontSize: '18px' }} />
                            </div>
                            <div>
                                <h3>Profit Generated</h3>
                                <h1>${formatMoney(dashboardData.profitGenerated)}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.finance_right} >
                <div className={styles.fin_right_main} >
                    <div className={styles.fin_right_title} >
                        <h2>Your Management</h2>
                    </div>
                    {latestProject ?
                        <div className={styles.formation_status} >
                            <div>
                                <h3>{latestProject.projectName}</h3>
                                <h4>created by <span>{latestProject.createdBy}</span></h4>
                            </div>
                            <div className={styles.progress_bar_row}>
                                <div className={styles.progress_bar}>
                                    <div className={styles.progress_bar_fill} style={{ width: `${progressPercent}%` }} ></div>
                                </div>
                                <span className={styles.progress_bar_value}>{progressPercent}%</span>
                            </div>
                            <div className={styles.formation_status_footer}>
                                <h4>Project Completed Successfully</h4>
                                <span className={`${styles.time_pill} ${isOffTime ? styles.time_pill_off : styles.time_pill_on}`}>
                                    {isOffTime ? 'Completed off time' : 'Completed on time'}
                                </span>
                            </div>
                            <Link href={`/admin/dashboard/projects/${latestProject._id}`}>
                                <button>View project</button>
                            </Link>
                        </div>
                        : <div className={styles.project_not_found} >
                            <div className={styles.empty_icon}><FolderOffOutlined style={{ fontSize: '22px' }} /></div>
                            <h3>No Data</h3>
                            <p>No completed projects to display</p>
                        </div>}
                    <div className={styles.to_do_list}>
                        <div className={styles.to_do_list_header}>
                            <h3>To Do list</h3>
                            {dashboardData?.employeeTODO?.length > 0 && <span className={styles.to_do_count}>{dashboardData.employeeTODO.length}</span>}
                        </div>
                        {dashboardData?.employeeTODO?.map((i) => {
                            return (
                                <div className={styles.to_do} key={i._id || i.title}>
                                    <div><FeedOutlined style={{ fontSize: '17px' }} /></div>
                                    <div>
                                        <h4>{i.title}</h4>
                                        <h5>{DateToMonthYear(i.createdAt)}</h5>
                                    </div>
                                </div>
                            )
                        })}

                        {dashboardData?.employeeTODO?.length === 0 && <div className={`${styles.project_not_found} ${styles.no_todos}`} >
                            <div className={styles.empty_icon}><ChecklistOutlined style={{ fontSize: '19px' }} /></div>
                            <div>
                                <h3>No To Do List</h3>
                                <p>You don't have a to-do list right now</p>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Finance
