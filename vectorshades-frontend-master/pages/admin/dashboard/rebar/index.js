import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import RebarCard from '../../../../src/Components/RebarCard/rebar_comp_card'
import TuneIcon from '@mui/icons-material/Tune';
import { toast } from 'react-toastify'
import {
    getAlljobsController,
    getTotalNumberOfJobsController,
    filterJobsController,
    getMonthlyJobAnalyticsController
} from '../../../../src/Controllers/Rebar/index'
import AllJobsFilter from '../../../../src/Components/Filters/AllJobsFilter';
import { filterJobsDynamicController } from '../../../../src/Controllers/Filters/index'
import Months from '../../../../src/Constants/months'
import { useRouter } from 'next/router'
import AllJobsRebarTable from '../../../../src/Components/AwardedJobs/AllJobs';
import RebarJobsFilter from '../../../../src/Components/Filters/rebarJobsFilter';

function Jobs() {
    const [rawJobData, setrawJobData] = useState([])
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
    const [monthFilterToggled, setmonthFilterToggled] = useState(false)
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
                setJobs(response.data[0]);
                setrawJobData(response.data[0])
                setyearlyRevenue(response.data[1])
                setLoading(false);
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


    const filterJobs = async (e) => {
        try {
            const filtered = await filterJobsController(e.target.value)
            setJobs(filtered.data.response.jobs)
            return filtered.data.response.jobs
        } catch (err) {
            throw err
        }
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

    const noStyle = {
        height: '76%', display: 'flex', alignItems: 'center'
    }

    const resetMonthFilter = () => {
        setmonthFilterToggled(false)
        setselectedMonth(0)
        setTotalNumberOfJobs()
        fetchJobsFunction({ year: selectedYear })
    }

    const jobMaped = jobs.map((obj) => <RebarCard key={obj._id} props={obj} />)

    const JobMonthlyMapper = (jobs) => jobs.map((obj) => <RebarCard key={obj._id} props={obj} />)

    if (Loading) return <div className='loader_center_parent'>
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>

    else

        return (<section className='jobs'>
            <div className="head">
                <h1>Rebar Jobs</h1>
            </div>
            <p className='mt_1'>Manage Rebar jobs by month and year.</p>
            <div className='crud'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!filterToggled && <>
                        <input name='searchjobs' id='searchjobs' type="text" placeholder='search jobs'
                            onChange={filterJobs} />
                        <button
                            type="button"
                            className="jobs_filter_btn"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            aria-label="Open filters"
                            title="Filters"
                        >
                            <TuneIcon style={{ fill: 'white' }} />
                        </button>
                    </>}
                    <div className='clear_filter'>
                        {filterToggled && <button className="clear_filter_btn" onClick={() => {
                            setfilterToggled(false)
                            // fetchJobsFunction({ month: selectedMonth, year: selectedYear })
                            router.reload()
                        }}>Clear
                            filters</button>}

                        {!filterToggled && selectedYear &&
                            <select value={selectedYear} className='year_select_dropdown'
                                onChange={(value) => handleYearChange(value.target.value)}>
                                <option disabled>Select Year</option>
                                <option value={2019}>2019</option>
                                <option value={2020}>2020</option>
                                <option value={2021}>2021</option>
                                <option value={2022}>2022</option>
                                <option value={2023}>2023</option>
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                            </select>}
                            <button type="button" className="jobs_add_btn" onClick={() => router.push('/admin/dashboard/rebar/add')}>
                        ADD JOB
                    </button>
                    </div>
                </div>
            </div>
            <div className='flt_main'>
                {isFilterOpen && <RebarJobsFilter setIsFilterOpen={setIsFilterOpen} render={renderFilter} />}
            </div>
            {!filterToggled && <div className='job_months'>
                <div className='job_months_main'>
                    <ul>
                        {Months.map((month, i) => {
                            return <li className={` ${month.index === selectedMonth - 1 && `job_active_month`}`}
                                onClick={() => handleMonthChange(month)}>{month.name}</li>
                        })}
                        {monthFilterToggled &&
                            <button className='month_flt_clear' onClick={resetMonthFilter}>Clear filters</button>}
                    </ul>
                    <div>
                        <h4>Yearly Financial: ${yearlyRevenue}</h4>
                    </div>
                </div>
                {/* <h1 key={selectedMonth}>{Months[selectedMonth - 1].name}</h1> */}
            </div>}

            {!filterToggled ? jobs.map((MonthlyJobData) => {
                const Analytics = MonthlyJobData.analytics
                return (<div className='job_months'>
                    <h1 id={`${MonthlyJobData.monthName?.toLowerCase()}`}
                        key={selectedMonth}>{MonthlyJobData.monthName}</h1>
                    <div className='job_list_main'>
                        <div className="list">
                            {/* {JobMonthlyMapper(MonthlyJobData.jobs)} */}
                            <AllJobsRebarTable data={MonthlyJobData.jobs}/>
                        </div>
                        {Analytics && Object.keys(Analytics).length > 1 && !filterToggled &&
                            <div className='job_month_analytics'>
                                <div className='job_analytics_title'>
                                    <h2>{MonthlyJobData.monthName}</h2>
                                    <h3>Analytics</h3>
                                </div>
                                <div className='job_analytics_title'>
                                    <h3>Total Hours</h3>
                                    <h2>{Analytics.totalHours}</h2>
                                </div>
                                <div className='job_analytics_title'>
                                    <h3>Total Tons Detailed</h3>
                                    <h2>{Analytics.tonsDetailed}</h2>
                                </div>
                                <div className='job_analytics_title'>
                                    <h3>Total CO hours</h3>
                                    <h2>{Analytics.coHours}</h2>
                                </div>
                                <div className='job_analytics_title'>
                                    <h3>Dimensional Hours</h3>
                                    <h2>{Analytics.dimensionalHours}</h2>
                                </div>
                                <div className='job_analytics_title'>
                                    <h3>Amount Billed</h3>
                                    <h2>${Analytics.amountBilled}</h2>
                                </div>
                                <div className='job_analytics_title'>
                                    <h3>Resource Count</h3>
                                    <h2>{Analytics.resourceCount}</h2>
                                </div>
                                <div className='job_analytics_title'>
                                    <h3>Billing / Head</h3>
                                    <h2>{Analytics.billingHead}</h2>
                                </div>
                            </div>}
                    </div>
                </div>

                )
            }) : <div className='list'>{jobMaped}</div>}

        </section>)
}

export default Jobs