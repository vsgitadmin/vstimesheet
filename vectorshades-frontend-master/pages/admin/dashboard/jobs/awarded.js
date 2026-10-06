import Link from 'next/link'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { getAllAwardedJobs, getTotalNumberOfJAwardedJobsController, filterAwardedJobsController } from "../../../../src/Controllers/Jobs/index"
import Table from "../../../../src/Components/AwardedJobs/DisplayTable/Table/index"
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import SearchIcon from '@mui/icons-material/Search'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import PaymentsIcon from '@mui/icons-material/Payments'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import InboxIcon from '@mui/icons-material/Inbox'
import Popup from 'reactjs-popup';
import moment from 'moment'
import { updateAwardedJobController } from "../../../../src/Controllers/Jobs/index"
import { toast } from 'react-toastify'
import VerticalCards from '../../../../src/Components/AwardedJobs/DisplayTable/Table/VerticalCards';
import { Tooltip } from '@mui/material';
import { Download, Tune } from '@mui/icons-material';
import AwardJobsFilter from '../../../../src/Components/Filters/AwardJobsFilter';
import { filterAwardedJobsDynamicController } from '../../../../src/Controllers/Filters/index'
import { useRouter } from 'next/router'
import Months from '../../../../src/Constants/months'
import { ParentStore } from '../../../_app';
import { createReportsController } from '../../../../src/Controllers/Reports';
import ReportView from '../../../../src/Components/General/ReportView';
import styles from '../../../../styles/AwardedJobs.module.css'
import { useViewMode } from '../../../../src/Hooks/useViewMode'

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

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
  const [SelectedMonth, setSelectedMonth] = useState(100)
  const [monthFilterToggled, setmonthFilterToggled] = useState(false)
  const [navId, setnavId] = useState(null)
  const [totalCost, settotalCost] = useState(0)
  const router = useRouter()
  const { ParentState } = useContext(ParentStore)
  const reportViewRef = useRef()

  useEffect(() => {
    fetchAwardedJobs({ year: selectedYear })
  }, [])

  useEffect(() => {
    setnavId(router.query.navigationId)
  }, [router.query])

  const onPageChange = (event, value) => {
    getAllAwardedJobs(value).then((response) => { setJobs(response.data.response.jobs); setLoading(false) }).catch((err) => toast.error('error occured'))
  }

  const updateAwardedJob = () => {
    seteditPopupData(null);
    updateAwardedJobController(editPopupData).then(() => {
      getAllAwardedJobs({})
        .then((response) => {
          setJobs(response.data.response.jobs)
          toast.success("Job updated successfully");
        })
        .catch((err) => {
          console.log(err)
          toast.error("unable to process request")
        })
    })
  }

  const fetchAwardedJobs = (query) => {
    getTotalNumberOfJAwardedJobsController().then((count) => {
      const pageCount = count.data.response.total / 15
      setNoOfPages(Math.ceil(pageCount))
      getAllAwardedJobs(query)
        .then((response) => {
          setJobs(response.data.response.jobs);
          setInitialData(response.data.response.jobs);
          settotalCost(response.data.response.cost)
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
    setSelectedMonth(100)
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
      const data = await filterAwardedJobsDynamicController({ ...query, page})
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

  const createReportFunction = async (body) => {
    try {
      reportViewRef.current.openView(createReportsController, body)
    } catch (error) {
      console.log(error);
      toast.error("Report could not be created");
    }
  };

  const handleGenerateMonthlyReport = (month) => {
    createReportFunction({
      "name": "awarded-jobs-" + `${month.monthName}`,
      "file": "awarded-jobs-" + `${month.monthName}`,
      "queryObject": {},
      "keys": [],
      "type": "awardedJobs",
      monthFilter: month._id
    })
  }

  const handleGenerateYearlyReport = () => {
    createReportFunction({
      "name": "awarded-jobs-" + `${new Date().getFullYear()}`,
      "file": "awarded-jobs-" + `${new Date().getFullYear()}`,
      "queryObject": {},
      "keys": [],
      "type": "awardedJobs",
    })
  }

  if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><EmojiEventsIcon /></span>Awarded Jobs</h1>
          <p className={styles.subtitle}>Access and manage all listed awarded jobs here</p>
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
              {isFilterOpen && <AwardJobsFilter setIsFilterOpen={setIsFilterOpen} fromJob={true} render={renderFilter} />}
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
              onClick={() => handleMonthChange(i)}
              className={`${styles.monthPill} ${monthFilterToggled && month.index === SelectedMonth - 1 ? styles.monthPillActive : ''}`}
            >
              {month.name}
            </li>
          ))}
        </ul>
        <div className={styles.yearFinance}>
          <h4>Yearly Financial: <span>${totalCost}</span></h4>
          <Tooltip title="Generate Report">
            <button onClick={handleGenerateYearlyReport} className={styles.reportBtn}><Download /></button>
          </Tooltip>
        </div>
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
                <Tooltip title="Generate Report">
                  <button onClick={() => handleGenerateMonthlyReport(monthlyJob)} className={styles.reportBtn}><Download /></button>
                </Tooltip>
              </div>

              {hasJobs ?
                <>
                  {componentView === true ?
                    <div className={styles.cardsWrap}>
                      <div className="vertical_cards_main">
                        {monthlyJob.jobs.map((jobData) => <VerticalCards data={jobData} enableEditPopup={(data) => { seteditPopupData(data) }} />)}
                      </div>
                    </div>
                    : <div className={styles.tableWrap}>
                      <Table hideEdit={ParentState?.auth?.role == 'SA' ? false : false} navId={navId} data={monthlyJob.jobs} enableEditPopup={(data) => { seteditPopupData(data) }} />
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
                    <div className={styles.statTile}>
                      <span className={styles.statIcon}><AccessTimeFilledIcon /></span>
                      <div className={styles.statText}>
                        <h4>Total Hours</h4>
                        <h2>{Analytics.hours}</h2>
                      </div>
                    </div>
                    <div className={styles.statTile}>
                      <span className={styles.statIcon}><PaymentsIcon /></span>
                      <div className={styles.statText}>
                        <h4>Total Cost</h4>
                        <h2>${Analytics.total_cost}</h2>
                      </div>
                    </div>
                    <div className={styles.statTile}>
                      <span className={styles.statIcon}><RequestQuoteIcon /></span>
                      <div className={styles.statText}>
                        <h4>Total Bid</h4>
                        <h2>${Analytics.bid}</h2>
                      </div>
                    </div>
                    <div className={styles.statTile}>
                      <span className={styles.statIcon}><HourglassBottomIcon /></span>
                      <div className={styles.statText}>
                        <h4>Total Bid Hour</h4>
                        <h2>{Analytics.bid_hour}</h2>
                      </div>
                    </div>
                    <div className={styles.statTile}>
                      <span className={styles.statIcon}><FormatListNumberedRoundedIcon /></span>
                      <div className={styles.statText}>
                        <h4>Total Jobs</h4>
                        <h2>{Analytics.count}</h2>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
          )
        })
        : (
          jobs.length > 0
            ? <div className={styles.tableWrap}>
              <Table hideEdit={ParentState?.auth?.role == 'SA' ? false : false} navId={navId} data={jobs} enableEditPopup={(data) => { seteditPopupData(data) }} />
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

      <ReportView ref={reportViewRef} />
    </section>
  )
}

export default AwardedJobs
