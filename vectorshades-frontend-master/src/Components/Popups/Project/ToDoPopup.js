import { useState } from 'react'
import { Modal } from '@mui/material'
import styles from './Popup.module.css'

const ToDoPopup = ({toDoPopupOpen, setToDoPopupOpen,submit,defaultData}) => {
  const [data, setdata] = useState({})
  const handleClose = () => setToDoPopupOpen(false)
  const handleChange = (e) => data[e.target.name] = e.target.value;

  const handleSubmit = () => {
      submit(data);
  }

  return (
    <>
    <Modal open={toDoPopupOpen} onClose={handleClose} >
     <div className={styles.project_popup} >
      <div className={styles.heading}>
        <h2>Create To DO</h2>
      </div>
      <div className={styles.form_group} >
        <label>Title</label>
        <input placeholder='Enter Text Here' name='title' onChange={handleChange}></input>
        <label>Description</label>
        <textarea placeholder='Enter Text Here' name='description' onChange={handleChange}></textarea>
      </div>
      <div className={styles.form_group}>
        <label>Priority</label>
        <select  name='priority' onChange={handleChange}>
            <option value="Relaxed">Relaxed</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
        </select>
      </div>
      <div className={styles.last_buttons} >
        <button onClick={handleSubmit}>ADD</button>
        <button onClick={handleClose} >CANCEL</button>
      </div>
     </div>
    </Modal>
    </>
  )
}

export default ToDoPopup