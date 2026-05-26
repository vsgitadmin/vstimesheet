import { useState } from 'react';
import { Avatar, MenuItem, Modal } from '@mui/material';
import styles from './Popup.module.css'
import OutsideClickHandler from 'react-outside-click-handler';
import { Close } from '@mui/icons-material';
import SelectUserInput from '../../SelectUserInput';

const EmployeerResignationPopup = ({ createNoticePopup, setcreateNoticePopup, submit }) => {
  const [noticePostData, setnoticePostData] = useState({})

  const handleClose = () => setcreateNoticePopup(false);

  return (
    <>
      <Modal open={createNoticePopup} onClose={handleClose} >
        <div className={styles.create_notice_popup} >
          <div className={styles.cn_title} >
            <h2>Resignation Form </h2>
          </div>
          <form>
            <div className={styles.cn_form_group}>
              <input type="text" placeholder='Resignation Message' onChange={(e) => noticePostData.resignationMessage = e.target.value} />
            </div>
            {/* add user dropdown start */}

            {/* <SelectUserInput returnUser={(id) => noticePostData.empId = id} deleteUser={() => delete noticePostData.empId} noitce={true} /> */}
            {/* add user dropdown end */}
            {/* <div className={styles.cn_form_group}>
              <textarea placeholder='Enter Notice Message' onChange={(e) => noticePostData.body = e.target.value}></textarea>
            </div> */}
            <div className={styles.cn_form_group}>
              <button type='button' onClick={() => {
                setcreateNoticePopup(false)
                submit(noticePostData)
              }}>Submit</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default EmployeerResignationPopup