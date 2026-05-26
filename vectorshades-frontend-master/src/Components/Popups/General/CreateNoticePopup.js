import { useState } from 'react';
import { Avatar, MenuItem, Modal, Rating } from '@mui/material';
import styles from './Popup.module.css'
import OutsideClickHandler from 'react-outside-click-handler';
import { Close } from '@mui/icons-material';
import SelectUserInput from '../../SelectUserInput';

const CreateNoticePopupComponent = ({ createNoticePopup, setcreateNoticePopup, submit }) => {
  const [noticePostData, setnoticePostData] = useState({ emps: [] })

  const handleClose = () => setcreateNoticePopup(false);

  return (
    <>
      <Modal open={createNoticePopup} onClose={handleClose} >
        <div className={styles.create_notice_popup} >
          <div className={styles.cn_title} >
            <h2>Create Notice</h2>
          </div>
          <form>
            <div className={styles.cn_form_group}>
              <label>Title</label>
              <input type="text" placeholder='Enter Title' onChange={(e) => noticePostData.title = e.target.value} />
            </div>
            {/* add user dropdown start */}

            <SelectUserInput multiSelect={true} returnUser={(id) => noticePostData.emps = id } deleteUser={() => delete noticePostData.empId} noitce={true} />
            {/* add user dropdown end */}
            <div className={styles.cn_form_group}>
              <label>Message</label>
              <textarea placeholder='Enter Notice Message' onChange={(e) => noticePostData.body = e.target.value}></textarea>
            </div>

            <div className={styles.cn_form_group}>
              <button type='button' onClick={() => {
                setcreateNoticePopup(false)
                submit(noticePostData)
              }}>CREATE NOTICE</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default CreateNoticePopupComponent