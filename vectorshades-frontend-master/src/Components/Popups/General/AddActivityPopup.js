import { FormControl, InputLabel, MenuItem, Modal, Rating, Select } from '@mui/material';
import SelectUserInput from '../../SelectUserInput';
import styles from './Popup.module.css'
import { useState } from 'react';

const AddActivityPopup = ({addActivityPopup, setActivityPopup, submit,parentState }) => {

  const [type, setType] = useState("Birthday")
  const [notificationType, setnotificationType] = useState("app")

  return (
    <Modal open={addActivityPopup} onClose={()=> setActivityPopup(false)} >
        <div className={`${styles.create_notice_popup}`} >
          <div className={styles.cn_title} >
            <h2>Add Activity</h2>
          </div>
          <form>
            {/* <div className={styles.cn_form_group}>
              <label>Title</label>
              <input notificationType="text" placeholder='Enter Title' onChange={(e) => {noticePostData.title = e.target.value;title = e.target.value}} />
            </div> */}
            {/* add user dropdown start */}

            {/* <SelectUserInput noitce={true} /> */}
            {/* add user dropdown end */}
          <FormControl fullWidth>
            <InputLabel id="type-selector">Type</InputLabel>
            <Select
              id="type-selector"
              value={type}
              label="Type"
              onChange={(e)=>setType(e.target.value)}
            >
              <MenuItem value={"Birthday"}>Birthday</MenuItem>
              <MenuItem value={"Apraisal"}>Apraisal</MenuItem>
            </Select>
          </FormControl>
            <FormControl fullWidth>
            <InputLabel id="type-selector">Notification</InputLabel>
            <Select
              id="type-selector"
              value={notificationType}
              label="Type"
              onChange={(e)=>setnotificationType(e.target.value)}
            >
              <MenuItem value={"app"}>TimeSheet Notification</MenuItem>
              <MenuItem value={"mail"}>Mail Notification</MenuItem>
            </Select>
          </FormControl>
            <div className={styles.cn_form_group}>
              <label>Message</label>
              <textarea id='message' placeholder='Enter Notice Message' ></textarea>
            </div>

            <div className={styles.cn_form_group}>
              <button onClick={()=>submit({ text: document.getElementById('message').value, type , notificationType })} type='button' >ADD ACTIVITY</button>
            </div>
          </form>
        </div>
    </Modal>
  )
}

export default AddActivityPopup