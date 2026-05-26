import ProfileImage from '../ProfileImage/Image'
import MultiForm from '../MultiForm/MultiForm'
import styles from '../../../styles/Employee.module.css'
import style from '../MultiForm/MultiForm.module.css'
import EmployeeDetails from '../Employee Profile Sections/details'
import { useState, useEffect } from 'react'
import EmployeeTimeSheetDetails from '../../../pages/admin/dashboard/employee/timesheet/[id]'
import { useRouter } from 'next/router'
import EmpAnalytics from '../EmpAnalytics/EmpAnalytics'
import { getEmployeeBasicDetailsController, updateEmployeeWithBasicDataController } from '../../Controllers/Employee/index'
import Loader from '../Loader/loader'
import { toast } from 'react-toastify'
import EmployeePerformance from '../../../pages/admin/dashboard/employee/performance'
import oldDateFormatter from '../../Helpers/Functions/General/oldDateFormatter'
import ConfirmationPopup from '../Popups/Hr/ConfirmationPopup'
import EmployeerResignationPopup from '../Popups/General/EmployeeResignationPopup'
import Notices from '../../../pages/admin/dashboard/employee/notices/index'
import PerformanceReviewMain from '../../../pages/admin/dashboard/performance-review'
import Activity from './Activity'

const EmployeeProfile = () => {
    const [section, setsection] = useState('details');
    const [EmployeePersonalDetails, setEmployeePersonalDetails] = useState(null);
    const [Employee, setEmployee] = useState(null)
    const [Loading, setLoading] = useState(true);
    const router = useRouter();
    const [confirmationText, setConfirmationText] = useState('')
    const [confirmPopupOpen, setConfirmPopupOpen] = useState(false)
    const [ResignationPopup, setResignationPopup] = useState(false)
    const [resignationReasonBody, setResignationReasonBody] = useState('')

    const updateEmployee = async (data) => {
        updateEmployeeWithBasicDataController(data, { id: router.query.id })
            .then((response) => { toast("Employee Updated") })
            .then((response) => router.push('/admin/dashboard/hr/employees'))
            .catch((err) => toast("unable to process request"))
        setConfirmPopupOpen(false)
    }

    const triggerEmployeeResignationForm = () => setResignationPopup(true)
    const triggerResignationConfirmationPopup = (message) => {
        setResignationReasonBody(message)
        setConfirmationText('Are you sure you want to mark this employee as resigned')
        setConfirmPopupOpen(true)
    }
    const markEmployeeAsResigned = async () => updateEmployee({ resigned: true,active:false,working:false, resignationMessage: resignationReasonBody.resignationMessage })

    const markEmployeeAsOnBench = () => {
        if (Employee.onBench) updateEmployee({ onBench: false })
        else updateEmployee({ onBench: true })
    }

    const reActivateEmployee = () => {
        updateEmployee({ onBoarded: false })

    }

    useEffect(() => {
        if (router.query.id) {
            getEmployeeBasicDetailsController({ user: router.query.id }).then(({ data }) => {
                setEmployeePersonalDetails(data.response.data.details);
                setEmployee(data.response.data.emp);
                setLoading(false);
            }).catch((err) => {
                toast.error("error occured while fetching data")
            })
        }
        if (router.query.url) {
            setsection(router.query.url)
        }
    }, [router.query.id])

    if (Loading) return <Loader />

    else return (
        <>
            {confirmPopupOpen && <ConfirmationPopup text={confirmationText} confirmPopupOpen={confirmPopupOpen} setConfirmPopupOpen={setConfirmPopupOpen} title={'Are You Sure'} action={markEmployeeAsResigned} />}
            {ResignationPopup && <EmployeerResignationPopup submit={triggerResignationConfirmationPopup} createNoticePopup={ResignationPopup} setcreateNoticePopup={setResignationPopup} />}
            <div className={styles.emp_profile_container} >
                <div className={styles.emp_profile_section} >
                    <ProfileImage size="12rem" id={Employee._id} />
                    <div>
                        <h2>{Employee.firstName + ' ' + Employee.lastName}</h2>
                        <h2>{Employee.designation}</h2>
                        {!Employee.onBoarded ? <div className={styles.offline_label} >
                            <div>Onboarding</div>
                        </div> : <div className={Employee.online ? styles.online_label : styles.offline_label} >
                            <div>{Employee.online ? 'Online' : 'Offline'}</div>
                        </div>}
                    </div>
                </div>
                <div className={styles.sub_menu}>
                    <ul>
                        {['Details', 'Dashboard', 'TimeSheet', 'Perfomance', 'Notices', 'Review', 'Activity'].map((name) => {
                            return (
                                <li className={section === name.toLocaleLowerCase() ? styles.active : null} onClick={() => setsection(name.toLocaleLowerCase())}>{name}</li>
                            )
                        })}
                        <li onClick={() => router.push(`/admin/dashboard/employee/profile/edit/${router.query.id}`)}><button>Edit</button></li>
                    </ul>
                </div>
                <div className={styles.emp_details_main} >
                    {EmployeePersonalDetails && <div className={styles.emp_details} >
                        <div>
                            <h3>Designation</h3>
                            <h4>{EmployeePersonalDetails.designation}</h4>
                        </div>
                        <div>
                            <h3>Location</h3>
                            <h4>{EmployeePersonalDetails.city}</h4>
                        </div>
                        <div>
                            <h3>Department</h3>
                            <h4>{EmployeePersonalDetails.department}</h4>
                        </div>
                        <div>
                            <h3>Age</h3>
                            <h4>{EmployeePersonalDetails.age}</h4>
                        </div>
                        <div>
                            <h3>StartTime</h3>
                            <h4>{EmployeePersonalDetails.startTime}</h4>
                        </div>
                        <div>
                            <h3>EndTime</h3>
                            <h4>{EmployeePersonalDetails.endTime}</h4>
                        </div>
                        <div>
                            <h3> Email</h3>
                            <h4>{Employee.email}</h4>
                        </div>
                        <div>
                            <h3>Personal Email</h3>
                            <h4>{Employee.personalEmail}</h4>
                        </div>
                        <div>
                            <h3>Joining Date</h3>
                            <h4>{oldDateFormatter(Employee.joining)}</h4>
                        </div>
                        <div>
                            <h3>Created At</h3>
                            <h4>{oldDateFormatter(Employee.created)}</h4>
                        </div>
                        <div>
                            <h3>Aadhar</h3>
                            <h4>{EmployeePersonalDetails.aadhar}</h4>
                        </div>
                        <div>
                            <h3>Pan</h3>
                            <h4>{EmployeePersonalDetails.pan}</h4>
                        </div>
                        <div>
                            <h3>Salary</h3>
                            <h4>{EmployeePersonalDetails.salary}</h4>
                        </div>
                        <div>
                            <h3>Experience</h3>
                            <h4>{EmployeePersonalDetails.experience}</h4>
                        </div>
                    </div>
                    }
                </div>
                {section.toLocaleLowerCase() =='details' && <EmployeeDetails styles={styles} user={router.query.id} />}
            </div>
            {section.toLocaleLowerCase() =='dashboard' && <EmpAnalytics query={router.query.id} fromProfile={true} />}
            {section.toLocaleLowerCase() =='timesheet' && <EmployeeTimeSheetDetails routerObj={{ query: { id: router.query.id } }} fromProfile={true} />}
            {section.toLocaleLowerCase() =='perfomance' && <EmployeePerformance id={router.query.id} />}
            {section.toLocaleLowerCase() =='notices' && <Notices emp={router.query.id} />}
            {section.toLocaleLowerCase() =='review' && <PerformanceReviewMain emp={router.query.id} />}
            {section.toLocaleLowerCase() =='activity' && <Activity />}
            {Employee.resigned == false && Employee.onBoarded && <div className={styles.actions} >
                <div className={style.ar_container} >
                    <div className={style.ar_text} >
                        <h4>Select Employee actions</h4>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur, commodi accusamus officiis similique aperiam consectetur enim voluptas.</p>
                    </div>
                    <div className={style.ar_accept_review_btn} >
                        <button style={{ background: 'red' }} onClick={() => triggerEmployeeResignationForm()}>RESIGNATION</button>
                        <button style={Employee.onBench ? { background: 'green' } : { background: 'orange' }} onClick={() => markEmployeeAsOnBench()}> {Employee.onBench ? "Remove From Bench" : "Move To Bench"}</button>
                        <button onClick={() => reActivateEmployee()}>Reactivate</button>
                    
                    </div>
                </div>
            </div>}

        </>
    )
}

export default EmployeeProfile