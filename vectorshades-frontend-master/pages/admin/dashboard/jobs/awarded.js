import Link from 'next/link'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { getAllAwardedJobs, getTotalNumberOfJAwardedJobsController, filterAwardedJobsController } from "../../../../src/Controllers/Jobs/index"
import Table from "../../../../src/Components/AwardedJobs/DisplayTable/Table/index"
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from 'reactjs-popup';
import moment from 'moment'
import { updateAwardedJobController } from "../../../../src/Controllers/Jobs/index"
import { toast } from 'react-toastify'
import Paging from '../../../../src/Components/Pagination/Index';
import VerticalCards from '../../../../src/Components/AwardedJobs/DisplayTable/Table/VerticalCards';
import NoDataFound from '../../../../src/Components/NoDataFound/NoDataFound';
import { Pagination, Tooltip } from '@mui/material';
import { Download, Tune } from '@mui/icons-material';
import AwardJobsFilter from '../../../../src/Components/Filters/AwardJobsFilter';
import { filterAwardedJobsDynamicController } from '../../../../src/Controllers/Filters/index'
import { useRouter } from 'next/router'
import Months from '../../../../src/Constants/months'
import { ParentStore } from '../../../_app';
import { createReportsController } from '../../../../src/Controllers/Reports';
import ReportView from '../../../../src/Components/General/ReportView';

function AwardedJobs() {
  const [InitialData, setInitialData] = useState([])
  const [jobs, setJobs] = useState([]);
  const [editPopupData, seteditPopupData] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [noOfPages, setNoOfPages] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [componentView, setComponentView] = useState(false)
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


  const noStyle = {
    height: '76%',
    display: 'flex',
    alignItems: 'center'
  }

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

  else

    return (
      <section className='jobs' >
        <div className="head">
          <h1>Awarded Jobs</h1>
        </div>
        <p className='mt_1 grey' >Access and manage all listed awarded jobs here</p>
        <div className='crud'>
          <div style={{ display: "flex", alignItems: "center" }} >
            {!filterToggled ? <>
              <input type="text" placeholder='search awarded jobs' onChange={handleFilter} />
              <div style={{ backgroundColor: '#E64848', padding: '5px', borderRadius: '5px', width: "3rem", display: "flex", justifyContent: "center", alignItems: "center" }}><Tune onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ fill: 'white' }} /></div>
            </> : <div className='clear_filter' >
              <button onClick={() => {
                fetchAwardedJobs({ year: selectedYear })
                setfilterToggled(false)
              }}>Clear filters</button>
              <span></span>
            </div>}
            {!filterToggled && <select value={selectedYear} onChange={(e) => handleYearChange(e.target.value)} className='year_select_dropdown' style={{ marginLeft: "20px" }}  >
              <option disabled >Select Year</option>
              <option value={2019}>2019</option>
              <option value={2020}>2020</option>
              <option value={2021}>2021</option>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>}

          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <CreditCardOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setComponentView(true)} />
            <TableChartOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setComponentView(false)} />
          </div>
        </div>
        <div className='flt_main' >
          {isFilterOpen && <AwardJobsFilter setIsFilterOpen={setIsFilterOpen} fromJob={true} render={renderFilter} />}
        </div>

        {!filterToggled && <div className='job_months' >
          <div className='job_months_main' >
            <ul>
              {Months.map((month, i) => {
                return <li onClick={() => handleMonthChange(i)} className={` ${month.index === SelectedMonth - 1 && `job_active_month`}`}>{month.name}</li>
              })}
              {monthFilterToggled && <button className='month_flt_clear' onClick={resetMonthFilter}>Clear filters</button>}
            </ul>
            <div className='year_finance' >
              {!filterToggled && <h4>Yearly Financial: $ {totalCost}</h4>}
              {!filterToggled && <Tooltip title="Generate Report" >
                <button onClick={handleGenerateYearlyReport} className='generate_report' ><Download /></button>
              </Tooltip>
              }
            </div>
          </div>
        </div>}


        {!filterToggled ?
          jobs.map((monthlyJob) => {
            const Analytics = monthlyJob.analytics
            if (!filterToggled)
              return (
                <>
                  <div className='job_months' >
                    <div className='job_months_title' >
                      <h1>{monthlyJob.monthName}</h1>
                      <Tooltip title="Generate Report" >
                        <button onClick={() => handleGenerateMonthlyReport(monthlyJob)} className='generate_report' ><Download /></button>
                      </Tooltip>
                    </div>
                  </div>
                  {monthlyJob.jobs?.length > 0 ?
                    <>
                      {componentView === true ?
                        <>
                          <div className="vertical_cards_main">
                            {
                              monthlyJob.jobs.map((jobData) => <VerticalCards data={jobData} enableEditPopup={(data) => { seteditPopupData(data) }} />)
                            }
                          </div>
                        </>
                        : <Table hideEdit={ParentState?.auth?.role == 'SA' ? false : false} navId={navId} data={monthlyJob.jobs} enableEditPopup={(data) => { seteditPopupData(data) }} />}
                    </> :
                    <div style={noStyle}><NoDataFound /></div>
                  }
                  {Analytics && Object.keys(Analytics).length > 1 && !filterToggled && <div className='job_month_analytics' >
                    <div className='job_analytics_title' >
                      <h2>{monthlyJob.monthName}</h2>
                      <h3>Analytics</h3>
                    </div>
                    <div className='job_analytics_title' >
                      <h3>Total Hours</h3>
                      <h2>{Analytics.hours}</h2>
                    </div>
                    <div className='job_analytics_title' >
                      <h3>Total Cost</h3>
                      <h2>${Analytics.total_cost}</h2>
                    </div>
                    <div className='job_analytics_title' >
                      <h3>Total Bid</h3>
                      <h2>${Analytics.bid}</h2>
                    </div>
                    <div className='job_analytics_title' >
                      <h3>Total Bid Hour</h3>
                      <h2>{Analytics.bid_hour}</h2>
                    </div>
                    <div className='job_analytics_title' >
                      <h3>Total Jobs</h3>
                      <h2>{Analytics.count}</h2>
                    </div>
                  </div>}
                </>
              )
          }) : <Table hideEdit={ParentState?.auth?.role == 'SA' ? false : false} navId={navId} data={jobs} enableEditPopup={(data) => { seteditPopupData(data) }} />}

        {editPopupData &&
          <Popup
            position="right center"
            contentStyle={{ width: "500px", padding: "40px", borderRadius: "10px" }}
            open
            onClose={() => seteditPopupData(null)}
          >
            <div className='award_popup'>
              <h1>Edit Awarded Job</h1>

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

