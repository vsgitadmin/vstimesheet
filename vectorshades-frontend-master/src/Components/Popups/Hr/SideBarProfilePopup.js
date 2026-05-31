import { useContext, useState } from 'react';
import { AddAPhoto, TrendingFlat } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import styles from './Popup.module.css'
import { ParentStore } from '../../../../pages/_app';
import Link from 'next/link';
import { uploadS3Document } from '../../../Controllers/files/index'
import { updateEmployeeProfilePictureController } from '../../../Controllers/Employee/index'
import ProfileImage from '../../ProfileImage/Image';
import { toast } from 'react-toastify';
import { employeeProfilePictureKey } from '../../../Helpers/Constants/profilePicture';

const SideBarProfilePopup = ({ sideBarProfileOpen, setSideBarProfileOpen }) => {
    const handleClose = () => setSideBarProfileOpen(false);
    const { ParentState, setParentState } = useContext(ParentStore);
    const [photoVersion, setPhotoVersion] = useState(0);
    const [uploading, setUploading] = useState(false);
    const employeeId = ParentState?.auth?._id;
    const profileKey =
        ParentState?.auth?.profileImageKey ||
        employeeProfilePictureKey(employeeId);

    async function handleFileInputChange(event) {
        const file = event.target.files?.[0];
        if (!file || !employeeId) return;

        setUploading(true);
        const key = employeeProfilePictureKey(employeeId);
        try {
            await uploadS3Document(file, key);
            const { data } = await updateEmployeeProfilePictureController({ profileKey: key });
            const savedKey = data?.response?.data?.profileImageKey || key;
            setParentState((prev) => ({
                ...prev,
                auth: {
                    ...prev.auth,
                    icon: true,
                    profileImageKey: savedKey,
                },
            }));
            setPhotoVersion((v) => v + 1);
            toast.success("Profile picture updated");
        } catch {
            toast.error("Unable to update profile picture");
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    }

    return (
        <>
            <Modal open={sideBarProfileOpen} onClose={handleClose} >
                <div className={styles.sp_popup} >
                    <div className={styles.sp_profile_pic} >
                        <ProfileImage
                            size={"150px"}
                            id={employeeId}
                            imageKey={profileKey}
                            version={photoVersion}
                        />
                        <label htmlFor="file-input" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
                            <AddAPhoto />
                        </label>
                        <input
                            type="file"
                            id="file-input"
                            onChange={handleFileInputChange}
                            accept="image/png,image/jpeg,image/jpg"
                            style={{ display: 'none' }}
                            disabled={uploading}
                        />
                    </div>
                    <div className={styles.sp_employee_info} >
                        <h3>{`${ParentState?.auth.firstName} ${ParentState?.auth.lastName}`}</h3>
                        <h3>{ParentState?.auth.designation}</h3>
                        <h3>{ParentState?.auth.department}</h3>
                    </div>
                    <div className={styles.quick_link_text} >
                        <h3>Quick Links</h3>
                    </div>
                    <div className={styles.quick_links_container} >
                        <Link href={`/admin/dashboard/employee/timesheet/${employeeId}`}>
                            <div className={styles.quick_link_box} onClick={handleClose}>
                                <div className={styles.sub_card} >EMP</div>
                                <div className={styles.text_card} >View TimeSheet</div>
                                <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
                            </div>
                        </Link>
                        <Link href={`/admin/dashboard/employee/details/${employeeId}`}>
                            <div className={styles.quick_link_box} onClick={handleClose}>
                                <div className={styles.sub_card} >EMP</div>
                                <div className={styles.text_card} >View Employee Details</div>
                                <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
                            </div>
                        </Link>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default SideBarProfilePopup
