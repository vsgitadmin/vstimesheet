import styles from './Popup.module.css'
import Modal from '@mui/material/Modal';
import { useState } from 'react';

const RejectLeaveReasonPopup = ({ open, setOpen, action }) => {
  const [Message, setMessage] = useState('')
  //for close popup    
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal open={open} onClose={handleClose} >
        <div className={styles.ar_popup} >
          <div className={styles.ar_title} >
            <h3>Reason For Rejection </h3>
          </div>
          <div className={styles.ar_textarea} >
            <textarea placeholder='Reason...' onChange={(e) => setMessage(e.target.value)} ></textarea>
          </div>
          <div className={styles.ar_btn} >
            <button onClick={() => action(Message)}>SUBMIT</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default RejectLeaveReasonPopup