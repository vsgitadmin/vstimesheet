import { AccessTimeOutlined, KeyboardArrowDown, NotificationsOutlined } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import styles from '../../../styles/ActiveTasks.module.css'

const Activity = ({dashboardData}) => {

  function formatDate(date) {
    const diff = new Date() - date;
  
    if (diff < 1000 * 60) {
      return 'just now';
    } else if (diff < 1000 * 60 * 60) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return `${hours}hr ago`;
    } else if (diff < 1000 * 60 * 60 * 24 * 30) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return `${days}d ago`;
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${day}-${month}-${year}`;
    }
  }

  return (
    <>
    <div className={styles.ats_right_side} >
         
          <div className={styles.ats_text_area} >
            <h2>Project Activity</h2>
            <p>Here is list of all project activities</p>
          </div>

          <div className={styles.ats_meeting} >
          {
            dashboardData.activityAnalytics.map((task)=>{
              const date = new Date(task.createdAt);
              return(
                <div className={styles.ats_meeting_box} >
                  {/* <div className={styles.ats_meeting_img} >
                    <img src="https://i.ibb.co/ZzQy1Dk/meeting-1.png" alt="img" />
                  </div> */}
                  <div className={styles.ats_meeting_det} >
                    <h5>{task.text}</h5>
                  <div className={styles.ats_meeting_more} >
                  <div>
                      <h6 >{task.createdBy.name}</h6>
                      <h6>{task.taskName}</h6>
                  </div>
                  <div className={styles.ats_created_on} >
                      <AccessTimeOutlined style={{fill:"grey",fontSize:"19px"}} />
                      <h5>Updated :<span> {formatDate(date)}</span></h5>
                  </div>
                  </div>
                </div>
              </div>
            )
          })
        }
        </div>
        </div>
    </>
  )
}

export default Activity