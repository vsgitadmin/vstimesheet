import { useState } from 'react';
import { Modal } from '@mui/material';
import styles from './Popup.module.css'

const MarkAttendancePopup = ({ markAttendancePopupOpen, setMarkAttendancePopupOpen, submitData }) => {
    const [AttendenceData, setAttendenceData] = useState({})
    //for close popup    
    const handleClose = () => setMarkAttendancePopupOpen(false);


    const submitFunc = (e) => {
        e.preventDefault()
        submitData(AttendenceData).then((e) => handleClose())
    }

    return (
        <>
            <Modal open={markAttendancePopupOpen} onClose={handleClose} >
                <div className={styles.sublv_popup} >
                    <div className={styles.sublv_popup_title} >
                        <h2>Mark Attendance</h2>
                    </div>
                    <form onSubmit={submitFunc} className={styles.sublv_popup_form} >
                        <label>Project</label>
                        <select required onChange={(e) => AttendenceData['projectId'] = e.target.value}>
                            <option>Project Id</option>
                            <option>Tera FORM</option>
                        </select>
                        <label>Hours</label>
                        <input required type="number" placeholder='hours' onChange={(e) => AttendenceData['hours'] = e.target.value}/>
                        <label>Date</label>
                        <input required type="date" placeholder='Date' onChange={(e) => AttendenceData['date'] = e.target.value}/>
                        <button>Submit</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default MarkAttendancePopup