import React, { useState, useEffect } from 'react'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import SearchIcon from '@mui/icons-material/Search'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import InboxIcon from '@mui/icons-material/Inbox'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import { getAllDashboardJobsController, filterDashboardJobsController } from '../../../../src/Controllers/Rebar/index'
import EditDashboardJob from '../../../../src/Components/Popups/Jobs/Dashboard/editDashboardJob'
import { updateDashboardJobsController } from "../../../../src/Controllers/Rebar/index"
import { toast } from 'react-toastify'
import VerticalCards from '../../../../src/Components/Jobs/Dashboard/Table/VerticalCards'
import { Tooltip } from '@mui/material'
import { Tune } from '@mui/icons-material'
import RebarProjectDashboardFilter from '../../../../src/Components/Filters/RebarProjectDashboardFilter'
import { filterAwardedJobsDashboardDynamicController } from '../../../../src/Controllers/Filters/index'
import Months from '../../../../src/Constants/months'
import { useRouter } from 'next/router'
import RebarDashboardTable from '../../../../src/Components/Jobs/Dashboard/RebarTable'
import styles from '../../../../styles/AwardedJobs.module.css'
import { useViewMode } from '../../../../src/Hooks/useViewMode'

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

const STAT_TILES = [
    { key: 'totalJobs', label: 'Total Jobs', icon: <FormatListNumberedRoundedIcon /> },
    { key: 'totalTons', label: 'Total Tons', icon: <ScaleOutlinedIcon /> },
    { key: 'tonsDetailed', label: 'Tons Detailed', icon: <Inventory2OutlinedIcon /> },
    { key: 'billPending', label: 'Bill Pending', icon: <HourglassBottomIcon />, prefix: '$' },
    { key: 'billBacklog', label: 'Bill Backlog', icon: <RequestQuoteIcon />, prefix: '$' },
]

function Dashboard() {
    const [InitialData, setInitialData] = useState([])
    const [dashboardJobs, setdashboardJobs] = useState([])
    const [editPopupData, seteditPopupData] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useViewMode()
    const componentView = viewMode === 'grid'
    const setComponentView = (isGrid) => setViewMode(isGrid ? 'grid' : 'list')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterToggled, setfilterToggled] = useState(false)
    const [holdSelected, setholdSelected] = useState(false)
    const [selectedMonth, setselectedMonth] = useState(0)
    const [selectedYear, setSelectedyear] = useState(new Date().getFullYear())
    const [monthlyFilterToggled, setmonthlyFilterToggled] = useState(false)
    const [LinkOnly, setLinkOnly] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const month = new Date().getMonth() + 1
        setselectedMonth(month)
        fetchDashboardJobs({ month, year: selectedYear })
    }, [])

    useEffect(() => {
        const month = new Date().getMonth() + 1
        if (holdSelected === true) fetchDashboardJobs({ hold: true })
        else fetchDashboardJobs({ month, year: selectedYear })
    }, [holdSelected])

    const handleMonthChange = (month) => {
        const filteredDashboardJobs = InitialData.filter((data) => data._id === month + 1)
        setdashboardJobs(filteredDashboardJobs)
        setselectedMonth(month + 1)
        setmonthlyFilterToggled(true)
    }

    const resetMonthFilter = () => {
        fetchDashboardJobs({ year: selectedYear })
        setmonthlyFilterToggled(false)
        setselectedMonth(0)
    }

    const handleYearChange = (year) => {
        fetchDashboardJobs({ year: year })
        setSelectedyear(year)
    }

    const fetchDashboardJobs = (query) => {
        setLoading(true)
        getAllDashboardJobsController(query)
            .then((res) => {
                setdashboardJobs(res.response.jobs)
                setInitialData(res.response.jobs)
                setLoading(false)
            })
            .catch((err) => console.log(err))
    }

    const updateDashboardData = (data) => {
        setLoading(true)
        updateDashboardJobsController(data)
            .then(() => {
                setLinkOnly(false)
                toast.success("Job dashboard updated")
                const month = new Date().getMonth() + 1
                setselectedMonth(month)
                fetchDashboardJobs({ month, year: selectedYear })
                seteditPopupData(null)
            }).then(() => setLoading(false))
            .catch((err) => toast.error('error occured while updating'))
    }

    const filterDashboardJobs = async (e) => {
        try {
            const filtered = await filterDashboardJobsController(e.target.value)
            setdashboardJobs(filtered.data.response.jobs)
            return filtered.data.response.jobs
        } catch (err) { throw err }
    }

    const ToggleLinkOnly = (jobId) => {
        setLinkOnly(true)
        fetchDashboardJobs({ linkId: jobId })
    }

    const disableLink = () => {
        const month = new Date().getMonth() + 1
        setselectedMonth(month)
        fetchDashboardJobs({ month, year: selectedYear })
        setLinkOnly(false)
    }

    const dynamicFilterJobs = async (query, page) => {
        try {
            setLoading(true)
            const data = await filterAwardedJobsDashboardDynamicController({ ...query, page, rebar: true })
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

    const clearAllFilters = () => {
        fetchDashboardJobs({ month: selectedMonth, year: selectedYear })
        setfilterToggled(false)
    }

    function flattenAndSortJobs(data) {
        return data
            .flatMap(entry => entry.jobs || [])
            .sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    const JobAnalytics = ({ data, monthName }) => {
        if (!data || data.length === 0) return null
        const totalJobs = data.length
        const totalTons = data.reduce((sum, item) => sum + (item.tons || 0), 0)
        const billPending = data.reduce((sum, item) => sum + (item.billingPending || 0), 0)
        const billBacklog = data.reduce((sum, item) => sum + (item.billingBacklog || 0), 0)
        const tonsDetailed = data.reduce((sum, item) => sum + (item.tonsDetailed || 0), 0)
        const computed = { totalJobs, totalTons, tonsDetailed, billPending, billBacklog }

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
                                <h2>{tile.prefix || ''}{computed[tile.key]}</h2>
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
                    <h1><span className={styles.titleIcon}><DashboardCustomizeIcon /></span>{holdSelected && 'On Hold '}Rebar Project Dashboard</h1>
                    <p className={styles.subtitle}>Rebar projects by month and year</p>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    {!filterToggled ? <>
                        <div className={styles.searchBox}>
                            <SearchIcon />
                            <input type="text" placeholder='Search dashboard jobs...' onChange={filterDashboardJobs} />
                        </div>
                        <div className={styles.filterWrap}>
                            <Tooltip title="Filters">
                                <button type="button" className={styles.iconBtn} onClick={() => setIsFilterOpen(!isFilterOpen)} aria-label="Open filters">
                                    <Tune />
                                </button>
                            </Tooltip>
                            {isFilterOpen && <RebarProjectDashboardFilter render={renderFilter} setIsFilterOpen={setIsFilterOpen} />}
                        </div>
                        <Tooltip title={holdSelected ? "Showing on-hold jobs" : "Show on-hold jobs"}>
                            <button
                                type="button"
                                className={`${styles.iconBtn} ${holdSelected ? styles.viewToggleBtnActive : ''}`}
                                onClick={() => setholdSelected((e) => !e)}
                                aria-label="Toggle on-hold jobs"
                            >
                                <PendingActionsIcon />
                            </button>
                        </Tooltip>
                        <select value={selectedYear} className={styles.yearSelect} onChange={(e) => handleYearChange(e.target.value)}>
                            <option disabled>Select Year</option>
                            {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                        </select>
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

            {!filterToggled && <JobAnalytics data={flattenAndSortJobs(dashboardJobs)} monthName={selectedYear} />}

            {dashboardJobs.length > 0 && !filterToggled ?
                dashboardJobs.map((monthlyDashboard) => {
                    const jobsInMonth = monthlyDashboard.jobs
                    const hasJobs = jobsInMonth && jobsInMonth.length > 0
                    return (
                        <div className={styles.monthSection} key={monthlyDashboard._id}>
                            <div className={styles.monthSectionHeader}>
                                <div className={styles.monthSectionTitle}>
                                    <h2>{LinkOnly && hasJobs ? 'JOB - ' + jobsInMonth[0].awardedProjectData.jobData.project : monthlyDashboard.monthName}</h2>
                                    <span className={styles.countBadge}>{jobsInMonth?.length || 0} job{jobsInMonth?.length === 1 ? '' : 's'}</span>
                                </div>
                                {LinkOnly && <button className={styles.clearBtn} onClick={disableLink}>View All</button>}
                            </div>

                            {hasJobs ?
                                <>
                                    {componentView ?
                                        <div className={styles.cardsWrap}>
                                            <VerticalCards data={jobsInMonth} enableEditPopup={(data) => { seteditPopupData(data) }} />
                                        </div>
                                        : <div className={styles.tableWrap}>
                                            <RebarDashboardTable update={updateDashboardData} linkOnly={LinkOnly} ToggleLinkOnly={ToggleLinkOnly} data={jobsInMonth} enableEditPopup={(data) => { seteditPopupData(data) }} completed={false} />
                                        </div>}
                                </> :
                                <div className={styles.emptyMonth}>
                                    <InboxIcon />
                                    <h4>No jobs this month</h4>
                                    <p>Nothing on the dashboard for {monthlyDashboard.monthName} yet</p>
                                </div>
                            }

                            <JobAnalytics data={jobsInMonth} monthName={monthlyDashboard.monthName} />
                        </div>
                    )
                })
                : (
                    filterToggled && dashboardJobs.length > 0
                        ? <div className={styles.tableWrap}>
                            <RebarDashboardTable update={updateDashboardData} linkOnly={LinkOnly} ToggleLinkOnly={ToggleLinkOnly} data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} completed={false} />
                        </div>
                        : <div className={styles.emptyMonth}><InboxIcon /><h4>No jobs found</h4><p>Try adjusting your search or filters</p></div>
                )}

            {editPopupData && <EditDashboardJob closePopup={() => seteditPopupData(null)} submit={updateDashboardData} editPopupData={editPopupData} />}
        </section>
    )
}

export default Dashboard
