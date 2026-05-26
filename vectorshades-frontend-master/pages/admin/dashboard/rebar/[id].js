import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '../../../../src/Axios/Axios.config'
import JobCustomizer from '../../../../src/Components/JobCustomizer'
import moment from 'moment'
import { rebarJob } from "../../../../src/Constants/API/Endpoints"
import { toast } from 'react-toastify';
import {
    awardJobController, deleteJobController, generateReportJobsController, getRebarChangeOrder, createRebarChangeOrder, updateRebarChangeOrder, deleteRebarChangeOrder
} from "../../../../src/Controllers/Rebar/index"
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
import RebarJobCustomizer from '../../../../src/Components/RebarJobCustomizer'
import RebarAwardJobPopup from '../../../../src/Components/Popups/Jobs/RebarAwardJobPopup'
import { useRebarClients } from '../../../../src/Constants/rebarClients'
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import RebarTools from '../../../../src/Constants/rebarTools'

function Details() {
    const [detail, setDetail] = useState(null);
    const [awardDetail, setawardDetail] = useState({});
    const [awardPopup, setawardPopup] = useState(false);
    const [Loading, setLoading] = useState(true);
    const [ConfirmDeletePopup, setConfirmDeletePopup] = useState(false);
    const [ConfirmEditPopup, setConfirmEditPopup] = useState(false)
    const [JobActivities, setJobActivities] = useState([]);
    const [holdStatus, setholdStatus] = useState()
    const [reportGenerated, setreportGenerated] = useState(false)
    const [jobType, setjobType] = useState(null)
    const [changeOrders, setchangeOrders] = useState([])
    const [jobLinks, setjobLinks] = useState([])

    const router = useRouter()
    const { clients: RebarClients, loading: rebarClientsLoading } = useRebarClients();

    useEffect(() => {
        if (router.query.id) {
            initialHydration()
        }
    }, [router.query])

    const initialHydration = () => {
        setLoading(true)
        axios.get(rebarJob.getjobdetails, { params: { "id": router.query.id } })
            .then((res) => {
                setjobType(res.data.response.job.rebarType)
                setDetail(res.data.response.job)
                setjobLinks(res.data.response.jobLinks)
                setJobActivities(res.data.response.activity)
                setholdStatus(res.data.response.job.onHold)
                setLoading(false)
            })
            .catch((err) => {
                toast.error('unable to fetch rebar jobs')
            })
        getChangeOrders()
    }

    const Job_Actvity_Component = JobActivities.map((job_activity) => {
        if (job_activity.activity) {
            return <JobActivityUI direct={job_activity?.activity.direct} date={job_activity.createdAt}
                total={job_activity?.activity.total} added={job_activity?.activity.added}
                removed={job_activity?.activity.removed} updated={job_activity?.activity.updated} />
        }
    })


    const updateJob = () => {
        if (detail?.sub_items.length > 0) detail['pending'] = false; else detail['pending'] = true
        axios.patch(rebarJob.patchjobs, detail)
            .then((res) => {
                toast.success("Job Updated successfully");
                setTimeout(() => {
                    router.push('/admin/dashboard/rebar')
                }, 1000);
            })
            .catch((err) => console.log(err))
    }

    const holdOrUnHoldJob = () => {
        detail.onHold = !detail.onHold
        setholdStatus(detail.onHold)
        axios.patch(rebarJob.patchjobs, detail)
            .then((res) => {
                toast.success("Job Hold Status Updated successfully");
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

    const getChangeOrders = () => {
        getRebarChangeOrder({ id: router.query.id })
            .then((res) => {
                setchangeOrders(res.data.response.data)
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const createChangeOrder = (body) => {
        body.jobId = detail._id
        createRebarChangeOrder(body)
            .then((res) => {
                toast.success("Change Order Created Successfully");
                initialHydration()
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const updateChangeOrder = (body) => {
        updateRebarChangeOrder(body)
            .then((res) => {
                toast.success("Change Order Updated Successfully");
                initialHydration()
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const deleteChangeOrder = (id) => {
        deleteRebarChangeOrder({ id })
            .then((res) => {
                toast.success("Change Order Deleted Successfully");
                initialHydration()
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const awardJobFunction = (data) => {
        data.jobId = detail._id;
        data.rebar = detail.rebarType
        awardJobController(data)
            .then((res) => {
                setawardPopup(false);
                toast.success("Job Awarded Successfully");
                setTimeout(() => {
                    router.push('/admin/dashboard/rebar/awarded');
                }, 1000);
            })
            .catch((err) => toast.error("unable to process request"));
    }

    const deleteJob = () => {
        deleteJobController(detail._id)
            .then((res) => {
                toast.success("Job deleted successfully");
                setTimeout(() => {
                    router.push('/admin/dashboard/rebar')
                }, 1000);
            })
            .catch((err) => toast.error("unable to process request"))
    }

    const handleSalesSelect = (user) => {
        detail.assignedSales = user._id
        detail.assignedSalesBYName = user.firstName + ' ' + user.lastName
    }

    const handleSalesDelete = () => {
        delete detail.assignedSales
        delete detail.assignedSalesBYName
    }


    if (Loading || rebarClientsLoading) return <Loader />

    else if (detail)

        return (<div className='edit_job'>
            <div className="add_rebar_job_container">
                <div>
                    <h1>Edit Job <span style={{ color: detail.onHold === true && 'red' }}>{detail.onHold === true && '- On Hold'}</span></h1>
                    <br />
                    {!detail.linked ?
                        <>
                            <div className='add_rebar_job_form_container'>
                                <div className='add_reabar_job_input_group'>
                                    <label htmlFor="project">Project Name</label><br />
                                    <input required type="text" placeholder='name' name='project'
                                        onChange={(e) => detail.project = e.target.value} defaultValue={detail.project} />
                                </div>
                                <div className='add_reabar_job_input_group'>
                                    <label htmlFor="client">Client</label><br />
                                    <select defaultValue={detail.client} onChange={(e) => detail.client = e.target.value}>
                                        <option hidden>Select Client</option>
                                        {Object.keys(RebarClients).map((name) => {
                                            return (
                                                <option value={name}>{name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className='add_reabar_job_input_group'>
                                    <label htmlFor="job_date">Job Date</label><br />
                                    <input required type="date" name='job_date'
                                        onChange={(e) => detail.date = e.target.value} placeholder='date'
                                        defaultValue={moment(detail.date).format('YYYY-MM-DD')} />
                                </div>
                                <div className='add_reabar_job_input_group'>
                                    <label htmlFor="est_date">Est Date</label><br />
                                    <input required type="date" onChange={(e) => detail.estimate = e.target.value}
                                        placeholder='estimated date'
                                        defaultValue={moment(detail.estimate).format('YYYY-MM-DD')} />
                                </div>
                                <div className='add_reabar_job_input_group' >
                                    <label htmlFor="est_date">Rebar Type</label><br />
                                    <select defaultValue={jobType} onChange={(e) => { detail.rebarType = e.target.value; setjobType(e.target.value) }}>
                                        <option hidden>Select</option>
                                        <option value={'Detailing'}>Detailing</option>
                                        <option value={'Estimation'}>Estimation</option>
                                        <option value={'Dimensional Drawing'}>Dimensional Drawing</option>
                                    </select>
                                </div>
                                <div className='add_reabar_job_input_group' >
                                    <label htmlFor="job_date">Per Hour</label><br />
                                    <input required type="number" defaultValue={detail.perHour} placeholder='$PH' onChange={(e) => detail.perHour = e.target.value} />
                                </div>
                                <div className='add_reabar_job_input_group' >
                                    <label htmlFor="job_date">Per Ton</label><br />
                                    <input required type="number" defaultValue={detail.perTon} placeholder='$PT' onChange={(e) => detail.perTon = e.target.value} />
                                </div>
                                <div className='add_reabar_job_input_group' >
                                    <label htmlFor="job_date">Software</label><br />
                                    <select multiple defaultValue={detail.software} onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                                        detail.software = selected.join(',');
                                    }}>
                                        <option hidden>Select Tool</option>
                                        {RebarTools.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='add_reabar_job_input_group' >
                                    <SelectUserInput createJob={true} returnUser={handleSalesSelect} returnRaw={true}
                                    defaultData={{ _id: detail.assignedSales, firstName: detail.assignedSalesBYName.split(' ')[0], lastName: detail.assignedSalesBYName.split(' ')[1] }}
                                    deleteUser={handleSalesDelete} />
                                </div>
                                <div className='edit_reabar_job_buttons' >
                                    {!reportGenerated ? <button onClick={generateReport}><FileOpenOutlined style={{ fill: "white" }} /></button> :
                                        <a href={`${BACKEND_URL}${reportGenerated}`}>Download</a>}
                                    {!detail.awarded && !detail.pending &&
                                        <button onClick={() => setawardPopup(true)} ><EmojiEventsIcon style={{ fill: "white" }} /></button>}
                                    <button onClick={() => setConfirmDeletePopup(true)}><DeleteOutlineOutlinedIcon style={{ fill: "white" }} /></button>
                                    {detail.awarded && <button style={{ backgroundColor: holdStatus ? '#e74c3c' : 'white' }} onClick={holdOrUnHoldJob}><PendingActionsIcon style={{ fill: holdStatus ? 'white' : 'black' }} /></button>}
                                    <button onClick={() => router.push(`/admin/dashboard/rebar/add?link=${detail._id}`)}>Link Job</button>
                                    <button onClick={() => setConfirmEditPopup(true)}>Edit Job</button>
                                </div>

                            </div>

                        </>

                        :
                        <div className='add_job_form_container'>
                            <div className='add_reabar_job_input_group' >
                                <label htmlFor="est_date">Rebar Type</label><br />
                                <select defaultValue={jobType} onChange={(e) => { detail.rebarType = e.target.value; setjobType(e.target.value) }}>
                                    <option hidden>Select</option>
                                    <option value={'Detailing'}>Detailing</option>
                                    <option value={'Estimation'}>Estimation</option>
                                    <option value={'Dimensional Drawing'}>Dimensional Drawing</option>
                                </select>
                            </div>
                            <div className='add_reabar_job_input_group' >
                                <label htmlFor="job_date">Per Hour</label><br />
                                <input required type="number" defaultValue={detail.perHour} placeholder='$PH' onChange={(e) => detail.perHour = e.target.value} />
                            </div>
                            <div className='add_reabar_job_input_group' >
                                <label htmlFor="job_date">Per Ton</label><br />
                                <input required type="number" defaultValue={detail.perTon} placeholder='$PT' onChange={(e) => detail.perTon = e.target.value} />
                            </div>

                            <div className='edit_reabar_job_buttons'>
                                {!detail.awarded && !detail.pending &&
                                    <button onClick={() => setawardPopup(true)}
                                    ><EmojiEventsIcon
                                            style={{ fill: "white" }} /></button>}
                                <button onClick={() => setConfirmEditPopup(true)}>Edit Job</button>
                            </div>
                        </div>}

                </div>
                <br />
                <br />
                <div className="customise_job">
                    <RebarJobCustomizer type={jobType} setJobs={(data) => detail.sub_items = data}
                        setTotal={(data) => detail.total_breakpoints = data}
                        defaultData={detail.sub_items} />
                </div>
            </div>
            <div className={styles.job_analytics_main} style={{ padding: "40px", paddingBottom: '0px' }}>
                <div className={styles.commit_main_str}>
                    <h1 style={{ fontSize: "25px" }}>Software - {detail.software}</h1>
                </div>
            </div>
            {awardPopup &&
                <RebarAwardJobPopup closePopup={() => setawardPopup(false)} setData={(data) => awardJobFunction(data)} />}
            {JobActivities.length > 0 &&
                <div className={styles.job_analytics_main} style={{ padding: "40px", marginTop: "50px" }}>
                    <div className={styles.commit_main_str}>
                        <h1 style={{ fontSize: "30px" }}>Job Activity</h1>
                        <br />
                        <br />
                        {Job_Actvity_Component}
                    </div>
                    {!detail.linked && <JobAnalytics jobLinks={jobLinks} deleteOrder={deleteChangeOrder} orders={changeOrders} update={updateChangeOrder} submit={createChangeOrder} perHour={detail.perHour} />}
                </div>}
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