import React, { useState, useEffect } from 'react'
import Table from '../../../../../src/Components/Jobs/Dashboard/Table'
import Link from 'next/link'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { getAllDashboardJobsController, filterDashboardJobsController } from '../../../../../src/Controllers/Rebar/index'
import EditDashboardJob from '../../../../../src/Components/Popups/Jobs/Dashboard/editDashboardJob';
import { updateDashboardJobsController, getTotalNumberOfJAwardedJobsController, getMonthlyDashboardJobAnalyticsController } from "../../../../../src/Controllers/Rebar/index"
import { toast } from 'react-toastify';
import Paging from '../../../../../src/Components/Pagination/Index';
import VerticalCards from '../../../../../src/Components/Jobs/Dashboard/Table/VerticalCards';
import NoDataFound from '../../../../../src/Components/NoDataFound/NoDataFound';
import { Pagination } from '@mui/material';
import { Tune } from '@mui/icons-material';
import ProjectDashboardFilter from '../../../../../src/Components/Filters/ProjectDashboardFilter';
import { filterAwardedJobsDashboardDynamicController } from '../../../../../src/Controllers/Filters/index'
import { animateScroll } from 'react-scroll'
import Months from '../../../../../src/Constants/months'
import { useRouter } from 'next/router';
import { useViewMode } from '../../../../../src/Hooks/useViewMode';

function Dashboard() {
    const [InitialData, setInitialData] = useState([])
    const [dashboardJobs, setdashboardJobs] = useState([])
    const [editPopupData, seteditPopupData] = useState(null);
    const [Loading, setLoading] = useState(true);
    const [noOfPages, setNoOfPages] = useState(null)
    const [viewMode, setViewMode] = useViewMode()
    const componentView = viewMode === 'grid'
    const setComponentView = (isGrid) => setViewMode(isGrid ? 'grid' : 'list')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterToggled, setfilterToggled] = useState(false)
    const [selectedMonth, setselectedMonth] = useState(0);
    const [Analytics, setAnalytics] = useState({})
    const router = useRouter()

    useEffect(() => {
        const month = new Date().getMonth() + 1
        setselectedMonth(month)
        fetchDashboardJobs({ month })
    }, [])


    const onPageChange = (event, value) => {
        getAllDashboardJobsController(value).then((response) => { setdashboardJobs(response.response.jobs); setLoading(false) }).catch((err) => console.log(err))
    }

    const handleMonthChange = (month) => {
        setselectedMonth(month.index + 1)
        fetchDashboardJobs({ month: month.index + 1 })
    }

    const fetchDashboardJobs = (query) => {
        query.completed = true
        getAllDashboardJobsController(query)
            .then((res) => { setdashboardJobs(res.response.jobs); setInitialData(res.response.jobs); setLoading(false) })
            .catch((err) => console.log(err))

        getMonthlyDashboardJobAnalyticsController({ month: query.month })
            .then((data) => {
                setAnalytics(data.response.dashboard)
            })
            .catch((err) => {
                console.log(err)
                toast.error('error occured')
            })
    }

    const updateDashboardData = (data) => {
        updateDashboardJobsController(data)
            .then(() => {
                toast.success("Job dashboard updated")
                getAllDashboardJobsController()
                seteditPopupData(null)
            })
            .catch((err) => toast.error('error occured while updating'))
    }

    const filterDashboardJobs = async (e) => {
        try {
            const filtered = await filterDashboardJobsController(e.target.value)
            setdashboardJobs(filtered.data.response.jobs)
            return filtered.data.response.jobs
        } catch (err) { throw err }
    }

    const dynamicFilterJobs = async (query, page) => {
        try {
            setLoading(true)
            const data = await filterAwardedJobsDashboardDynamicController({ ...query, page })
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

    const JobAnalytics = ({Analytics,monthName}) => {
        return (
            <>
                {Object.keys(Analytics).length > 0 && <div className='job_month_analytics' >
                    <div className='job_analytics_title' >
                        <h2>{monthName}</h2>
                        <h3>Analytics</h3>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Total FABBACKLOG</h3>
                        <h2>{Analytics.FABBacklog}</h2>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Total OFABacklog</h3>
                        <h2>{Analytics.OFABacklog}</h2>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Total backlogHours</h3>
                        <h2>{Analytics.backlogHours}</h2>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Total bidHours</h3>
                        <h2>{Analytics.bidHours}</h2>
                    </div>
                    <div className='job_analytics_title' >
                        <h3>Total PO Price</h3>
                        <h2>{Analytics.po_price}</h2>
                    </div>
                </div>
                }
            </>
        )
    }

    if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

    else

        return (
            <section className='jobs'>
                <div className="head">
                    <h1>Completed Project Dashboard</h1>
                </div>
                <p className='mt_1' >Completed Rebar projects by month.</p>
                <div className='crud'>
                    <div style={{ display: "flex", alignItems: "center" }} >
                        {!filterToggled ? <>
                            <input type="text" placeholder='search awarded jobs' onChange={filterDashboardJobs} />
                            <div style={{ backgroundColor: '#E64848', padding: '5px', borderRadius: '5px', width: "3rem", display: "flex", justifyContent: "center", alignItems: "center" }}><Tune onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ fill: 'white' }} /></div></> :
                            <div className='clear_filter' >
                                <button onClick={() => router.reload()}>Clear filters</button>
                                {!filterToggled && <button onClick={() => animateScroll.scrollToBottom(0)} >View Analytics</button>}
                            </div>
                        }
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <CreditCardOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setComponentView(true)} />
                        <TableChartOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setComponentView(false)} />
                    </div>
                </div>
                <div className='flt_main' >
                    {isFilterOpen && <ProjectDashboardFilter render={renderFilter} setIsFilterOpen={setIsFilterOpen} />}
                </div>

                {!filterToggled && <div className='job_months' >
                    <ul>
                        {Months.map((month, i) => {
                            return <li className={` ${month.index === selectedMonth - 1 && `job_active_month`}`}>{month.name}</li>
                        })}
                    </ul>
                </div>}
                {dashboardJobs.length > 0 && !filterToggled ?
                    <>
                        {dashboardJobs.map((monthlyDashboard) => {
                            let dashboardJobs = monthlyDashboard.jobs
                            return (
                                <>
                                    <div className='job_months'>
                                        <h1 key={selectedMonth}>{monthlyDashboard.monthName}</h1> 
                                    </div>    
                                    {componentView === true ?
                                        <div className='job_list_main' >
                                            <VerticalCards data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} />
                                            {/* <div className='awarded_jobs_pagination' >
                                                <Pagination count="1" onChange={onPageChange} />
                                            </div> */}
                                            <JobAnalytics Analytics={monthlyDashboard.analytics} monthName={monthlyDashboard.monthName}/>
                                        </div>
                                        :
                                        <div className='job_list_main' >
                                            <Table data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} completed={true} />
                                            <JobAnalytics Analytics={monthlyDashboard.analytics} monthName={monthlyDashboard.monthName}/>
                                        </div>
                                    }
                                </>
                            )
                        })}
                    </> :
                    // <div style={noStyle}><NoDataFound /></div>
                    null
                }


                {editPopupData && <EditDashboardJob closePopup={() => seteditPopupData(null)} submit={updateDashboardData} editPopupData={editPopupData} />}
                {/* <Pagination count={noOfPages} className='pagination-center' onChange={onPageChange} /> */}

            </section>
        )
}

export default Dashboard
