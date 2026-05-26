import { useEffect, useState } from 'react';
import styles from './Popup.module.css'
import { Modal } from '@mui/material';

const LeaveReqestPopup = ({ requestLeavePopupOpen, submitData, setRequestLeavePopupOpen,employyBasicData }) => {
    const [LeaveData, setLeaveData] = useState({})
    const [leaveDuration, setleaveDuration] = useState(1)
    const submitFunc = (e) => {
        e.preventDefault()
        submitData(LeaveData)
        setRequestLeavePopupOpen(false)
    }

    return (
        <Modal open={requestLeavePopupOpen} onClose={() => setRequestLeavePopupOpen(false)} >
            <div className={styles.sublv_popup} >
                <div className={styles.sublv_popup_title} >
                    <h2>Request Leave</h2>
                </div>
                <form onSubmit={submitFunc} className={styles.sublv_popup_form} >
                    <label>Leave Type</label>
                    <select required onChange={(e) => LeaveData['type'] = e.target.value}>
                        <option hidden >select</option>
                        {employyBasicData &&
                            employyBasicData.leavetypes.map((leaveType) =>
                                <option value={leaveType} >{leaveType}</option>
                            )
                        }
                    </select>
                    <label>Leave Duration</label>
                    <select required onChange={(e) => { LeaveData['duration'] = e.target.value; setleaveDuration(e.target.value) }}>
                        <option hidden >select</option>
                        <option value={0.5} >Half Day</option>
                        <option value={1} >Full Day</option>
                    </select>
                    {leaveDuration == 1 ?
                        <>
                            <label>Start Date</label>
                            <input required onChange={(e) => LeaveData['startDate'] = e.target.value} type="date" placeholder='Start Date' />
                            <label>End Date</label>
                            <input required onChange={(e) => LeaveData['endDate'] = e.target.value} type="date" placeholder='End Date' />
                        </>
                        :
                        <>
                            <label> Date</label>
                            <input required onChange={(e) => { LeaveData['startDate'] = e.target.value; LeaveData['endDate'] = e.target.value }} type="date" placeholder='Start Date' />
                            <select required onChange={(e) => { LeaveData['partOfDay'] = e.target.value; setleaveDuration(e.target.value) }}>
                                <option hidden >Part Of Day</option>
                                <option value={"AM"} >Am</option>
                                <option value={"PM"} >Pm</option>
                            </select>
                        </>
                    }
                    <label>Note</label>
                    <textarea required onChange={(e) => LeaveData['note'] = e.target.value} type="text" placeholder='Note' />
                    <button>Request Leave</button>
                </form>
            </div>
        </Modal>
    )
}

export default LeaveReqestPopup