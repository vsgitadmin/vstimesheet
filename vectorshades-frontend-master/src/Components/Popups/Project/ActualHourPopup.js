import { useState } from 'react'
import { Modal } from '@mui/material'
import styles from './Popup.module.css'

const ActualHourPopup = ({ closePopup, submit, rebar }) => {
  const [actualHours, setactualHours] = useState(0)
  const [TonsDetailed, setTonsDetailed] = useState(0)
  return (
    <>
      <Modal open onClose={closePopup}>
        <div className={styles.project_popup} >
          <div className={styles.heading}>
            <h2>Task Submission</h2>
          </div>
          <div className={styles.form_group} >
            <label>CO Hours</label>
            <input placeholder='Used Hours' onChange={(e) => setactualHours(e.target.value)} value={actualHours} name='actual_hour'></input>
          </div>
          {rebar && <div className={styles.form_group} >
            <label>Tons Detailed</label>
            <input placeholder='Tons Detailed' onChange={(e) => setTonsDetailed(e.target.value)} value={TonsDetailed} name='actual_hour'></input>
          </div>}

          <div className={styles.last_buttons} >
            <button onClick={() => submit(actualHours, TonsDetailed)}>COMPLETE</button>
            <button onClick={closePopup}>CANCEL</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ActualHourPopup