import React, { useState, useEffect } from 'react'
import Table from '../../../../src/Components/Jobs/Dashboard/Table'
import Link from 'next/link'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { getAllDashboardJobsController, filterDashboardJobsController } from '../../../../src/Controllers/Rebar/index'
import EditDashboardJob from '../../../../src/Components/Popups/Jobs/Dashboard/editDashboardJob';
import { updateDashboardJobsController, getTotalNumberOfJAwardedJobsController, getMonthlyDashboardJobAnalyticsController } from "../../../../src/Controllers/Rebar/index"
import { toast } from 'react-toastify';
import VerticalCards from '../../../../src/Components/Jobs/Dashboard/Table/VerticalCards';
import { Pagination } from '@mui/material';
import { Tune } from '@mui/icons-material';
import ProjectDashboardFilter from '../../../../src/Components/Filters/ProjectDashboardFilter';
import { filterAwardedJobsDashboardDynamicController } from '../../../../src/Controllers/Filters/index'
import { animateScroll } from 'react-scroll'
import Months from '../../../../src/Constants/months'
import { useRouter } from 'next/router';
import RebarDashboardTable from '../../../../src/Components/Jobs/Dashboard/RebarTable';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import RebarProjectDashboardFilter from '../../../../src/Components/Filters/RebarProjectDashboardFilter';

function Dashboard() {
    const [InitialData, setInitialData] = useState([])
    const [dashboardJobs, setdashboardJobs] = useState([])
    const [editPopupData, seteditPopupData] = useState(null);
    const [Loading, setLoading] = useState(true);
    const [yearlyRevenue, setyearlyRevenue] = useState(0);
    const [noOfPages, setNoOfPages] = useState(null)
    const [componentView, setComponentView] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterToggled, setfilterToggled] = useState(false)
    const [holdSelected, setholdSelected] = useState(false)
    const [selectedMonth, setselectedMonth] = useState(0);
    const [selectedYear, setSelectedyear] = useState(new Date().getFullYear())
    const [monthlyFilterToggled, setmonthlyFilterToggled] = useState(false)
    const [LinkOnly, setLinkOnly] = useState(false)
    const [Analytics, setAnalytics] = useState({})
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



    const onPageChange = (event, value) => {
        getAllDashboardJobsController(value).then((response) => { setdashboardJobs(response.response.jobs); setLoading(false) }).catch((err) => console.log(err))
    }

    const handleMonthChange = (month) => {
        if (month === -1) {
            setmonthlyFilterToggled(false)
            setselectedMonth(0)
            fetchDashboardJobs({ year: selectedYear })
            return
        }

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
                setdashboardJobs(res.response.jobs);
                setInitialData(res.response.jobs);
                setyearlyRevenue(res.response.yearly)
                setLoading(false)
            })
            .catch((err) => console.log(err))

        if (query?.month) {
            getMonthlyDashboardJobAnalyticsController({ month: query.month })
                .then((data) => {
                    setAnalytics(data.response.dashboard)
                })
                .catch((err) => {
                    console.log(err)
                    toast.error('error occured')
                })
        } else {
            setAnalytics({})
        }
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

    const noStyle = {
        height: '76%',
        display: 'flex',
        alignItems: 'center'
    }

    const JobAnalytics = ({ data, monthName }) => {
        const totalJobs = data.length;
        const totalTons = data.reduce((sum, item) => sum + (item.tons || 0), 0);

        // If you need to derive other metrics from your data, you can compute them here:
        const billPending = data.reduce((sum, item) => sum + (item.billingPending || 0), 0);
        const billBacklog = data.reduce((sum, item) => sum + (item.billingBacklog || 0), 0);
        const tonsDetailed = data.reduce((sum, item) => sum + (item.tonsDetailed || 0), 0);

        return (
            <>
                <div className='job_month_analytics' >
                    <div className='job_analytics_title' >
                        <h2>{monthName}</h2>
                        <h3>Analytics</h3>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Total Jobs</h3>
                        <h2>{totalJobs}</h2>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Total Tons</h3>
                        <h2>{totalTons}</h2>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Tons Detailed</h3>
                        <h2>{tonsDetailed}</h2>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Bill Pending</h3>
                        <h2>${billPending}</h2>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Bill Backlog</h3>
                        <h2>${billBacklog}</h2>
                    </div>
                </div>

            </>
        )
    }

    function flattenAndSortJobs(data) {
        return data
            .flatMap(entry => entry.jobs || [])
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }



    if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

    else

        return (
            <section className='jobs'>
                <div className="head">
                    <h1>{holdSelected && 'On Hold '} Project Dashboard</h1>
                </div>
                <p className='mt_1' >Rebar projects by month and year.</p>
                <div className='crud'>
                    <div style={{ display: "flex", alignItems: "center" }} >
                        {!filterToggled ? <>
                            <input type="text" placeholder='search awarded jobs' onChange={filterDashboardJobs} />
                            <div style={{ backgroundColor: '#E64848', padding: '5px', borderRadius: '5px', width: "3rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Tune onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ fill: 'white' }} />
                            </div></> :
                            <div className='clear_filter' >
                                <button onClick={() => {
                                    fetchDashboardJobs({ month: selectedMonth, year: selectedYear })
                                    setfilterToggled(false)
                                }}>Clear filters</button>
                                {!filterToggled && <button onClick={() => animateScroll.scrollToBottom(0)} >View Analytics</button>}
                            </div>
                        }
                        {!filterToggled &&
                            <div style={{ marginLeft: '5px', cursor: 'pointer', backgroundColor: !holdSelected ? 'white' : '#E64848', padding: '5px', borderRadius: '5px', width: "3rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <PendingActionsIcon onClick={() => setholdSelected((e) => !e)} style={{ fill: !holdSelected ? 'black' : 'white' }} />
                            </div>
                        }

                        {!filterToggled && <select style={{ marginLeft: "1rem" }} value={selectedYear} className='year_select_dropdown' onChange={(e) => handleYearChange(e.target.value)} >
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
                    {!filterToggled &&
                        <div style={{ display: "flex", gap: "10px" }}>
                            <CreditCardOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setComponentView(true)} />
                            <TableChartOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setComponentView(false)} />
                        </div>
                    }
                </div>
                <div className='flt_main' >
                    {isFilterOpen && <RebarProjectDashboardFilter render={renderFilter} setIsFilterOpen={setIsFilterOpen} />}
                </div>

                {!filterToggled &&
                    <div className='job_months' >
                        <div className='job_months_main' >
                            <ul>
                                {Months.map((month, i) => {
                                    return <li onClick={() => handleMonthChange(month.index)} className={` ${month.index === selectedMonth - 1 && `job_active_month`}`}>{month.name}</li>
                                })}
                                {monthlyFilterToggled && <button className='month_flt_clear' onClick={resetMonthFilter}>Clear filters</button>}
                            </ul>
                        </div>
                    </div>
                }
                {!filterToggled && <JobAnalytics data={flattenAndSortJobs(dashboardJobs)} monthName={selectedYear} />}
                <br />
                <br />



                {dashboardJobs.length > 0 && !filterToggled ?
                    <>
                        {dashboardJobs.map((monthlyDashboard) => {
                            let dashboardJobs = monthlyDashboard.jobs
                            return (
                                <>
                                    <div className='job_months'>
                                        <h1 key={selectedMonth}>{LinkOnly ? 'JOB - ' + dashboardJobs[0].awardedProjectData.jobData.project : monthlyDashboard.monthName}</h1>
                                        {LinkOnly && <button className='view_all_button_dashboard' onClick={disableLink}>VIEW ALL</button>}

                                    </div>
                                    {componentView === true ?
                                        <div className='job_list_main' >
                                            <VerticalCards data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} />
                                            {/* <div className='awarded_jobs_pagination' >
                                                <Pagination count="1" onChange={onPageChange} />
                                            </div> */}
                                            <JobAnalytics Analytics={monthlyDashboard.analytics} monthName={monthlyDashboard.monthName} />
                                        </div>
                                        :
                                        <div className='job_list_main' >
                                            <RebarDashboardTable update={updateDashboardData} linkOnly={LinkOnly} ToggleLinkOnly={ToggleLinkOnly} data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} completed={false} />
                                            <JobAnalytics data={dashboardJobs} monthName={monthlyDashboard.monthName} />
                                        </div>
                                    }
                                </>
                            )
                        })}
                    </> :
                    // <div style={noStyle}><NoDataFound /></div>
                    null
                }

                {filterToggled && <div className='job_list_main' >
                    <RebarDashboardTable update={updateDashboardData} linkOnly={LinkOnly} ToggleLinkOnly={ToggleLinkOnly} data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} completed={false} />
                    {/* <JobAnalytics data={dashboardJobs} monthName={'Filter'} /> */}
                </div>}


                {editPopupData && <EditDashboardJob closePopup={() => seteditPopupData(null)} submit={updateDashboardData} editPopupData={editPopupData} />}
                {/* <Pagination count={noOfPages} className='pagination-center' onChange={onPageChange} /> */}

            </section>
        )
}

export default Dashboard
