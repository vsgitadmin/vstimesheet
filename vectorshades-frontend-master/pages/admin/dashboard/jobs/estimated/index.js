import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import JobCard from '../../../../../src/Components/JobCard/job_comp_card'
import TuneIcon from '@mui/icons-material/Tune';
import { toast } from 'react-toastify'
import { getAllPendingjobsController, getTotalNumberOfJobsController, filterJobsController, getMonthlyJobAnalyticsController } from '../../../../../src/Controllers/Jobs/index'
import { general } from '../../../../../src/Helpers/Extractor/Extractor';
import Paging from '../../../../../src/Components/Pagination/Index';
import NoDataFound from "../../../../../src/Components/NoDataFound/NoDataFound"
import AllJobsFilter from '../../../../../src/Components/Filters/AllJobsFilter';
import { filterJobsDynamicController } from '../../../../../src/Controllers/Filters/index'
import { animateScroll } from 'react-scroll'
import Months from '../../../../../src/Constants/months'
import { useRouter } from 'next/router'
import { Tooltip } from '@mui/material';
import { Download } from '@mui/icons-material';

function EstimatedJobs() {
  const [InitialData, setInitialData] = useState([])
  const [jobs, setJobs] = useState([])
  const [JobFilter, setJobFilter] = useState('')
  const [yearlyRevenue, setyearlyRevenue] = useState(0)
  const [Loading, setLoading] = useState(true);
  const [noOfPages, setNoOfPages] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedMonth, setselectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filterToggled, setfilterToggled] = useState(false)
  const [Analytics, setAnalytics] = useState({})
  const [monthlyFilterToggled, setmonthlyFilterToggled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const month = new Date().getMonth() + 1
    setselectedMonth(month)
    setTotalNumberOfJobs(month)
    fetchJobsFunction({ month, year: selectedYear })
  }, [])

  const handleMonthChange = (month) => {
    const filtered = InitialData.filter((monthlyJobData) => monthlyJobData._id === month+1)
    if (filtered.length === 0) {
      toast.warning('no jobs found')
      return;
    }
    setJobs(filtered)
    setselectedMonth(month + 1)
    setTotalNumberOfJobs(month + 1)
    setmonthlyFilterToggled(true)
  }

  const ResetMonthlyFilter = () => {
    setmonthlyFilterToggled(false)
    setselectedMonth(100)
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
        setJobs(response.data[0]);
        setLoading(false);
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

  const noStyle = {
    height: '76%',
    display: 'flex',
    alignItems: 'center'
  }

  const jobMaped = jobs.map((obj) => <JobCard key={obj._id} props={obj} />)

  const JobMonthlyMapper = (jobs) => jobs.map((obj) => <JobCard key={obj._id} props={obj} />)

  if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

  else

    return (
      <section className='jobs'>
        <div className="head">
          <h1>Estimated Jobs</h1>
        </div>
        <p className='mt_1 grey' >Access and manage jobs using project dashboard</p>
        <div className='crud'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!filterToggled && 
            <>
              <input name='searchjobs' id='searchjobs' type="text" placeholder='search jobs' onChange={filterJobs} />
            </>
            }
            <div className='clear_filter' >
              {filterToggled && <button className="clear_filter_btn" onClick={() => router.reload()}>Clear filters</button>}

              {!filterToggled && selectedYear &&
                <select value={selectedYear} className='year_select_dropdown' onChange={(value) => handleYearChange(value.target.value)} >
                  <option disabled >Select Year</option>
                  <option value={2019}>2019</option>
                  <option value={2020}>2020</option>
                  <option value={2021}>2021</option>
                  <option value={2022}>2022</option>
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
              }
            </div>
          </div>
        </div>
        <div className='flt_main' >
          {isFilterOpen && <AllJobsFilter setIsFilterOpen={setIsFilterOpen} render={renderFilter} />}
        </div>
        {!filterToggled && <div className='job_months' >
          <div className='job_months_main' >
            <ul>
              {Months.map((month, i) => {
                return <li className={` ${month.index === selectedMonth - 1 && `job_active_month`}`} onClick={() => handleMonthChange(i)}>{month.name}</li>
              })}
              {monthlyFilterToggled && <button className='month_flt_clear' onClick={ResetMonthlyFilter} >Clear filters</button>} 
            </ul>
            {/* <div className='year_finance' >
              <Tooltip title="Generate Report" >
               <button className='generate_report' ><Download/></button>
             </Tooltip>
            </div> */}
          </div>
        </div>}

        {jobs.map((MonthlyJobData) => {
          return (
            <div className='job_months'>
              <div className='job_months_title' >
              <h1 id={`${MonthlyJobData.monthName?.toLowerCase()}`} key={selectedMonth}>{MonthlyJobData.monthName}</h1>
              {/* <Tooltip title="Generate Report" >
               <button className='generate_report' ><Download/></button>
             </Tooltip> */}
              </div>
              <div className='job_list_main' >
                <div className="list">
                  {JobMonthlyMapper(MonthlyJobData.jobs)}
                </div>
              </div>
            </div>
          )
        })}

      </section>
    )
}

export default EstimatedJobs