import React, { useEffect, useState } from 'react'
import JobCard from '../../../../../src/Components/JobCard/job_comp_card'
import JobListRow from '../../../../../src/Components/JobCard/job_comp_list'
import TuneIcon from '@mui/icons-material/Tune'
import SearchIcon from '@mui/icons-material/Search'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import InboxIcon from '@mui/icons-material/Inbox'
import ViewListIcon from '@mui/icons-material/ViewList'
import GridViewIcon from '@mui/icons-material/GridView'
import { toast } from 'react-toastify'
import { getAllPendingjobsController, getTotalNumberOfJobsController, filterJobsController } from '../../../../../src/Controllers/Jobs/index'
import AllJobsFilter from '../../../../../src/Components/Filters/AllJobsFilter'
import { filterJobsDynamicController } from '../../../../../src/Controllers/Filters/index'
import Months from '../../../../../src/Constants/months'
import { useRouter } from 'next/router'
import { Pagination, Tooltip } from '@mui/material'
import styles from '../../../../../styles/Job1.module.css'

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

function EstimatedJobs() {
  const [InitialData, setInitialData] = useState([])
  const [jobs, setJobs] = useState([])
  const [Loading, setLoading] = useState(true)
  const [noOfPages, setNoOfPages] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedMonth, setselectedMonth] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filterToggled, setfilterToggled] = useState(false)
  const [monthlyFilterToggled, setmonthlyFilterToggled] = useState(false)
  const [viewMode, setViewMode] = useState('list')
  const router = useRouter()

  useEffect(() => {
    const month = new Date().getMonth() + 1
    setselectedMonth(month)
    setTotalNumberOfJobs(month)
    fetchJobsFunction({ month, year: selectedYear })
  }, [])

  const handleMonthChange = (month) => {
    const filtered = InitialData.filter((monthlyJobData) => monthlyJobData._id === month + 1)
    if (filtered.length === 0) {
      toast.warning('no jobs found')
      return
    }
    setJobs(filtered)
    setselectedMonth(month + 1)
    setTotalNumberOfJobs(month + 1)
    setmonthlyFilterToggled(true)
  }

  const ResetMonthlyFilter = () => {
    setmonthlyFilterToggled(false)
    setselectedMonth(-1)
    setJobs(InitialData)
  }

  const handleYearChange = async (year) => {
    fetchJobsFunction({ year: year })
    setSelectedYear(year)
  }

  const onPageChange = (event, value) => {
    fetchJobsFunction({ month: selectedMonth }, value)
  }

  const fetchJobsFunction = (query, page) => {
    getAllPendingjobsController({ ...query, page: page })
      .then((response) => {
        setJobs(response.data[0])
        setLoading(false)
        setInitialData(response.data[0])
      })
      .catch((err) => {
        console.log(err)
        toast.error('error occured')
      })
  }

  const filterJobs = async (e) => {
    try {
      const filtered = await filterJobsController(e.target.value)
      setJobs(filtered.data.response.jobs)
      return filtered.data.response.jobs
    } catch (err) { throw err }
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

  const clearAllFilters = () => router.reload()

  const jobMaped = jobs.map((obj) => viewMode === 'grid'
    ? <JobCard key={obj._id} props={obj} />
    : <JobListRow key={obj._id} props={obj} />)

  const JobMonthlyMapper = (jobs) => jobs.map((obj) => viewMode === 'grid'
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
          <h1><span className={styles.titleIcon}><PendingActionsIcon /></span>Estimated Jobs</h1>
          <p className={styles.subtitle}>Access and manage jobs using project dashboard</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {!filterToggled && <>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input
                name='searchjobs'
                id='searchjobs'
                type="text"
                placeholder='Search jobs by name, client...'
                onChange={filterJobs}
              />
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
      </div>

      {!filterToggled && <div className={styles.monthNav}>
        <ul className={styles.monthPillList}>
          <li
            className={`${styles.monthPill} ${!monthlyFilterToggled ? styles.monthPillActive : ''}`}
            onClick={ResetMonthlyFilter}
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

      {jobs.length > 0 ? jobs.map((MonthlyJobData) => {
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
                  <h4>No estimated jobs this month</h4>
                  <p>Nothing is pending estimate for {MonthlyJobData.monthName} yet</p>
                </div>
              )}
            </div>
          </div>
        )
      }) : (
        <div className={styles.emptyMonth}>
          <InboxIcon />
          <h4>No estimated jobs found</h4>
          <p>Try adjusting your search, filters or the selected year</p>
        </div>
      )}

      {!filterToggled && !monthlyFilterToggled && noOfPages > 1 &&
        <div className={styles.paginationWrap}>
          <Pagination count={noOfPages} onChange={onPageChange} shape="rounded" />
        </div>}
    </section>
  )
}

export default EstimatedJobs
