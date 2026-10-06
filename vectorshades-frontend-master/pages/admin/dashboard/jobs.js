import Link from 'next/link'
import React, { useContext, useEffect, useRef, useState } from 'react'
import JobCard from '../../../src/Components/JobCard/job_comp_card'
import JobListRow from '../../../src/Components/JobCard/job_comp_list'
import NoDataFound from '../../../src/Components/NoDataFound/NoDataFound'
import TuneIcon from '@mui/icons-material/Tune'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import PaymentsIcon from '@mui/icons-material/Payments'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import InboxIcon from '@mui/icons-material/Inbox'
import ViewListIcon from '@mui/icons-material/ViewList'
import GridViewIcon from '@mui/icons-material/GridView'
import { toast } from 'react-toastify'
import {
    filterJobsController, getAlljobsController, getMonthlyJobAnalyticsController, getTotalNumberOfJobsController
} from '../../../src/Controllers/Jobs/index'
import AllJobsFilter from '../../../src/Components/Filters/AllJobsFilter'
import { filterJobsDynamicController } from '../../../src/Controllers/Filters/index'
import Months from '../../../src/Constants/months'
import { useRouter } from 'next/router'
import { Pagination, Tooltip } from '@mui/material'
import { Download } from '@mui/icons-material'
import { ParentStore } from '../../_app'
import { createReportsController } from '../../../src/Controllers/Reports/index'
import ReportView from '../../../src/Components/General/ReportView'
import styles from '../../../styles/Job1.module.css'

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

function Job1() {
    const [rawJobData, setrawJobData] = useState([])
    const [jobs, setJobs] = useState([])
    const [JobFilter, setJobFilter] = useState('')
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
    const { ParentState } = useContext(ParentStore)
    const reportViewRef = useRef()
    const searchDebounceRef = useRef(null)
    const searchRequestIdRef = useRef(0)

    useEffect(() => {
        setTotalNumberOfJobs()
        fetchJobsFunction({ year: selectedYear })
    }, [])

    const handleMonthChange = (month) => {
        const filtered = rawJobData.filter((monthlyJobData) => monthlyJobData._id === month.index + 1)
        setselectedMonth(month.index + 1)
        setJobs(filtered)
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
        getMonthlyJobAnalyticsController({ month: query.month }).then((data) => {
            setAnalytics(data.response.job)
        })
            .catch((err) => {
                toast.error('error occured')
            })
    }

    const runSearch = async (value) => {
        const requestId = ++searchRequestIdRef.current
        if (!value.trim()) {
            // nothing to search for, restore the unfiltered view instead of hitting the API with an empty match-all query
            setJobs(rawJobData)
            return
        }
        try {
            const filtered = await filterJobsController(value)
            if (requestId !== searchRequestIdRef.current) return // a newer search has since fired, ignore this stale response
            setJobs(filtered.data.response.jobs)
        } catch (err) {
            if (requestId !== searchRequestIdRef.current) return
            toast.error('error occured while searching')
        }
    }

    const filterJobs = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        clearTimeout(searchDebounceRef.current)
        searchDebounceRef.current = setTimeout(() => runSearch(value), 300)
    }

    const clearSearch = () => {
        clearTimeout(searchDebounceRef.current)
        searchRequestIdRef.current++
        setSearchTerm('')
        setJobs(rawJobData)
    }

    const dynamicFilterJobs = async (query, page) => {
        try {
            setLoading(true)
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
        getTotalNumberOfJobsController({ month })
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
        setJobs(rawJobData)
    }

    const clearAllFilters = () => {
        setselectedMonth(0)
        setTotalNumberOfJobs()
        fetchJobsFunction({ year: selectedYear })
        setfilterToggled(false)
    }

    const createReportFunction = async (body) => {
        try {
            reportViewRef.current.openView(createReportsController, body)
        } catch (error) {
            console.log(error)
            toast.error('Report could not be created')
        }
    }

    const handleGenerateMonthlyReport = (month) => {
        createReportFunction({
            name: `job-${month.monthName}`,
            file: `job-${month.monthName}`,
            queryObject: {},
            keys: [],
            type: 'jobs',
            monthFilter: month._id
        })
    }

    const handleGenerateYearlyReport = () => {
        createReportFunction({
            name: `job-${new Date().getFullYear()}`,
            file: `job-${new Date().getFullYear()}`,
            queryObject: {},
            keys: [],
            type: 'jobs',
            yearFilter: selectedYear
        })
    }

    const jobMaped = jobs.map((obj) => viewMode === 'grid'
        ? <JobCard key={obj._id} props={obj} />
        : <JobListRow key={obj._id} props={obj} />)

    const JobMonthlyMapper = (jobs) => jobs?.map((obj) => viewMode === 'grid'
        ? <JobCard key={obj._id} props={obj} />
        : <JobListRow key={obj._id} props={obj} />)

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
                    <h1><span className={styles.titleIcon}><WorkOutlineIcon /></span>Jobs</h1>
                    <p className={styles.subtitle}>Access and manage all listed jobs here</p>
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
                            {isFilterOpen && <AllJobsFilter setIsFilterOpen={setIsFilterOpen} render={renderFilter} />}
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
                <Link href={'/admin/dashboard/jobs/add'}>
                    <button className={styles.addBtn}><AddCircleOutlineIcon />Add Job</button>
                </Link>
            </div>

            {!filterToggled && <div className={styles.monthNav}>
                <ul className={styles.monthPillList}>
                    <li
                        key="all"
                        className={`${styles.monthPill} ${selectedMonth === 0 ? styles.monthPillActive : ''}`}
                        onClick={resetMonthFilter}
                    >
                        All
                    </li>
                    {Months.map((month) => (
                        <li
                            key={month.index}
                            className={`${styles.monthPill} ${month.index === selectedMonth - 1 ? styles.monthPillActive : ''}`}
                            onClick={() => handleMonthChange(month)}
                        >
                            {month.name}
                        </li>
                    ))}
                </ul>
                {monthFilterToggled &&
                    <button className={styles.monthClearBtn} onClick={resetMonthFilter}>Clear filter</button>}
                <div className={styles.yearFinance}>
                    <h4>Yearly Financial: <span>${yearlyRevenue}</span></h4>
                    <Tooltip title="Generate Report">
                        <button onClick={handleGenerateYearlyReport} className={styles.reportBtn}><Download /></button>
                    </Tooltip>
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
                            <Tooltip title="Generate Report">
                                <button onClick={() => handleGenerateMonthlyReport(MonthlyJobData)} className={styles.reportBtn}><Download /></button>
                            </Tooltip>
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
                                        <div className={styles.statTile}>
                                            <span className={styles.statIcon}><AccessTimeFilledIcon /></span>
                                            <div className={styles.statText}>
                                                <h4>Total Hours</h4>
                                                <h2>{monthAnalytics.hours}</h2>
                                            </div>
                                        </div>
                                        <div className={styles.statTile}>
                                            <span className={styles.statIcon}><PaymentsIcon /></span>
                                            <div className={styles.statText}>
                                                <h4>Total Cost</h4>
                                                <h2>${monthAnalytics.total_cost}</h2>
                                            </div>
                                        </div>
                                        <div className={styles.statTile}>
                                            <span className={styles.statIcon}><RequestQuoteIcon /></span>
                                            <div className={styles.statText}>
                                                <h4>Total Bid</h4>
                                                <h2>${monthAnalytics.bid}</h2>
                                            </div>
                                        </div>
                                        <div className={styles.statTile}>
                                            <span className={styles.statIcon}><HourglassBottomIcon /></span>
                                            <div className={styles.statText}>
                                                <h4>Total Bid Hour</h4>
                                                <h2>{monthAnalytics.bid_hour}</h2>
                                            </div>
                                        </div>
                                        <div className={styles.statTile}>
                                            <span className={styles.statIcon}><FormatListNumberedRoundedIcon /></span>
                                            <div className={styles.statText}>
                                                <h4>Total Jobs</h4>
                                                <h2>{monthAnalytics.count}</h2>
                                            </div>
                                        </div>
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

            {/* {!filterToggled && !monthFilterToggled && noOfPages > 1 &&
                <div className={styles.paginationWrap}>
                    <Pagination count={noOfPages} onChange={onPageChange} shape="rounded" />
                </div>}

            <ReportView ref={reportViewRef} /> */}
        </section>
    )
}

export default Job1
