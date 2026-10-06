import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '../../../../src/Axios/Axios.config'
import JobCustomizer from '../../../../src/Components/JobCustomizer'
import moment from 'moment'
import { job } from "../../../../src/Constants/API/Endpoints"
import { toast } from 'react-toastify';
import {
    awardJobController, deleteJobController, generateReportJobsController, getChangeOrder, createChangeOrder, updateChangeOrder, deleteChangeOrder
    , createChangeOrderReport
} from "../../../../src/Controllers/Jobs/index"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AwardJobPopup from '../../../../src/Components/Popups/Jobs/AwardJobPopup'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import JobActivityUI from '../../../../src/Components/JobActivity/JobActivity'
import Loader from '../../../../src/Helpers/Loader'
import ConfirmationPopup from '../../../../src/Components/Popups/Hr/ConfirmationPopup'
import { BACKEND_URL } from '../../../../src/Constants/Servers'
import { FileOpenOutlined } from '@mui/icons-material'
import SelectUserInput from '../../../../src/Components/SelectUserInput'
import JobAnalytics from '../../../../src/Components/JobAnalytics/JobAnalytics'
import styles from '../../../../src/Components/JobActivity/JobActivity.module.css'
import { ParentStore } from "../../../_app";
import { useClients } from '../../../../src/Constants/clients'
import { fetchCSVData } from '../../../../src/Helpers/Functions/Api Functions/readFileData'
import SteelTools from '../../../../src/Constants/steelTools'

function Details() {
    const [detail, setDetail] = useState(null);
    const [awardDetail, setawardDetail] = useState({});
    const [awardPopup, setawardPopup] = useState(false);
    const [Loading, setLoading] = useState(true);
    const [ConfirmDeletePopup, setConfirmDeletePopup] = useState(false);
    const [ConfirmEditPopup, setConfirmEditPopup] = useState(false)
    const [JobActivities, setJobActivities] = useState([]);
    const [reportGenerated, setreportGenerated] = useState(false)
    const [changeOrders, setchangeOrders] = useState([])
    const router = useRouter()
    const { ParentState } = useContext(ParentStore)
    const { clients, loading: clientsLoading } = useClients();

    useEffect(() => {
        if (router.query.id) {
            initialHydration()
        }
    }, [router.query])


    const fetchAndLoadTableView = async (url) => {
        const data = await fetchCSVData(url)
        console.log(data)
    }

    const initialHydration = () => {
        axios.get(job.getjobdetails, { params: { "id": router.query.id } })
            .then((res) => {
                setDetail(res.data.response.job)
                setJobActivities(res.data.response.activity)
                setLoading(false)
            })
            .catch((err) => {
                toast.error("error occured while fetching job")
            })
        getChangeOrdersFunction()
    }

    const Job_Actvity_Component = JobActivities.map((job_activity) => {
        return (<>
            <JobActivityUI direct={job_activity.activity.direct} date={job_activity.createdAt}
                total={job_activity.activity.total} added={job_activity.activity.added}
                removed={job_activity.activity.removed} updated={job_activity.activity.updated} />
        </>)
    })

    const updateJob = () => {
        if (detail?.sub_items.length > 0) detail['pending'] = false; else detail['pending'] = true
        axios.patch(job.patchjobs, detail)
            .then((res) => {
                toast.success("Job Updated successfully");
                setTimeout(() => {
                    router.push('/admin/dashboard/jobs')
                }, 1000);
            })
            .catch((err) => console.log(err))
    }

    const generateReport = async () => {
        try {
            const data = await generateReportJobsController({ id: detail._id })
            setreportGenerated(data.data.response.path)
            toast.success("Report Generated Successfully")
        } catch (err) {
            console.log(err)
            toast.error("error in generating report")
        }
    }

    const formulaObjects = ['poPrice', 'coPrice', 'billed', 'billingBbacklog'];

    const keyNames = {
        poPrice: 'po_price',
        coPrice: 'co_price',
        billed: 'billed',
        billingBbacklog: 'billing_backlog'
    }

    const evaluateFormula = async (formula, data) => {
        const regex = /[a-zA-Z_]+|%[0-9]+/g;
        const variables = formula.match(regex);
        let evaluatedFormula = formula;
        variables.forEach(variable => {
            evaluatedFormula = evaluatedFormula.replace(
                variable,
                variable.includes('%')
                    ? `*${parseInt(variable.slice(1)) / 100}`
                    : data[variable]
            );
        });
        try {
            eval(evaluatedFormula);
            return formula.replace(/[a-zA-Z_]+|%[0-9]+/g, variable =>
                variable.includes('%')
                    ? `*${parseInt(variable.slice(1)) / 100}`
                    : keyNames[variable]
            );
        } catch (error) {
            throw false;
        }
    };

    const awardJobFunction = async (data) => {
        let dummyformulaObj = {}
        formulaObjects.forEach((key) => dummyformulaObj[key] = 10)
        const clientData = clients?.[detail.client]
        if (!clientData) {
            toast.error("Client formulas not loaded yet");
            return;
        }
        data.OFABacklogFormula = await evaluateFormula(clientData.OFAFormula, dummyformulaObj)
        data.FABBacklogFormula = await evaluateFormula(clientData.FABFormula, dummyformulaObj)
        data.jobId = detail._id;
        data.jobNo = detail.jobNo
        awardJobController(data)
            .then((res) => {
                setawardPopup(false);
                toast.success("Job Awarded Successfully");
                setTimeout(() => {
                    router.push('/admin/dashboard/jobs/awarded');
                }, 1000);
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const deleteChangeOrderFunction = (id) => {
        deleteChangeOrder({ id })
            .then((res) => {
                toast.success("Change Order Deleted Successfully");
                router.reload()
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const getChangeOrdersFunction = () => {
        getChangeOrder({ id: router.query.id })
            .then((res) => {
                setchangeOrders(res.data.response.data)
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const createChangeOrderFunction = (body) => {
        body.jobId = router.query.id
        createChangeOrder(body)
            .then((res) => {
                toast.success("Change Order Created Successfully");
                router.reload()
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const updateChangeOrderFunction = (body) => {
        updateChangeOrder(body)
            .then((res) => {
                toast.success("Change Order Updated Successfully");
                router.reload()
            })
            .catch((err) => console.log(err));
    }

    const deleteJob = () => {
        deleteJobController(detail._id)
            .then((res) => {
                toast.success("Job deleted successfully");
                setTimeout(() => {
                    router.push('/admin/dashboard/jobs')
                }, 1000);
            })
            .catch((err) => toast.error("unable to process request"))
    }

    const handleSalesSelect = (user) => {
        detail.assignedSales = user._id
        detail.assignedSalesBYName = user.firstName + ' ' + user.lastName
    }

    const handleSecondarySalesSelect = (user) => {
        detail.assignedSecondarySales = user._id
        detail.assignedSecondarySalesBYName = user.firstName + ' ' + user.lastName
    }

    const handleConnectionEngineerSelect = (user) => {
        detail.assignedConnectionEngineer = user._id
        detail.assignedConnectionEngineerBYName = user.firstName + ' ' + user.lastName
    }

    const handleThirdSalesSelect = (user) => {
        detail.assignedThirdSales = user._id
        detail.assignedThirdSalesBYName = user.firstName + ' ' + user.lastName
    }

    const createChangeOrderReportFunction = async () => {
        const create = await createChangeOrderReport({ id: detail._id, file: `${detail.project}_co` })
        return create
    }

    const handleSalesDelete = () => {
        delete detail.assignedSales
        delete detail.assignedSalesBYName
    }

    const handleSecondarySalesDelete = () => {
        delete detail.assignedSecondarySales
        delete detail.assignedSecondarySalesBYName
    }

    const handleConnectionEngineerDelete = () => {
        delete detail.assignedConnectionEngineer
        delete detail.assignedConnectionEngineerBYName
    }

    const handleThirdSalesDelete = () => {
        delete detail.assignedThirdSales
        delete detail.assignedThirdSalesBYName
    }

    if (Loading || clientsLoading) return <Loader />

    else if (detail)

        return (<div className='edit_job'>
            <div className="add_job">
                <div className="head">
                    <h1>{detail?.project} #{detail?.jobNo}</h1>
                    <br />
                    <div className='add_job_form_container'>
                        <div className='add_job_input_group'>
                            <label htmlFor="project">Project Name</label><br />
                            <input required type="text" placeholder='name' name='project'
                                onChange={(e) => detail.project = e.target.value} defaultValue={detail.project} />
                        </div>
                        <div className='add_job_input_group'>
                            <label htmlFor="client">Client</label><br />
                            {/* <input required type="text" placeholder='client' name='client'
                                onChange={(e) => detail.client = e.target.value} defaultValue={detail.client} /> */}
                            <select value={detail.client} onChange={(e) => toast.info('Client Cannot be modified')}>
                                <option hidden>Select Client</option>
                                {Object.keys(clients).map((name) => {
                                    return (
                                        <option value={name}>{name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='add_job_input_group'>
                            <label htmlFor="job_date">Job Date</label><br />
                            <input required type="date" name='job_date'
                                onChange={(e) => detail.date = e.target.value} placeholder='date'
                                defaultValue={moment(detail.date).format('YYYY-MM-DD')} />
                        </div>
                        <div className='add_job_input_group'>
                            <label htmlFor="job_date">PO No</label><br />
                            <input type="text" name='job_date'
                                onChange={(e) => detail.poNumber = e.target.value} placeholder='PO#'
                                defaultValue={detail.poNumber} />
                        </div>
                        <div className='add_job_input_group' >
                            <label htmlFor="job_date">Software</label><br />
                            <select multiple defaultValue={detail.software} onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                                detail.software = selected.join(',');
                            }}>
                                <option hidden>Select Tool</option>
                                {SteelTools.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='add_job_input_group'>
                            <label htmlFor="est_date">Est Date</label><br />
                            <input required type="date" onChange={(e) => detail.estimate = e.target.value}
                                placeholder='estimated date'
                                defaultValue={moment(detail.estimate).format('YYYY-MM-DD')} />
                        </div>
                        <div className='add_job_input_group' >
                            <SelectUserInput label={'Assigned Sales'} createJob={true} returnUser={handleSalesSelect} returnRaw={true}
                                defaultData={{ _id: detail.assignedSales, firstName: detail.assignedSalesBYName.split(' ')[0], lastName: detail.assignedSalesBYName.split(' ')[1] }}
                                deleteUser={handleSalesDelete} />
                        </div>
                        <div className='add_job_input_group' >
                            <SelectUserInput label={'Add Connection Engineer'} createJob={true} returnUser={handleConnectionEngineerSelect} returnRaw={true}
                                defaultData={detail.assignedConnectionEngineer ? { _id: detail.assignedConnectionEngineer, firstName: detail.assignedConnectionEngineerBYName ?  detail.assignedConnectionEngineerBYName.split(' ')[0] : '', lastName: detail.assignedConnectionEngineerBYName ? detail.assignedConnectionEngineerBYName.split(' ')[1] : ''} : {}}
                                deleteUser={handleConnectionEngineerDelete} />
                        </div>
                        <div className='add_job_input_group' >
                            <SelectUserInput createJob={true} returnUser={handleSecondarySalesSelect} returnRaw={true}
                                defaultData={detail.assignedSecondarySales ? { _id: detail.assignedSecondarySales, firstName: detail.assignedSecondarySalesBYName.split(' ')[0], lastName: detail.assignedSecondarySalesBYName.split(' ')[1] } : {}}
                                deleteUser={handleSecondarySalesDelete} />
                        </div>
                        <div className='add_job_input_group' >
                            <SelectUserInput createJob={true} returnUser={handleThirdSalesSelect} returnRaw={true}
                                defaultData={detail.assignedThirdSales ? { _id: detail.assignedThirdSales, firstName: detail.assignedThirdSalesBYName.split(' ')[0], lastName: detail.assignedThirdSalesBYName.split(' ')[1] } : {}}
                                deleteUser={handleThirdSalesDelete} />
                        </div>

                        <div style={{ marginTop: "18px" }} className='button_box'>
                            {!reportGenerated ? <button onClick={generateReport} style={{
                                fontSize: "14px", float: "right", marginTop: 0, padding: "6.5px", marginLeft: "10px"
                            }}><FileOpenOutlined style={{ fill: "white" }} /></button> :
                                <a onClick={() => fetchAndLoadTableView(`${BACKEND_URL}${reportGenerated}`)} href={``}>Downloadss</a>}
                            {!detail.awarded && !detail.pending && <button onClick={() => setawardPopup(true)}
                                style={{
                                    fontSize: "14px",
                                    float: "right",
                                    marginTop: 0,
                                    padding: "6.5px",
                                    marginRight: "-10px"
                                }}><EmojiEventsIcon
                                    style={{ fill: "white" }} /></button>}
                            {<button onClick={() => setConfirmDeletePopup(true)} style={{
                                fontSize: "14px", float: "right", marginTop: 0, padding: "6.5px"
                            }}><DeleteOutlineOutlinedIcon style={{ fill: "white" }} /></button>}
                            <button onClick={() => setConfirmEditPopup(true)}>Edit Job</button>
                        </div>
                    </div>
                </div>
                <br />
                <br />
                <div className="customise_job">
                    <JobCustomizer setJobs={(data) => detail.sub_items = data}
                        setTotal={(data) => detail.total_breakpoints = data}
                        defaultData={detail.sub_items} />
                </div>
            </div>
            {awardPopup &&
                <AwardJobPopup closePopup={() => setawardPopup(false)} setData={(data) => awardJobFunction(data)} />}

            <div className={styles.job_analytics_main} style={{ padding: "40px", paddingBottom: '0px' }}>
                <div className={styles.commit_main_str}>
                    <h1 style={{ fontSize: "25px" }}>Software - {detail.software}</h1>
                </div>
            </div>
            {JobActivities.length > 0 ?
                <div className={styles.job_analytics_main} style={{ padding: "40px", marginTop: "50px" }}>
                    <div className={styles.commit_main_str}>
                        <h1 style={{ fontSize: "30px" }}>Job Activity</h1>
                        <br />
                        <br />
                        {Job_Actvity_Component}
                    </div>
                    <JobAnalytics createCOReport={createChangeOrderReportFunction} steel={true} jobLinks={[]} deleteOrder={deleteChangeOrderFunction} orders={changeOrders} update={updateChangeOrderFunction} submit={createChangeOrderFunction} perHour={detail.perHour} />
                </div>
                : <>
                    <br />
                    <br />
                    <br />
                    <JobAnalytics createCOReport={createChangeOrderReportFunction} steel={true} jobLinks={[]} deleteOrder={deleteChangeOrderFunction} orders={changeOrders} update={updateChangeOrderFunction} submit={createChangeOrderFunction} perHour={detail.perHour} />
                </>
            }

            <ConfirmationPopup
                confirmPopupOpen={ConfirmDeletePopup}
                setConfirmPopupOpen={setConfirmDeletePopup}
                title={'Delete Job Warning'}
                text={'Deleting this job cannot be undone and can delete any awarded job or dashboard job linked'}
                action={deleteJob}
            />
            <ConfirmationPopup
                confirmPopupOpen={ConfirmEditPopup}
                setConfirmPopupOpen={setConfirmEditPopup}
                title={'Edit Job Warning'}
                text={'Edit this job cannot be undone and can edit any awarded job or dashboard job linked'}
                action={updateJob}
            />

        </div>)
}

export default Details