import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import RebarCard from '../../../../src/Components/RebarCard/rebar_comp_card'
import RebarListRow from '../../../../src/Components/RebarCard/rebar_comp_list'
import TuneIcon from '@mui/icons-material/Tune'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined'
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import PaymentsIcon from '@mui/icons-material/Payments'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import InboxIcon from '@mui/icons-material/Inbox'
import ViewListIcon from '@mui/icons-material/ViewList'
import GridViewIcon from '@mui/icons-material/GridView'
import { toast } from 'react-toastify'
import {
    getAlljobsController,
    getTotalNumberOfJobsController,
    filterJobsController,
    getMonthlyJobAnalyticsController
} from '../../../../src/Controllers/Rebar/index'
import { filterJobsDynamicController } from '../../../../src/Controllers/Filters/index'
import Months from '../../../../src/Constants/months'
import { useRouter } from 'next/router'
import { Tooltip } from '@mui/material'
import RebarJobsFilter from '../../../../src/Components/Filters/rebarJobsFilter'
import styles from '../../../../styles/Job1.module.css'

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

const STAT_TILES = [
    { key: 'totalHours', label: 'Total Hours', icon: <AccessTimeFilledIcon /> },
    { key: 'tonsDetailed', label: 'Total Tons Detailed', icon: <ScaleOutlinedIcon /> },
    { key: 'coHours', label: 'Total CO Hours', icon: <ChangeCircleOutlinedIcon /> },
    { key: 'dimensionalHours', label: 'Dimensional Hours', icon: <AspectRatioOutlinedIcon /> },
    { key: 'amountBilled', label: 'Amount Billed', icon: <PaymentsIcon />, prefix: '$' },
    { key: 'resourceCount', label: 'Resource Count', icon: <GroupsOutlinedIcon /> },
    { key: 'billingHead', label: 'Billing / Head', icon: <PaidOutlinedIcon />, prefix: '$' },
]

function Jobs() {
    const [rawJobData, setrawJobData] = useState([])
    const [jobs, setJobs] = useState([])
    const [yearlyRevenue, setyearlyRevenue] = useState(0)
    const [Loading, setLoading] = useState(true)
    const [noOfPages, setNoOfPages] = useState(null)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedMonth, setselectedMonth] = useState(0)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [filterToggled, setfilterToggled] = useState(false)
    const [Analytics, setAnalytics] = useState({})
    const [monthFilterToggled, setmonthFilterToggled] = useState(false)
    const [viewMode, setViewMode] = useState('list')
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    useEffect(() => {
        const month = new Date().getMonth() + 1
        setselectedMonth(month)
        setTotalNumberOfJobs(month)
        fetchJobsFunction({ month, year: selectedYear })
    }, [])

    const handleMonthChange = (month) => {
        if (month.index === -1) {
            setmonthFilterToggled(false)
            setselectedMonth(0)
            setTotalNumberOfJobs()
            fetchJobsFunction({ year: selectedYear })
            return
        }

        const filtered = rawJobData.filter((monthlyJobData) => monthlyJobData._id === month.index + 1)
        setselectedMonth(month.index + 1)
        setJobs(filtered)
        setTotalNumberOfJobs(month.index + 1)
        setmonthFilterToggled(true)
    }

    const handleYearChange = async (year) => {
        fetchJobsFunction({ year: year })
        setSelectedYear(year)
    }

    const onPageChange = (event, value) => {
        fetchJobsFunction({ month: selectedMonth }, value)
    }

    const fetchJobsFunction = (query, page) => {
        getAlljobsController({ ...query, page: page })
            .then((response) => {
                setJobs(response.data[0])
                setrawJobData(response.data[0])
                setyearlyRevenue(response.data[1])
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                toast.error('error occured')
            })

        if (query?.month) {
            getMonthlyJobAnalyticsController({ month: query.month })
                .then((data) => {
                    setAnalytics(data.response.job)
                })
                .catch((err) => {
                    toast.error('error occured')
                })
        } else {
            setAnalytics({})
        }
    }

    const runSearch = async (value) => {
        if (!value.trim()) {
            setJobs(rawJobData)
            return
        }
        try {
            const filtered = await filterJobsController(value)
            setJobs(filtered.data.response.jobs)
        } catch (err) {
            toast.error('error occured while searching')
        }
    }

    const searchDebounceRef = useRef(null)
    const filterJobs = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        clearTimeout(searchDebounceRef.current)
        searchDebounceRef.current = setTimeout(() => runSearch(value), 300)
    }

    const clearSearch = () => {
        clearTimeout(searchDebounceRef.current)
        setSearchTerm('')
        setJobs(rawJobData)
    }

    const dynamicFilterJobs = async (query, page) => {
        try {
            setLoading(true)
            query.rebar = true
            const data = await filterJobsDynamicController({ ...query, page })
            setfilterToggled(true)
            setJobs(data.data.response.jobs)
            setLoading(false)
        } catch (err) {
            console.log(err)
            toast.error('error occured')
        }
    }

    const setTotalNumberOfJobs = async (month) => {
        getTotalNumberOfJobsController(month ? { month } : {})
            .then((response) => {
                const pageCount = response.data.response.total / 8
                setNoOfPages(Math.ceil(pageCount))
            })
    }

    const renderFilter = (query) => {
        setIsFilterOpen(false)
        dynamicFilterJobs(query, 0)
    }

    const resetMonthFilter = () => {
        setmonthFilterToggled(false)
        setselectedMonth(0)
        setTotalNumberOfJobs()
        fetchJobsFunction({ year: selectedYear })
    }

    const clearAllFilters = () => {
        setfilterToggled(false)
        router.reload()
    }

    const jobMaped = jobs.map((obj) => viewMode === 'grid'
        ? <RebarCard key={obj._id} props={obj} />
        : <RebarListRow key={obj._id} props={obj} />)

    const JobMonthlyMapper = (jobs) => jobs?.map((obj) => viewMode === 'grid'
        ? <RebarCard key={obj._id} props={obj} />
        : <RebarListRow key={obj._id} props={obj} />)

    if (Loading) return <div className='loader_center_parent'>
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>

    return (
        <section className={styles.page}>
            <div className={styles.headerRow}>
                <div className={styles.titleBlock}>
                    <h1><span className={styles.titleIcon}><WorkOutlineIcon /></span>Rebar Jobs</h1>
                    <p className={styles.subtitle}>Manage Rebar jobs by month and year</p>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    {!filterToggled && <>
                        <div className={styles.searchBox}>
                            <SearchIcon className={styles.searchIcon} />
                            <input
                                name='searchjobs'
                                id='searchjobs'
                                type="text"
                                placeholder='Search jobs by name, client...'
                                value={searchTerm}
                                onChange={filterJobs}
                            />
                            {searchTerm && <CloseIcon className={styles.searchClearIcon} onClick={clearSearch} />}
                        </div>
                        <div className={styles.filterWrap}>
                            <Tooltip title="Filters">
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    aria-label="Open filters"
                                >
                                    <TuneIcon />
                                </button>
                            </Tooltip>
                            {isFilterOpen && <RebarJobsFilter setIsFilterOpen={setIsFilterOpen} render={renderFilter} />}
                        </div>
                        {selectedYear && <select value={selectedYear} className={styles.yearSelect}
                            onChange={(value) => handleYearChange(value.target.value)}>
                            <option disabled>Select Year</option>
                            {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                        </select>}
                    </>}
                    {filterToggled && <button className={styles.clearBtn} onClick={clearAllFilters}>
                        Clear filters
                    </button>}
                    <div className={styles.viewToggle}>
                        <Tooltip title="List view">
                            <button
                                type="button"
                                className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                                onClick={() => setViewMode('list')}
                                aria-label="List view"
                            >
                                <ViewListIcon />
                            </button>
                        </Tooltip>
                        <Tooltip title="Grid view">
                            <button
                                type="button"
                                className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
                                onClick={() => setViewMode('grid')}
                                aria-label="Grid view"
                            >
                                <GridViewIcon />
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <button type="button" className={styles.addBtn} onClick={() => router.push('/admin/dashboard/rebar/add')}>
                    <AddCircleOutlineIcon />Add Job
                </button>
            </div>

            {!filterToggled && <div className={styles.monthNav}>
                <ul className={styles.monthPillList}>
                    <li
                        key="all"
                        className={`${styles.monthPill} ${!monthFilterToggled ? styles.monthPillActive : ''}`}
                        onClick={resetMonthFilter}
                    >
                        All
                    </li>
                    {Months.map((month) => (
                        <li
                            key={month.index}
                            className={`${styles.monthPill} ${monthFilterToggled && month.index === selectedMonth - 1 ? styles.monthPillActive : ''}`}
                            onClick={() => handleMonthChange(month)}
                        >
                            {month.name}
                        </li>
                    ))}
                </ul>
                <div className={styles.yearFinance}>
                    <h4>Yearly Financial: <span>${yearlyRevenue}</span></h4>
                </div>
            </div>}

            {!filterToggled ? jobs.map((MonthlyJobData) => {
                const monthAnalytics = MonthlyJobData.analytics
                const hasJobs = MonthlyJobData.jobs && MonthlyJobData.jobs.length > 0
                return (
                    <div className={styles.monthSection} key={MonthlyJobData._id}>
                        <div className={styles.monthSectionHeader}>
                            <div className={styles.monthSectionTitle}>
                                <h2 id={`${MonthlyJobData.monthName?.toLowerCase()}`}>{MonthlyJobData.monthName}</h2>
                                <span className={styles.countBadge}>{MonthlyJobData.jobs?.length || 0} job{MonthlyJobData.jobs?.length === 1 ? '' : 's'}</span>
                            </div>
                        </div>
                        <div className={styles.jobListMain}>
                            {hasJobs ? (
                                <div className={viewMode === 'grid' ? styles.jobGrid : styles.jobList}>
                                    {JobMonthlyMapper(MonthlyJobData.jobs)}
                                </div>
                            ) : (
                                <div className={styles.emptyMonth}>
                                    <InboxIcon />
                                    <h4>No jobs this month</h4>
                                    <p>Nothing has been added for {MonthlyJobData.monthName} yet</p>
                                </div>
                            )}
                            {monthAnalytics && Object.keys(monthAnalytics).length > 1 &&
                                <div className={styles.analyticsCard}>
                                    <div className={styles.analyticsHeading}>
                                        <h3>{MonthlyJobData.monthName} Analytics</h3>
                                    </div>
                                    <div className={styles.analyticsGrid}>
                                        {STAT_TILES.map((tile) => (
                                            <div className={styles.statTile} key={tile.key}>
                                                <span className={styles.statIcon}>{tile.icon}</span>
                                                <div className={styles.statText}>
                                                    <h4>{tile.label}</h4>
                                                    <h2>{tile.prefix || ''}{monthAnalytics[tile.key]}</h2>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>}
                        </div>
                    </div>
                )
            }) : (
                jobs.length > 0
                    ? <div className={viewMode === 'grid' ? styles.jobGrid : styles.jobList}>{jobMaped}</div>
                    : <div className={styles.emptyMonth}><InboxIcon /><h4>No jobs found</h4><p>Try adjusting your search or filters</p></div>
            )}
        </section>
    )
}

export default Jobs
