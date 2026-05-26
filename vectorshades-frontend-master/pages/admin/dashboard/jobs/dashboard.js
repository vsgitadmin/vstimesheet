import React, { useState, useEffect, useContext, useRef } from 'react'
import Table from '../../../../src/Components/Jobs/Dashboard/Table'
import Link from 'next/link'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { getAllDashboardJobsController, filterDashboardJobsController, generateDashboardReport } from '../../../../src/Controllers/Jobs/index'
import EditDashboardJob from '../../../../src/Components/Popups/Jobs/Dashboard/editDashboardJob';
import { updateDashboardJobsController, getTotalNumberOfJAwardedJobsController, getMonthlyDashboardJobAnalyticsController } from "../../../../src/Controllers/Jobs/index"
import { toast } from 'react-toastify';
import Paging from '../../../../src/Components/Pagination/Index';
import VerticalCards from '../../../../src/Components/Jobs/Dashboard/Table/VerticalCards';
import NoDataFound from '../../../../src/Components/NoDataFound/NoDataFound';
import { Pagination, Tooltip } from '@mui/material';
import { Download, Tune } from '@mui/icons-material';
import ProjectDashboardFilter from '../../../../src/Components/Filters/ProjectDashboardFilter';
import { filterAwardedJobsDashboardDynamicController } from '../../../../src/Controllers/Filters/index'
import { animateScroll } from 'react-scroll'
import Months from '../../../../src/Constants/months'
import { useRouter } from 'next/router';
import { ParentStore } from '../../../_app';
import ReportView from '../../../../src/Components/General/ReportView';


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
    const [selectedMonth, setselectedMonth] = useState(0);
    const [selectedYear, setSelectedyear] = useState(new Date().getFullYear())
    const [monthlyFilterToggled, setmonthlyFilterToggled] = useState(false)
    const [Analytics, setAnalytics] = useState({})
    const router = useRouter()
    const { ParentState } = useContext(ParentStore)
    const month = new Date().getMonth() + 1
    const reportViewRef = useRef()

    useEffect(() => {
        setselectedMonth(month)
        fetchDashboardJobs({ month, year: selectedYear })
    }, [])


    const onPageChange = (event, value) => {
        getAllDashboardJobsController(value).then((response) => { setdashboardJobs(response.response.jobs); setLoading(false) }).catch((err) => console.log(err))
    }

    const handleMonthChange = (month) => {
        const filteredDashboardJobs = InitialData.filter((data) => data._id === month + 1)
        setdashboardJobs(filteredDashboardJobs)
        setselectedMonth(month + 1)
        setmonthlyFilterToggled(true)
    }

    const generateDashboardReportFunction = (query) => {
        reportViewRef.current.openView(generateDashboardReport,query)
    }

    const resetMonthFilter = () => {
        setdashboardJobs(InitialData)
        setmonthlyFilterToggled(false)
        setselectedMonth(100)
    }

    const handleYearChange = (year) => {
        fetchDashboardJobs({ year: year })
        setSelectedyear(year)
    }

    const fetchDashboardJobs = (query) => {
        getAllDashboardJobsController(query)
            .then((res) => {
                setdashboardJobs(res.response.jobs);
                setInitialData(res.response.jobs);
                setyearlyRevenue(res.response.yearly)
                setLoading(false)
            })
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
                fetchDashboardJobs({ month, year: selectedYear })
                toast.success("Job dashboard updated")
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

    const JobAnalytics = ({ Analytics, monthName }) => {
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
                    <h1>Project Dashboard</h1>
                </div>
                <p className='mt_1' >Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
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

                        <select style={{ marginLeft: "1rem" }} value={selectedYear} className='year_select_dropdown' onChange={(e) => handleYearChange(e.target.value)} >
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
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <CreditCardOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setComponentView(true)} />
                        <TableChartOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setComponentView(false)} />
                    </div>
                </div>
                <div className='flt_main' >
                    {isFilterOpen && <ProjectDashboardFilter render={renderFilter} setIsFilterOpen={setIsFilterOpen} />}
                </div>

                {!filterToggled &&
                    <div className='job_months' >
                        <div className='job_months_main' >
                            <ul>
                                {Months.map((month, i) => {
                                    return <li onClick={() => handleMonthChange(i)} className={` ${month.index === selectedMonth - 1 && `job_active_month`}`}>{month.name}</li>
                                })}
                                {monthlyFilterToggled && <button className='month_flt_clear' onClick={resetMonthFilter}>Clear filters</button>}
                            </ul>
                            <div className='year_finance' >
                                <Tooltip title="Generate Report" >
                                    <button className='generate_report' onClick={() => generateDashboardReportFunction()}><Download /></button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                }

                {dashboardJobs.length > 0 && !filterToggled ?
                    <>
                        {dashboardJobs.map((monthlyDashboard) => {
                            let dashboardJobs = monthlyDashboard.jobs
                            return (
                                <>
                                    <div className='job_months'>
                                        <div className='job_months_title' >
                                            <h1 key={selectedMonth}>{monthlyDashboard.monthName}</h1>
                                            <Tooltip title="Generate Report" >
                                                <button className='generate_report' onClick={() => generateDashboardReportFunction({ month: selectedMonth, year: selectedYear })}><Download /></button>
                                            </Tooltip>
                                        </div>
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
                                            <Table update={updateDashboardData} hideEditIcon={ParentState?.auth?.role == 'SA' ? false : false} data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} completed={false} />
                                            <JobAnalytics Analytics={monthlyDashboard.analytics} monthName={monthlyDashboard.monthName} />
                                        </div>
                                    }
                                </>
                            )
                        })}
                    </> :
                    <>
                        {componentView === true ?
                            <div className='job_list_main' >
                                <VerticalCards data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} />
                            </div>
                            :
                            <div className='job_list_main' >
                                <Table update={updateDashboardData} hideEditIcon={ParentState?.auth?.role == 'SA' ? false : false} data={dashboardJobs} enableEditPopup={(data) => { seteditPopupData(data) }} completed={false} />
                            </div>
                        }
                    </>
                }


                {editPopupData && <EditDashboardJob closePopup={() => seteditPopupData(null)} submit={updateDashboardData} editPopupData={editPopupData} />}
                {/* <Pagination count={noOfPages} className='pagination-center' onChange={onPageChange} /> */}
                <ReportView ref={reportViewRef}/>
            </section>
        )
}

export default Dashboard
