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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AwardJobPopup from '../../../../src/Components/Popups/Jobs/AwardJobPopup'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import JobActivityUI from '../../../../src/Components/JobActivity/JobActivity'
import Loader from '../../../../src/Helpers/Loader'
import ConfirmationPopup from '../../../../src/Components/Popups/Hr/ConfirmationPopup'
import { BACKEND_URL } from '../../../../src/Constants/Servers'
import { FileOpenOutlined } from '@mui/icons-material'
import SelectUserInput from '../../../../src/Components/SelectUserInput'
import SoftwareSelect from '../../../../src/Components/SoftwareSelect'
import JobAnalytics from '../../../../src/Components/JobAnalytics/JobAnalytics'
import activityStyles from '../../../../src/Components/JobActivity/JobActivity.module.css'
import styles from '../../../../styles/JobDetails.module.css'
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
    const [isEditing, setIsEditing] = useState(false)
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

    const enterEditMode = () => {
        setIsEditing(true)
    }

    const cancelEditMode = () => {
        initialHydration()
        setIsEditing(false)
    }

    const updateJob = () => {
        if (detail?.sub_items.length > 0) detail['pending'] = false; else detail['pending'] = true
        axios.patch(job.patchjobs, detail)
            .then((res) => {
                toast.success("Job Updated successfully");
                setIsEditing(false)
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

        return (<div className={styles.page}>
            <span className={styles.backLink} onClick={() => router.push('/admin/dashboard/jobs')}>
                <ArrowBackIcon /> Back to Jobs
            </span>

            <div className={styles.headerCard}>
                <div>
                    <div className={styles.headerTitleRow}>
                        <h1>{detail.project}</h1>
                        <span className={styles.jobNoBadge}>#{detail.jobNo}</span>
                        {detail.awarded &&
                            <span className={`${styles.statusChip} ${styles.statusAwarded}`}><CheckCircleOutlineIcon />Awarded</span>}
                        {!detail.awarded && detail.pending &&
                            <span className={`${styles.statusChip} ${styles.statusPending}`}><HourglassBottomIcon />Pending Estimate - {moment(detail.estimate).format('MMM DD, YYYY')}</span>}
                        {!detail.awarded && !detail.pending &&
                            <span className={`${styles.statusChip} ${styles.statusEstimate}`}>Estimate</span>}
                    </div>
                </div>
                {!isEditing &&
                    <div className={styles.headerActions}>
                        {!reportGenerated ?
                            <button className={styles.secondaryBtn} onClick={generateReport}><FileOpenOutlined style={{ fontSize: '17px' }} />Generate Report</button> :
                            <button className={styles.secondaryBtn} onClick={() => fetchAndLoadTableView(`${BACKEND_URL}${reportGenerated}`)}><FileOpenOutlined style={{ fontSize: '17px' }} />Download</button>}
                        {!detail.awarded &&
                            <button
                                className={styles.awardBtn}
                                data-disabled={detail.pending ? 'true' : 'false'}
                                onClick={() => detail.pending
                                    ? toast.info('Add a job breakdown before this job can be awarded')
                                    : setawardPopup(true)}
                                title={detail.pending ? 'Add a job breakdown before awarding' : 'Award Job'}
                            ><EmojiEventsIcon /></button>}
                        <button className={styles.iconBtn} onClick={() => setConfirmDeletePopup(true)} title="Delete Job"><DeleteOutlineOutlinedIcon /></button>
                        <button className={styles.primaryBtn} onClick={enterEditMode}><EditOutlinedIcon />Edit Job</button>
                    </div>}
            </div>

            {!isEditing ? (
                <>
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>Job Details</div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <label>Client</label>
                                <p>{detail.client}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Job Date</label>
                                <p>{detail.date ? moment(detail.date).format('MMM DD, YYYY') : '-'}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Estimate Date</label>
                                <p>{detail.estimate ? moment(detail.estimate).format('MMM DD, YYYY') : '-'}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>PO Number</label>
                                <p className={!detail.poNumber ? styles.muted : ''}>{detail.poNumber || 'Not set'}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Last Updated</label>
                                <p>{detail.lastUpdated ? moment(detail.lastUpdated).format('MMM DD, YYYY') : '-'}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Software</label>
                                {detail.software ? (
                                    <div className={styles.softwareTags}>
                                        {detail.software.split(',').filter(Boolean).map((tool) => (
                                            <span key={tool} className={styles.softwareTag}>{tool}</span>
                                        ))}
                                    </div>
                                ) : <p className={styles.muted}>Not set</p>}
                            </div>
                            <div className={styles.infoItem}>
                                <label>Assigned Sales</label>
                                <p className={!detail.assignedSalesBYName ? styles.muted : ''}>{detail.assignedSalesBYName || 'Unassigned'}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Secondary Sales</label>
                                <p className={!detail.assignedSecondarySalesBYName ? styles.muted : ''}>{detail.assignedSecondarySalesBYName || 'Unassigned'}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Third Sales</label>
                                <p className={!detail.assignedThirdSalesBYName ? styles.muted : ''}>{detail.assignedThirdSalesBYName || 'Unassigned'}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Connection Engineer</label>
                                <p className={!detail.assignedConnectionEngineerBYName ? styles.muted : ''}>{detail.assignedConnectionEngineerBYName || 'Unassigned'}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardTitle}>Job Breakdown</div>
                        <div className={styles.breakdownTableWrap}>
                            <table className={styles.breakdownTable}>
                                <thead>
                                    <tr>
                                        <th>Point</th>
                                        <th>Hours</th>
                                        <th>$ PH</th>
                                        <th>Cost</th>
                                        <th>Bid Price</th>
                                        <th>Per Hour</th>
                                        <th>Eng Fee</th>
                                        <th>Bid %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!detail.sub_items || detail.sub_items.length === 0) &&
                                        <tr><td colSpan={8} className={styles.emptyBreakdown}>No breakdown items added yet</td></tr>}
                                    {detail.sub_items?.map((item, index) => (
                                        <tr key={index} className={item.point === 'Total' ? styles.totalRow : ''}>
                                            <td>{item.point}</td>
                                            <td>{item.hours}</td>
                                            <td>{item.cost}</td>
                                            <td>{item.total_cost}</td>
                                            <td>{item.bid}</td>
                                            <td>{typeof item.bid_hour === 'number' ? item.bid_hour.toFixed(2) : item.bid_hour}</td>
                                            <td>{item.eng_fee}</td>
                                            <td>{item.percent}</td>
                                        </tr>
                                    ))}
                                    {detail.sub_items?.length > 0 && detail.total_breakpoints &&
                                        <tr className={styles.totalRow}>
                                            <td>Main Total</td>
                                            <td>{detail.total_breakpoints.hours}</td>
                                            <td>{detail.total_breakpoints.cost}</td>
                                            <td>{detail.total_breakpoints.total_cost}</td>
                                            <td>{detail.total_breakpoints.bid}</td>
                                            <td>{typeof detail.total_breakpoints.bid_hour === 'number' ? detail.total_breakpoints.bid_hour.toFixed(2) : detail.total_breakpoints.bid_hour}</td>
                                            <td>{detail.total_breakpoints.eng_fee}</td>
                                            <td>{detail.total_breakpoints.percent}</td>
                                        </tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Edit Job Details</div>
                    <div className={styles.editFormGrid}>
                        <div className={styles.editFormGroup}>
                            <label htmlFor="project">Project Name</label>
                            <input required type="text" placeholder='name' name='project'
                                onChange={(e) => detail.project = e.target.value} defaultValue={detail.project} />
                        </div>
                        <div className={styles.editFormGroup}>
                            <label htmlFor="client">Client</label>
                            <select value={detail.client} onChange={(e) => toast.info('Client Cannot be modified')}>
                                <option hidden>Select Client</option>
                                {Object.keys(clients).map((name) => {
                                    return (
                                        <option key={name} value={name}>{name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className={styles.editFormGroup}>
                            <label htmlFor="job_date">Job Date</label>
                            <input required type="date" name='job_date'
                                onChange={(e) => detail.date = e.target.value} placeholder='date'
                                defaultValue={moment(detail.date).format('YYYY-MM-DD')} />
                        </div>
                        <div className={styles.editFormGroup}>
                            <label htmlFor="po_no">PO No</label>
                            <input type="text" name='po_no'
                                onChange={(e) => detail.poNumber = e.target.value} placeholder='PO#'
                                defaultValue={detail.poNumber} />
                        </div>
                        <div className={styles.editFormGroup}>
                            <label htmlFor="software">Software</label>
                            <SoftwareSelect options={SteelTools} value={detail.software} onChange={(value) => detail.software = value} />
                        </div>
                        <div className={styles.editFormGroup}>
                            <label htmlFor="est_date">Est Date</label>
                            <input required type="date" onChange={(e) => detail.estimate = e.target.value}
                                placeholder='estimated date'
                                defaultValue={moment(detail.estimate).format('YYYY-MM-DD')} />
                        </div>
                        <div className={styles.editFormGroup}>
                            <SelectUserInput label={'Assigned Sales'} createJob={true} returnUser={handleSalesSelect} returnRaw={true}
                                defaultData={{ _id: detail.assignedSales, firstName: detail.assignedSalesBYName.split(' ')[0], lastName: detail.assignedSalesBYName.split(' ')[1] }}
                                deleteUser={handleSalesDelete} />
                        </div>
                        <div className={styles.editFormGroup}>
                            <SelectUserInput label={'Add Connection Engineer'} createJob={true} returnUser={handleConnectionEngineerSelect} returnRaw={true}
                                defaultData={detail.assignedConnectionEngineer ? { _id: detail.assignedConnectionEngineer, firstName: detail.assignedConnectionEngineerBYName ? detail.assignedConnectionEngineerBYName.split(' ')[0] : '', lastName: detail.assignedConnectionEngineerBYName ? detail.assignedConnectionEngineerBYName.split(' ')[1] : '' } : {}}
                                deleteUser={handleConnectionEngineerDelete} />
                        </div>
                        <div className={styles.editFormGroup}>
                            <SelectUserInput label={'Add Secondary Sales'} createJob={true} returnUser={handleSecondarySalesSelect} returnRaw={true}
                                defaultData={detail.assignedSecondarySales ? { _id: detail.assignedSecondarySales, firstName: detail.assignedSecondarySalesBYName.split(' ')[0], lastName: detail.assignedSecondarySalesBYName.split(' ')[1] } : {}}
                                deleteUser={handleSecondarySalesDelete} />
                        </div>
                        <div className={styles.editFormGroup}>
                            <SelectUserInput label={'Add Third Sales'} createJob={true} returnUser={handleThirdSalesSelect} returnRaw={true}
                                defaultData={detail.assignedThirdSales ? { _id: detail.assignedThirdSales, firstName: detail.assignedThirdSalesBYName.split(' ')[0], lastName: detail.assignedThirdSalesBYName.split(' ')[1] } : {}}
                                deleteUser={handleThirdSalesDelete} />
                        </div>
                    </div>

                    <div className="customise_job" style={{ marginTop: '24px' }}>
                        <JobCustomizer setJobs={(data) => detail.sub_items = data}
                            setTotal={(data) => detail.total_breakpoints = data}
                            defaultData={detail.sub_items} />
                    </div>

                    <div className={styles.editActions}>
                        <button className={styles.secondaryBtn} onClick={cancelEditMode}>Cancel</button>
                        <button className={styles.primaryBtn} onClick={() => setConfirmEditPopup(true)}>Update Job</button>
                    </div>
                </div>
            )}

            {awardPopup &&
                <AwardJobPopup closePopup={() => setawardPopup(false)} setData={(data) => awardJobFunction(data)} />}

            {JobActivities.length > 0 ?
                <div className={activityStyles.job_analytics_main} style={{ marginTop: "22px" }}>
                    <div className={activityStyles.commit_main_str}>
                        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Job Activity</h1>
                        <br />
                        {Job_Actvity_Component}
                    </div>
                    <JobAnalytics createCOReport={createChangeOrderReportFunction} steel={true} jobLinks={[]} deleteOrder={deleteChangeOrderFunction} orders={changeOrders} update={updateChangeOrderFunction} submit={createChangeOrderFunction} perHour={detail.perHour} />
                </div>
                : <div style={{ marginTop: "22px" }}>
                    <JobAnalytics createCOReport={createChangeOrderReportFunction} steel={true} jobLinks={[]} deleteOrder={deleteChangeOrderFunction} orders={changeOrders} update={updateChangeOrderFunction} submit={createChangeOrderFunction} perHour={detail.perHour} />
                </div>
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
