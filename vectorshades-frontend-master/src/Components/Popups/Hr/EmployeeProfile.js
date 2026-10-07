import { useState, useEffect, useContext } from 'react';
import { DeleteOutline, TrendingFlat } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import ProfileImage from '../../ProfileImage/Image'
import styles from './Popup.module.css'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getEmployeeProfileController } from '../../../Controllers/Employee/index'
import { toast } from 'react-toastify';
import Loader from '../../../Helpers/Loader';
import DeleteEmployeeConfirmation from './DeleteEmployeeConfirmation';
import { ParentStore } from '../../../../pages/_app';

const EmployeeProfile = ({ profileOpen, setProfileOpen, selectedEmp, deleteEmp }) => {
    const [profileData, setprofileData] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const { ParentState } = useContext(ParentStore)
    const canDeleteEmployee = ['HR', 'SA'].includes(ParentState?.auth?.role)

    const confirmDeleteEmployee = () => {
        setIsDeleting(true)
        Promise.resolve(deleteEmp())
            .finally(() => {
                setIsDeleting(false)
                setDeleteConfirmOpen(false)
            })
    }

    useEffect(() => {
        const month = new Date().getMonth()
        getEmployeeProfile(month)
    }, [])

    const getEmployeeProfile = (month) => {
        getEmployeeProfileController({ employee: selectedEmp._id, month })
            .then((data) => {
                setprofileData(data.data.response.data)
                setLoading(false)
            })
            .catch((error) => {
                toast.error('error occured while fetching the profile data')
            })
    }


    const handleClose = () => setProfileOpen(false);
    const router = useRouter();

    if (Loading) return null

    else return (
        <>
            <Modal open={profileOpen} onClose={handleClose} >
                <div className={styles.ep_popup} >
                    {canDeleteEmployee && <div className={styles.ep_delete_icon} onClick={() => setDeleteConfirmOpen(true)} title="Delete Employee">
                        <DeleteOutline fontSize='large' style={{ fill: "#E64848" }} />
                    </div>}
                    <div className={styles.ep_left}>
                        <div className={styles.ep_profile} >
                            <ProfileImage size="150px" />
                        </div>
                        <div className={styles.ep_emp_name} >
                            <h3>{`${selectedEmp.firstName} ${selectedEmp.lastName}`}</h3>
                            <h3>{selectedEmp.designation}</h3>
                        </div>
                        <div className={styles.other_details} >
                            <div className={styles.detail} >
                                <h3>Department</h3>
                                <h3>{selectedEmp.department}</h3>
                            </div>
                            <div className={styles.detail} >
                                <h3>Location</h3>
                                <h3>Kerala, Malappuram</h3>
                            </div>
                            <div className={styles.detail} >
                                <h3>Department</h3>
                                <h3>Marketing</h3>
                            </div>
                            <div className={styles.detail} >
                                <h3>Age</h3>
                                <h3>19</h3>
                            </div>
                        </div>
                    </div>
                    <div className={styles.ep_right}>
                        <div className={styles.ep_quick_link_text} >
                            <h3>Quick Links</h3>
                        </div>
                        <div className={styles.ep_quick_links_container} >
                            <div className={styles.ep_quick_link_box} onClick={() => router.push(`/admin/dashboard/employee/timesheet/${selectedEmp._id}`)}>
                                <div className={styles.ep_sub_card} >EMP</div>
                                <div className={styles.ep_text_card} >Time Sheet</div>
                                <div className={styles.ep_icon_card} ><div><TrendingFlat /></div></div>
                            </div>
                            <div className={styles.ep_quick_link_box} onClick={() => router.push(`/admin/dashboard/employee/details/${selectedEmp._id}`)} >
                                <div className={styles.ep_sub_card} >EMP</div>
                                <div className={styles.ep_text_card} >Employee Details</div>
                                <div className={styles.ep_icon_card} ><div><TrendingFlat /></div></div>
                            </div>
                        </div>
                        <div className={styles.ep_act_title} >
                            <h3>Analystics</h3>
                        </div>
                        {/* <div className={styles.ep_analystics}>
                            <div className={styles.mos_visited} >
                                <h4>Most Visited</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart width={150} height={40} data={data}>
                                        <Tooltip />
                                        <XAxis dataKey="name" />
                                        <Bar dataKey="uv" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.mos_visited} >
                                <h4>Total Sales</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart width={150} height={40} data={data}>
                                        <Tooltip />
                                        <XAxis dataKey="name" />
                                        <Bar dataKey="uv" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div> */}
                        <div className={styles.info_boxes} >
                            <div className={styles.info_box}>
                                <h3>Total Leaves</h3>
                                <h2>5</h2>
                            </div>
                            <div className={styles.info_box}>
                                <h3>Total Leaves</h3>
                                <h2>5</h2>
                            </div>
                            <div className={styles.info_box}>
                                <h3>Total Leaves</h3>
                                <h2>5</h2>
                            </div>
                            <div className={styles.info_box}>
                                <h3>Total Leaves</h3>
                                <h2>5</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <DeleteEmployeeConfirmation
                open={deleteConfirmOpen}
                setOpen={setDeleteConfirmOpen}
                employee={selectedEmp}
                onConfirm={confirmDeleteEmployee}
                isDeleting={isDeleting}
            />
        </>
    )
}

export default EmployeeProfile