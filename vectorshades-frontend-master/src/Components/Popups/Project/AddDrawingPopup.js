import { Modal } from '@mui/material';
import styles from './Popup.module.css'
import { toast } from "react-toastify";

const AddDrawingPopup = ({ addDrawingPopup, setAddDrawingPopup, createDrawing }) => {

  const handleClose = () => setAddDrawingPopup(false);

  const handleFormSubmit = (e) => {
    e.preventDefault()
    let target = e.target
    createDrawing({ name: target[0].value, deuDate: new Date(), estimatedHour: 0 })
  }

  return (
    <>
      <Modal open={addDrawingPopup} onClose={handleClose} >
        <form onSubmit={handleFormSubmit} className={styles.project_popup} >
          <div className={styles.heading}>
            <h2>Add Drawing</h2>
          </div>
          <div className={styles.form_group} >
            <label>Drawing Name</label>
            <input type="text" placeholder='Drawing Name' name='name' />
          </div>

          <div className={styles.last_buttons} >
            <button>ADD</button>
            <button onClick={handleClose}>CANCEL</button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AddDrawingPopup