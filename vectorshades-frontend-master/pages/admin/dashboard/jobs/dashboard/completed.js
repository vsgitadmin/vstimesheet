import React, { useState, useEffect } from 'react'
import Table from '../../../../../src/Components/Jobs/Dashboard/Table'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import PaymentsIcon from '@mui/icons-material/Payments'
import InboxIcon from '@mui/icons-material/Inbox'
import { getAllDashboardJobsController, filterDashboardJobsController } from '../../../../../src/Controllers/Jobs/index'
import EditDashboardJob from '../../../../../src/Components/Popups/Jobs/Dashboard/editDashboardJob'
import { updateDashboardJobsController, getMonthlyDashboardJobAnalyticsController } from '../../../../../src/Controllers/Jobs/index'
import { toast } from 'react-toastify'
import VerticalCards from '../../../../../src/Components/Jobs/Dashboard/Table/VerticalCards'
import { Tooltip } from '@mui/material'
import { Tune } from '@mui/icons-material'
import ProjectDashboardFilter from '../../../../../src/Components/Filters/ProjectDashboardFilter'
import { filterAwardedJobsDashboardDynamicController } from '../../../../../src/Controllers/Filters/index'
import Months from '../../../../../src/Constants/months'
import { useRouter } from 'next/router'
import styles from '../../../../../styles/AwardedJobs.module.css'
import { useViewMode } from '../../../../../src/Hooks/useViewMode'

function CompletedDashboard() {
    const [InitialData, setInitialData] = useState([])
    const [dashboardJobs, setdashboardJobs] = useState([])
    const [editPopupData, seteditPopupData] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useViewMode()
    const componentView = viewMode === 'grid'
    const setComponentView = (isGrid) => setViewMode(isGrid ? 'grid' : 'list')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [monthlyFilterToggled, setmonthlyFilterToggled] = useState(false)
    const [filterToggled, setfilterToggled] = useState(false)
    const [selectedMonth, setselectedMonth] = useState(0)
    const [Analytics, setAnalytics] = useState({})
    const router = useRouter()

    useEffect(() => {
        const month = new Date().getMonth() + 1
        setselectedMonth(month)
        fetchDashboardJobs({ month })
    }, [])

    const handleMonthChange = (month) => {
        const filteredDashboardJobs = InitialData.filter((data) => data._id === month + 1)
        setdashboardJobs(filteredDashboardJobs)
        setselectedMonth(month + 1)
        setmonthlyFilterToggled(true)
    }

    const updateDashboardData = (data) => {
        updateDashboardJobsController(data)
            .then(() => {
                toast.success('Job dashboard updated')
                router.push('/admin/dashboard/jobs/dashboard')
            })
            .catch((err) => toast.error('error occured while updating'))
    }

    const fetchDashboardJobs = (query) => {
        query.completed = true
        getAllDashboardJobsController(query)
            .then((res) => { setdashboardJobs(res.response.jobs); setInitialData(res.response.jobs); setLoading(false) })
            .catch((err) => console.log(err))

        getMonthlyDashboardJobAnalyticsController({ month: query.month })
            .then((data) => {
                setAnalytics(data.response.dashboard)
            })
            .catch((err) => {
                console.log(err)
                toast.error('error occured')
            })
    }

    const filterDashboardJobs = async (e) => {
        try {
            const filtered = await filterDashboardJobsController(e.target.value)
            setdashboardJobs(filtered.data.response.jobs)
            return filtered.data.response.jobs
        } catch (err) { throw err }
    }

    const dynamicFilterJobs = async (query, page) => {
        try {
            setLoading(true)
            const data = await filterAwardedJobsDashboardDynamicController({ ...query, page })
            setdashboardJobs(data.data.response.jobs)
            setfilterToggled(true)
            setLoading(false)
        } catch (err) {
            console.log(err)
            toast.error('error occured')
        }
    }

    const renderFilter = (query) => {
        setIsFilterOpen(false)
        dynamicFilterJobs(query, 0)
    }

    const resetMonthFilter = () => {
        setdashboardJobs(InitialData)
        setmonthlyFilterToggled(false)
        setselectedMonth(-1)
    }

    const clearAllFilters = () => router.reload()

    const STAT_TILES = [
        { key: 'FABBacklog', label: 'Total Fab Backlog', icon: <PrecisionManufacturingOutlinedIcon /> },
        { key: 'OFABacklog', label: 'Total OFA Backlog', icon: <Inventory2OutlinedIcon /> },
        { key: 'backlogHours', label: 'Total Backlog Hours', icon: <HourglassBottomIcon /> },
        { key: 'bidHours', label: 'Total Bid Hours', icon: <AccessTimeFilledIcon /> },
        { key: 'po_price', label: 'Total PO Price', icon: <PaymentsIcon />, prefix: '$' },
    ]

    const JobAnalytics = ({ Analytics, monthName }) => {
        if (!Analytics || Object.keys(Analytics).length === 0) return null
        return (
            <div className={styles.analyticsCard}>
                <div className={styles.analyticsHeading}>
                    <h3>{monthName} Analytics</h3>
                </div>
                <div className={styles.analyticsGrid}>
                    {STAT_TILES.map((tile) => (
                        <div className={styles.statTile} key={tile.key}>
                            <span className={styles.statIcon}>{tile.icon}</span>
                            <div className={styles.statText}>
                                <h4>{tile.label}</h4>
                                <h2>{tile.prefix || ''}{Analytics[tile.key]}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

    return (
        <section className={styles.page}>
            <div className={styles.headerRow}>
                <div className={styles.titleBlock}>
                    <h1><span className={styles.titleIcon}><CheckCircleOutlineIcon /></span>Completed Projects</h1>
                    <p className={styles.subtitle}>View completed projects using the completed projects dashboard</p>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    {!filterToggled ? <>
                        <div className={styles.searchBox}>
                            <SearchIcon />
                            <input type="text" placeholder='Search completed dashboard...' onChange={filterDashboardJobs} />
                        </div>
                        <div className={styles.filterWrap}>
                            <Tooltip title="Filters">
                                <button type="button" className={styles.iconBtn} onClick={() => setIsFilterOpen(!isFilterOpen)} aria-label="Open filters">
                                    <Tune />
                                </button>
                            </Tooltip>
                            {isFilterOpen && <ProjectDashboardFilter render={renderFilter} setIsFilterOpen={setIsFilterOpen} />}
                        </div>
                    </> : <button className={styles.clearBtn} onClick={clearAllFilters}>Clear filters</button>}
                </div>
                <div className={styles.viewToggle}>
                    <Tooltip title="Card view">
                        <button
                            type="button"
                            className={`${styles.viewToggleBtn} ${componentView ? styles.viewToggleBtnActive : ''}`}
                            onClick={() => setComponentView(true)}
                            aria-label="Card view"
                        >
                            <CreditCardOutlinedIcon />
                        </button>
                    </Tooltip>
                    <Tooltip title="Table view">
                        <button
                            type="button"
                            className={`${styles.viewToggleBtn} ${!componentView ? styles.viewToggleBtnActive : ''}`}
                            onClick={() => setComponentView(false)}
                            aria-label="Table view"
                        >
                            <TableChartOutlinedIcon />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {!filterToggled && <div className={styles.monthNav}>
                <ul className={styles.monthPillList}>
                    <li
                        className={`${styles.monthPill} ${!monthlyFilterToggled ? styles.monthPillActive : ''}`}
                        onClick={resetMonthFilter}
                    >
                        All
                    </li>
                    {Months.map((month, i) => (
                        <li
                            key={month.index}
                            className={`${styles.monthPill} ${monthlyFilterToggled && month.index === selectedMonth - 1 ? styles.monthPillActive : ''}`}
                            onClick={() => handleMonthChange(i)}
                        >
                            {month.name}
                        </li>
                    ))}
                </ul>
            </div>}

            {dashboardJobs.length > 0 && !filterToggled ?
                dashboardJobs.map((monthlyDashboard) => {
                    const jobsInMonth = monthlyDashboard.jobs
                    const hasJobs = jobsInMonth && jobsInMonth.length > 0
                    return (
                        <div className={styles.monthSection} key={monthlyDashboard._id}>
                            <div className={styles.monthSectionHeader}>
                                <div className={styles.monthSectionTitle}>
                                    <h2>{monthlyDashboard.monthName}</h2>
                                    <span className={styles.countBadge}>{jobsInMonth?.length || 0} job{jobsInMonth?.length === 1 ? '' : 's'}</span>
                                </div>
                            </div>

                            {hasJobs ?
                                <>
                                    {componentView ?
                                        <div className={styles.cardsWrap}>
                                            <VerticalCards data={jobsInMonth} enableEditPopup={(data) => { seteditPopupData(data) }} />
                                        </div>
                                        : <div className={styles.tableWrap}>
                                            <Table completedDashboard={true} update={updateDashboardData} data={jobsInMonth} enableEditPopup={(data) => { seteditPopupData(data) }} completed={true} />
                                        </div>}
                                </> :
                                <div className={styles.emptyMonth}>
                                    <InboxIcon />
                                    <h4>No completed jobs this month</h4>
                                    <p>Nothing was completed for {monthlyDashboard.monthName}</p>
                                </div>
                            }

                            <JobAnalytics Analytics={monthlyDashboard.analytics} monthName={monthlyDashboard.monthName} />
                        </div>
                    )
                })
                : (!filterToggled &&
                    <div className={styles.emptyMonth}><InboxIcon /><h4>No completed jobs found</h4><p>Try adjusting your search or filters</p></div>
                )}

            {editPopupData && <EditDashboardJob closePopup={() => seteditPopupData(null)} submit={updateDashboardData} editPopupData={editPopupData} />}
        </section>
    )
}

export default CompletedDashboard
