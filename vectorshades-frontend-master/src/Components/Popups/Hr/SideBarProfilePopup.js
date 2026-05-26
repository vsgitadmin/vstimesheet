import { useContext, useState } from 'react';
import { AddAPhoto, Edit, TrendingFlat } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import styles from './Popup.module.css'
import { useRouter } from 'next/router';
import { ParentStore } from '../../../../pages/_app';
import Link from 'next/link';
import { uploadS3Document} from '../../../../src/Controllers/files/index'
import ProfileImage from '../../ProfileImage/Image';
import { toast } from 'react-toastify';

const SideBarProfilePopup = ({ sideBarProfileOpen, setSideBarProfileOpen }) => {
    //for close popup    
    const handleClose = () => setSideBarProfileOpen(false);
    const { ParentState } = useContext(ParentStore);
    const [Img, setImg] = useState(null)
    const router = useRouter();

    const uploadProfilePicture = () => {
        if (Img) {
            var formData = new FormData();
            formData.append("file", Img);
            uploadS3Document(Img, `profile/${empId}.jpeg` )
                .then((e) => {
                    toast.success("Profile Picture Uploaded")
                })
                .catch((err) => toast.error("unable to process request"))
        }
    }

    function handleFileInputChange(event) {
        const file = event.target.files[0];
        var formData = new FormData();
        formData.append("file", file);
        uploadS3Document(file, `/profile/${ParentState.auth._id}.jpeg`)
        .then((e) => {
            toast.success("Profile Picture Uploaded")
        })
        .catch((err) => toast.error("unable to process request"))
        
      }

    return (
        <>
            <Modal open={sideBarProfileOpen} onClose={handleClose} >
                <div className={styles.sp_popup} >
                    <div className={styles.sp_profile_pic} >
                        <ProfileImage size={"150px"} id={ParentState?.auth._id}/>
                        {/* <input type="file" onChange={(e) => setImg(e.target.files[0])} accept="image/png,image/jpeg" /> */}
                        <label htmlFor="file-input">
                            <AddAPhoto />
                        </label>
                        <input
                            type="file"
                            id="file-input"
                            onChange={handleFileInputChange}
                            accept="image/png,image/jpeg"
                            style={{ display: 'none' }}
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
                        <Link href={`/admin/dashboard/employee/timesheet/${ParentState?.auth._id}`}>
                            <div className={styles.quick_link_box} onClick={handleClose}>
                                <div className={styles.sub_card} >EMP</div>
                                <div className={styles.text_card} >View TimeSheet</div>
                                <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
                            </div>
                        </Link>
                        <Link href={`/admin/dashboard/employee/details/${ParentState?.auth._id}`}>
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