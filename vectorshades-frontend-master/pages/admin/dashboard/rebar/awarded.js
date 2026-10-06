import React, { useEffect, useState } from 'react'
import { getAllAwardedJobs, getTotalNumberOfJAwardedJobsController, filterAwardedJobsController, updateAwardedJobController } from "../../../../src/Controllers/Rebar/index"
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import SearchIcon from '@mui/icons-material/Search'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import InboxIcon from '@mui/icons-material/Inbox'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined'
import PaymentsIcon from '@mui/icons-material/Payments'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import Popup from 'reactjs-popup';
import moment from 'moment'
import { toast } from 'react-toastify'
import VerticalCards from '../../../../src/Components/AwardedJobs/DisplayTable/Table/VerticalCards';
import RebarAwardedDisplayTable from '../../../../src/Components/AwardedJobs/RebarDisplayTable/Table';
import { Tooltip } from '@mui/material';
import { Tune } from '@mui/icons-material';
import RebarAwardJobsFilter from '../../../../src/Components/Filters/RebarAwardJobsFiler';
import { filterAwardedJobsDynamicController } from '../../../../src/Controllers/Filters/index'
import { useRouter } from 'next/router'
import Months from '../../../../src/Constants/months'
import styles from '../../../../styles/AwardedJobs.module.css'
import { useViewMode } from '../../../../src/Hooks/useViewMode'

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

const STAT_TILES = [
  { key: 'estimatedHours', label: 'Total Estimated Hours', icon: <AccessTimeFilledIcon /> },
  { key: 'estimatedTons', label: 'Total Estimated Tons', icon: <ScaleOutlinedIcon /> },
  { key: 'cost', label: 'Total Cost', icon: <PaymentsIcon />, prefix: '$' },
  { key: 'bidPrice', label: 'Total Bid Price', icon: <RequestQuoteIcon />, prefix: '$' },
  { key: 'count', label: 'Total Jobs', icon: <FormatListNumberedRoundedIcon /> },
]

function AwardedJobs() {
  const [InitialData, setInitialData] = useState([])
  const [jobs, setJobs] = useState([]);
  const [editPopupData, seteditPopupData] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [noOfPages, setNoOfPages] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useViewMode()
  const componentView = viewMode === 'grid'
  const setComponentView = (isGrid) => setViewMode(isGrid ? 'grid' : 'list')
  const [filterToggled, setfilterToggled] = useState(false)
  const [selectedYear, setSelectedyear] = useState(new Date().getFullYear())
  const [SelectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [monthFilterToggled, setmonthFilterToggled] = useState(false)
  const [navId, setnavId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchAwardedJobs({ year: selectedYear })
  }, [])

  useEffect(() => {
    setnavId(router.query.navigationId)
  }, [router.query])

  const updateAwardedJob = () => {
    seteditPopupData(null);
    updateAwardedJobController(editPopupData).then(() => {
      getAllAwardedJobs()
        .then((response) => {
          setJobs(response.data.response.jobs)
          toast.success("Job updated successfully");
        })
        .catch((err) => toast.error("unable to process request"))
    })
  }

  const fetchAwardedJobs = (query) => {
    getTotalNumberOfJAwardedJobsController().then((count) => {
      const pageCount = count.data.response.total / 15
      setNoOfPages(Math.ceil(pageCount))
      getAllAwardedJobs(query)
        .then((response) => {
          const monthlyBuckets = response.data.response.jobs
          setInitialData(monthlyBuckets)

          const filteredJobs = monthlyBuckets.filter((data) => data._id === SelectedMonth)
          setJobs(filteredJobs.length ? filteredJobs : monthlyBuckets)
          setmonthFilterToggled(filteredJobs.length > 0)
          setLoading(false)
        })
        .catch((err) => console.log(err))
    })
  }

  const handleYearChange = (year) => {
    fetchAwardedJobs({ year: year })
    setSelectedyear(year)
  }

  const handleMonthChange = (month) => {
    const filteredJobs = InitialData.filter((data) => data._id === month + 1)
    setJobs(filteredJobs)
    setSelectedMonth(month + 1)
    setmonthFilterToggled(true)
  }

  const resetMonthFilter = () => {
    setmonthFilterToggled(false)
    setSelectedMonth(0)
    setJobs(InitialData)
  }

  const handleFilter = async (e) => {
    try {
      const filtered = await filterAwardedJobsController(e.target.value)
      setJobs(filtered.data.response.jobs)
      return filtered.data.response.jobs
    } catch (err) { throw err }
  }

  const dynamicFilterJobs = async (query, page) => {
    try {
      setLoading(true)
      const data = await filterAwardedJobsDynamicController({ ...query, page, rebar: true })
      setfilterToggled(true)
      setJobs(data.data.response.jobs)
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
    fetchAwardedJobs({ year: selectedYear })
    setfilterToggled(false)
  }

  if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><EmojiEventsIcon /></span>Rebar Awarded Jobs</h1>
          <p className={styles.subtitle}>Access and manage all listed Rebar awarded jobs here</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {!filterToggled ? <>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input type="text" placeholder='Search awarded jobs...' onChange={handleFilter} />
            </div>
            <div className={styles.filterWrap}>
              <Tooltip title="Filters">
                <button type="button" className={styles.iconBtn} onClick={() => setIsFilterOpen(!isFilterOpen)} aria-label="Open filters">
                  <Tune />
                </button>
              </Tooltip>
              {isFilterOpen && <RebarAwardJobsFilter setIsFilterOpen={setIsFilterOpen} fromJob={true} render={renderFilter} />}
            </div>
            <select value={selectedYear} onChange={(e) => handleYearChange(e.target.value)} className={styles.yearSelect}>
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
            onClick={resetMonthFilter}
            className={`${styles.monthPill} ${!monthFilterToggled ? styles.monthPillActive : ''}`}
          >
            All
          </li>
          {Months.map((month, i) => (
            <li
              key={month.index}
              onClick={() => handleMonthChange(month.index)}
              className={`${styles.monthPill} ${monthFilterToggled && month.index === SelectedMonth - 1 ? styles.monthPillActive : ''}`}
            >
              {month.name}
            </li>
          ))}
        </ul>
      </div>}

      {!filterToggled ?
        jobs.map((monthlyJob) => {
          const Analytics = monthlyJob.analytics
          const hasJobs = monthlyJob.jobs?.length > 0
          return (
            <div className={styles.monthSection} key={monthlyJob._id}>
              <div className={styles.monthSectionHeader}>
                <div className={styles.monthSectionTitle}>
                  <h2>{monthlyJob.monthName}</h2>
                  <span className={styles.countBadge}>{monthlyJob.jobs?.length || 0} job{monthlyJob.jobs?.length === 1 ? '' : 's'}</span>
                </div>
              </div>

              {hasJobs ?
                <>
                  {componentView === true ?
                    <div className={styles.cardsWrap}>
                      <div className="vertical_cards_main">
                        {monthlyJob.jobs.map((jobData) => <VerticalCards key={jobData._id} data={jobData} enableEditPopup={(data) => { seteditPopupData(data) }} />)}
                      </div>
                    </div>
                    : <div className={styles.tableWrap}>
                      <RebarAwardedDisplayTable navId={navId} data={monthlyJob.jobs} enableEditPopup={(data) => { seteditPopupData(data) }} />
                    </div>}
                </> :
                <div className={styles.emptyMonth}>
                  <InboxIcon />
                  <h4>No awarded jobs this month</h4>
                  <p>Nothing has been awarded for {monthlyJob.monthName} yet</p>
                </div>
              }

              {Analytics && Object.keys(Analytics).length > 1 &&
                <div className={styles.analyticsCard}>
                  <div className={styles.analyticsHeading}>
                    <h3>{monthlyJob.monthName} Analytics</h3>
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
                </div>}
            </div>
          )
        })
        : (
          jobs.length > 0
            ? <div className={styles.tableWrap}>
              <RebarAwardedDisplayTable navId={navId} data={jobs} enableEditPopup={(data) => { seteditPopupData(data) }} />
            </div>
            : <div className={styles.emptyMonth}><InboxIcon /><h4>No jobs found</h4><p>Try adjusting your search or filters</p></div>
        )}

      {editPopupData &&
        <Popup
          position="right center"
          contentStyle={{ width: "500px", padding: "40px", borderRadius: "10px" }}
          open
          onClose={() => seteditPopupData(null)}
        >
          <div className='award_popup'>
            <h1 className={styles.popupHeading}>Edit Awarded Job</h1>

            <div className="form-group">
              <label>Date</label>
              <br />

              <input
                required
                type="date"
                defaultValue={moment(editPopupData.date).format('YYYY-MM-DD')}
                onChange={(e) => editPopupData.date = e.target.value}
              /><br />
            </div>

            <div className="form-group">
              <label>Location</label><br />
              <input
                placeholder='Location'
                defaultValue={editPopupData.location}
                onChange={(e) => editPopupData.location = e.target.value}
              /><br />
            </div>

            <div className="form-group">
              <label>Tonnage</label><br />
              <input
                placeholder='Tonnage'
                defaultValue={editPopupData.tonnage}
                onChange={(e) => editPopupData.tonnage = e.target.value}
              /><br />
            </div>

            <div className="form-group">
              <label>Job Number</label><br />
              <input
                placeholder='Job No'
                defaultValue={editPopupData.jobNumber}
                onChange={(e) => editPopupData.jobNumber = e.target.value}
              /><br />
            </div>

            <div className="form-group">
              <label>Notes</label><br />
              <textarea
                placeholder='Notes'
                defaultValue={editPopupData.notes}
                onChange={(e) => editPopupData.notes = e.target.value}
              /><br />
            </div>

            <div style={{ display: "flex", marginTop: "15px" }}>
              <button onClick={updateAwardedJob}>Edit Award Job</button>
              <button onClick={() => seteditPopupData(null)}>Cancel</button>
            </div>
          </div>
        </Popup>
      }
    </section>
  )
}

export default AwardedJobs
