import React, { useEffect, useState, useContext } from "react";
import { getEmployeeTimeSheetController, getEmployeeSingleController, aggregateEmployeeTimeSheetController, getEmployeeLeaveController, getEmployeeLeaveByHRController, getLeaveCountController, getEmployeeBasicDetailsController, cancelLeaveController } from '../../../../../src/Controllers/Employee/index'
import { useRouter } from "next/router";
import { ParentStore } from '../../../../_app'
import Form from "../../../../../src/Components/Attendence/Form/Form";
import extractKeys from "../../../../../src/Helpers/Functions/General/ExtractKeys";
import { createLeave, createAttendance, validateLeave } from '../../../../../src/Controllers/Attendance/index'
import { toast } from "react-toastify";
import Calendar from "../../../../../src/Components/Hr/EmployeeTimeSheet/Calendar";
import styles from "../../../../../src/Components/Hr/EmployeeTimeSheet/EmpoyeeTimeSheet.module.css"
import Middle from "../../../../../src/Components/Hr/EmployeeTimeSheet/Middle";
import ProfileSection from "../../../../../src/Components/Hr/EmployeeTimeSheet/ProfileSection";
import SubMenu from "../../../../../src/Components/Hr/EmployeeTimeSheet/SubMenu";
import Leave from "../../../../../src/Components/Hr/EmployeeTimeSheet/Leave";
import NoDataFound from "../../../../../src/Components/NoDataFound/NoDataFound";
import Loader from "../../../../../src/Helpers/Loader";
import { createContext } from "react";

export const TimeSheetContext = createContext()

function EmployeeTimeSheetDetails({ routerObj, fromProfile }) {
    const router = routerObj ? routerObj : useRouter()
    const [details, setDetails] = useState(null);
    const [EmployeeDetail, setEmployeeDetail] = useState({});
    const [LeaveDetails, setLeaveDetails] = useState(null)
    const { ParentState } = useContext(ParentStore);
    const [CurrentMonth, setCurrentMonth] = useState(null);
    const [SectionLoading, setSectionLoading] = useState(false);
    const [Analytics, setAnalytics] = useState(null)
    const [activeMenu, setActiveMenu] = useState('calendar');
    const [NoDataFoundState, setNoDataFoundState] = useState(false)
    const [employeeBasicData, setEmployeeBasicData] = useState()
    const months = ["january", "jebruary", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    useEffect(() => {
        const d = new Date();
        let month = d.getMonth();
        setCurrentMonth(month)
    }, [])

    const filterTimesheet = (dateObj) => {
        const query = {
            month: months[dateObj.month],
            year: `${dateObj.year}`,
            empId: EmployeeDetail._id
        }
        aggregateEmployeeTimeSheetController(query).then((response) => setDetails(response.data.response.timesheets))
    }

    useEffect(() => {
        InitialHydration()
    }, [router.query.id])

    useEffect(() => {
        if (details) {
            const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            const leaves = details.timeSheet.filter((data) => data.type == "LV").length
            const attendence = details.timeSheet.filter((data) => data.type == "AT").length
            const monthI = months.indexOf(details.month)
            const maxdays = days[monthI]
            const callArr = Array.from({ length: maxdays }).map(() => null)
            setAnalytics({ leaves, attendence, total: callArr.length })
        }

    }, [details])


    const InitialHydration = () => {
        if (ParentState && router.query.id) {
            const date = new Date()
            const query = {
                month: months[date.getMonth()],
                year: `${date.getFullYear()}`,
                empId: router.query.id == ParentState.auth._id ? ParentState.auth._id : router.query.id
            }
            if (router.query.id === ParentState.auth._id) {
                aggregateEmployeeTimeSheetController(query).then((response) => setDetails(response.data.response.timesheets))
            } else {
                if (ParentState?.auth.role === "HR") {
                    aggregateEmployeeTimeSheetController(query).then((response) => setDetails(response.data.response.timesheets))
                }
            }
            if (router.query.id == ParentState.auth._id) {
                setEmployeeDetail(ParentState.auth)
                getEmployeeBasicDetailsController({ user: router.query.id }).then((response) => setEmployeeBasicData(response.data.response.data.details))
            }
            else {
                getEmployeeSingleController(router.query.id).then((response) => setEmployeeDetail(response.data.response.emp))
                getEmployeeBasicDetailsController({ user: router.query.id }).then((response) => setEmployeeBasicData(response.data.response.data.details))
            }
        }
    }

    useEffect(() => {
        setNoDataFoundState(false)
        if (activeMenu === "leave") {
            if (LeaveDetails == null) {
                Leavehydration()
            }
        }
    }, [activeMenu])


    const Leavehydration = () => {
        setSectionLoading(true)
        if (router.query.id === ParentState.auth._id) getEmployeeLeaveController({ page: 1 }).then(async (response) => {
            const count = await getLeaveCountController({ employeeId: router.query.id })
            const pageCount = count.data.response.count / 10
            if (response.data.response.logs.length === 0) setNoDataFoundState(true)
            else setLeaveDetails({ data: response.data.response.logs, pageCount: Math.ceil(pageCount), current: 1 })
        }).then(() => setSectionLoading(false))
        else if (ParentState?.auth.role == "HR") getEmployeeLeaveByHRController({ employeeId: router.query.id, page: 1 }).then((response) => {
            const count = getLeaveCountController({ employeeId: router.query.id }).then((dataCount) => dataCount.data.response.count)
            const pageCount = count / 10
            if (response.data.response.logs.length === 0) setNoDataFoundState(true)
            else setLeaveDetails({ data: response.data.response.logs, pageCount, current: 1 })
        }).then(() => setSectionLoading(false))
        else {
            toast("access revoked")
            router.push("/admin/dashboard")
        }

    }


    const onLeaveFormSubmit = async (data) => {
        data.employeeId = router.query.id;
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const currentMonth = new Date();
        const startMonthDiff = Math.abs((currentMonth.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const endMonthDiff = Math.abs((currentMonth.getDay() - endDate.getDay()) / (1000 * 60 * 60 * 24));
        try {
            if (startMonthDiff <= 30 && endMonthDiff <= 30) {
                let isValid = await validateLeave(data);
                if (isValid.data.response.data.valid === false)
                    return toast.error(isValid.data.response.data.message);
                createLeave(data)
                    .then(() => Leavehydration())
                    .then(() => InitialHydration())
                    .then(() => setNoDataFoundState(false))
                    .then((response) => toast("Leave Requested Successfully"));
            } else {
                toast("You Can Only Mark This Month Leave");
            }
        } catch (err) {
            toast("unable to process request");
        }
    };

    const onAttendenceFormSubmit = async (data) => {
        const dateMonth = new Date(data.date).getMonth()
        const currentMonth = new Date().getMonth()
        try {
            if (dateMonth === currentMonth) {
                if (data.projectId != null) {
                    createAttendance(data)
                        .then(() => InitialHydration())
                        .then(() => setNoDataFoundState(false))
                        .then((response) => toast("Attendence Marked Successfully"))
                } else {
                    toast("You must selected a project")
                }
            } else {
                toast("You Can Only Mark This Month Attendance")
            }
        } catch (err) { toast("unable to process request"); console.log(err); }
    }

    const changeLeavePage = (page) => {
        setSectionLoading(true)
        if (router.query.id === ParentState.auth._id) getEmployeeLeaveController({ page })
            .then((response) => setLeaveDetails({ data: response.data.response.logs, pageCount: LeaveDetails.pageCount, current: page }))
            .then(() => setSectionLoading(false))
        else if (ParentState?.auth.role == "HR") getEmployeeLeaveByHRController({ employeeId: router.query.id, page: page })
            .then((response) => setLeaveDetails({ data: response.data.response.logs, pageCount: LeaveDetails.pageCount, current: page }))
            .then(() => setSectionLoading(false))
    }

    const onLeaveCancel = async (id) => {
        await cancelLeaveController({ id })
            .then(() => Leavehydration())
            .then(() => InitialHydration())
            .then(() => setNoDataFoundState(false))
            .then(() => toast("Leave Updated"))
            .catch((err) => toast("unable to process request"))
    }
    // submenu switch logic state

    const contextValues = {
        onLeaveFormSubmit,
        onAttendenceFormSubmit,
        EmployeeDetail,
        ParentState,
        id: router.query.id,
        employyBasicData: employeeBasicData
    }

    return (
        <>
            <TimeSheetContext.Provider value={contextValues}>
                <section className={styles.et_container} style={fromProfile && { paddingTop: "15px" }} >
                    <h1>Time Sheet</h1>
                    <p className="mt_1 grey" >Manage & track your attendence and leave here</p>
                    {employeeBasicData && <ProfileSection data={EmployeeDetail} analytics={Analytics} user={router.query.id} employyBasicData={employeeBasicData} />}
                    <SubMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    {SectionLoading && <div style={{ display: "flex", height: '60%' }}><Loader /></div>}
                    {NoDataFoundState && <div style={{ display: "flex", height: '60%', alignItems: 'center' }}><NoDataFound /></div>}
                    {!SectionLoading && !NoDataFoundState &&
                        <>
                            {activeMenu === "task_list" && <NoDataFound />}
                            {activeMenu === "calendar" && <><Middle CurrentMonth={CurrentMonth} filterTimesheet={filterTimesheet} employeeBasicData={employeeBasicData} /><Calendar timeSheet={details} /></>}
                            {activeMenu === "leave" && <Leave Details={LeaveDetails} changePage={changeLeavePage} submitLeave={onLeaveFormSubmit} leaveCancel={onLeaveCancel} />}
                        </>
                    }
                </section>
            </TimeSheetContext.Provider>

        </>
    )

}
export default EmployeeTimeSheetDetails