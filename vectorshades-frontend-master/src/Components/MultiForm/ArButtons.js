import { useState } from 'react';
import ActivationReview from '../../Components/Popups/Hr/ActivationReview';
import {sendEmployeeActivationReviewController} from "../../../src/Controllers/Employee/index"
import styles from './MultiForm.module.css'
import { toast } from 'react-toastify';

const ArButtons = ({approveActivation,emp}) => {

    //for review popup
    const [open, setOpen] = useState(false)
    //for open popup
    const handleOpen = () => {
      setOpen(true)
    }

    const sendActivationReview = (message) => {
      const body = {
        mail:emp.personalEmail,
        name:emp.firstName,
        message
      }
      sendEmployeeActivationReviewController(body).then(() => {
        toast.success("Activation review mailed successfully")
        setOpen(false)
      }).catch((err) => toast.error("error while sending the review"))
    }

  return (
    <>
    <div className={styles.ar_main} >
    <div className={styles.ar_container} >
        <div className={styles.ar_text} >
            <h4>Approve or Review Employee Activation Request</h4>
            <p>
              Review and cross verify the details provided by the employee and slef onbaord them
            </p>
        </div>
        <div className={styles.ar_accept_review_btn} >
            <button onClick={approveActivation}>ACCEPT</button>
            <button onClick={handleOpen} >REVIEW</button>
        </div>
    </div>
    </div>
    {/* popup */}
    <ActivationReview open={open} setOpen={setOpen} sendActivationReview={sendActivationReview}/>
    </>
  )
}

export default ArButtons