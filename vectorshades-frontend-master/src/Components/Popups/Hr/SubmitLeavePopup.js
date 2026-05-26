import { useState } from 'react';
import { Modal } from '@mui/material';
import styles from './Popup.module.css'

const SubmitLeavePopup = ({ submitLeavePopupOpen, setSubmitLeavePopupOpen , submitData}) => {
    const [LeaveData, setLeaveData] = useState({})
    //for close popup    
    const handleClose = () => setSubmitLeavePopupOpen(false);

    const submitFunc = (e) => {
        e.preventDefault()
        submitData(LeaveData).then((e) => handleClose())
    }

    return (
        <>
            <Modal open={submitLeavePopupOpen} onClose={handleClose} >
                <div className={styles.sublv_popup} >
                    <div className={styles.sublv_popup_title} >
                        <h2>Submit Leave</h2>
                    </div>
                    <form onSubmit={submitFunc} className={styles.sublv_popup_form} >
                        <label>Project Id</label>
                        <select required onChange={(e) => LeaveData['projectId'] = e.target.value}>
                            <option>Project Id</option>
                            <option>Tera FORM</option>
                        </select>
                        <label>Leave Type</label>
                        <select required onChange={(e) => LeaveData['type'] = e.target.value}>
                            <option hidden >select</option>
                            <option value="Fulwwl Day" >Full Day</option>
                            <option value="Haf Day" >Half Day</option>
                        </select>
                        <label>Start Date</label>
                        <input required onChange={(e) => LeaveData['startDate'] = e.target.value} min={new Date().toISOString().split('T')[0]} type="date" placeholder='Start Date' />
                        <label>End Date</label>
                        <input required onChange={(e) => LeaveData['endDate'] = e.target.value} type="date" placeholder='End Date' />
                        <label>Note</label>
                        <input required onChange={(e) => LeaveData['note'] = e.target.value} type="text" placeholder='Note' />
                        <button>Apply Leave</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default SubmitLeavePopup