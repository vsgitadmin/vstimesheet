import { useState , useContext} from 'react'
import ProfileImage from '../ProfileImage/Image'
import styles from '../../../styles/Hr.module.css'
import CreateNoticePopupComponent from '../Popups/General/CreateNoticePopup'
import oldDateFormatter from '../../Helpers/Functions/General/oldDateFormatter'
import { ParentStore } from '../../../pages/_app'

const NoticesComponent = ({ data, createNotice, deleteNotice, type , empView }) => {
  const {ParentState} = useContext(ParentStore)
  const [createNoticePopup, setcreateNoticePopup] = useState(false);
  return (
    <>
      {createNoticePopup && <CreateNoticePopupComponent submit={createNotice} createNoticePopup={createNoticePopup} setcreateNoticePopup={setcreateNoticePopup} />}
      <div className={styles.ns_container}>
        <div className={styles.ns_title}>
          <h2>Notices</h2>
       { ParentState && ParentState?.auth.role!=="EMP" && !empView && <button onClick={() => setcreateNoticePopup(true)}>CREATE</button>}
        </div>
          { ParentState?.auth.role === "EMP" && <p className='grey' >Stay informed with important updates & announcements</p> }
          { ParentState?.auth.role === "HR" && <p className='grey' >Create notices for employees using the create button, keep everyone informed and engaged.</p> }
        <div className={styles.ns_boxes}>
          {data.map(({ createdByObj, empId, body, createdAt, title, empName, _id }) => {
            return (
              <div className={styles.ns_box}>
                <div className={styles.ns_box_pro}>
                  <ProfileImage id={type === "HR" && !empView ? empId : createdByObj.id} />
                  <div>
                    <h5>{type === "HR" && !empView ? empName : createdByObj.name}</h5>
                    <h5>{type === "HR" && !empView ? 'Employee' : 'Human Resources'}</h5>
                  </div>
                </div>
                <div className={styles.ns_message_box}>
                  <h2>{title}</h2>
                  <p>
                    {body}
                  </p>
                </div>
                <div className={styles.ns_date_delete} > 
                 <div className={styles.ns_delete}>
                 {type === "HR" && !empView && <button onClick={() => deleteNotice(_id)}>Delete</button>}
                 </div>
                 <div className={styles.ns_date}>
                  <h4>{new Date(createdAt).toDateString()}</h4>
                 </div>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </>
  )
}

export default NoticesComponent