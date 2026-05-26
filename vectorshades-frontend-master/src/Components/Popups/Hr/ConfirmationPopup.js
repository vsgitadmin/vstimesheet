import { CheckCircle } from '@mui/icons-material';
import { Modal } from '@mui/material';
import styles from './Popup.module.css'

const ConfirmationPopup = ({ confirmPopupOpen, setConfirmPopupOpen, title, text, action }) => {

   //for close popup    
   const handleClose = () => setConfirmPopupOpen(false);

   return (
      <>
         <Modal open={confirmPopupOpen} onClose={handleClose} >
            <div className={styles.conf_popup} >
               <div className={styles.conf_icon} >
                  <CheckCircle fontSize='large' style={{ fill: "orange" }} />
               </div>
               <div className={styles.conf_title} >
                  <h2>{title}</h2>
               </div>
               <div className={styles.conf_para} >
                  <p>
                     {text}
                  </p>
               </div>
               <div className={styles.conf_buttons}>
                  <button onClick={() => {action();handleClose()}}>Confirm</button>
                  <button onClick={handleClose} >Cancel</button>
               </div>
            </div>
         </Modal>
      </>
   )
}

export default ConfirmationPopup