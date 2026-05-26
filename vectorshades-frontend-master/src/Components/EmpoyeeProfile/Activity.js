import { AccessTimeOutlined } from '@mui/icons-material'
import styles from '../../../styles/ActiveTasks.module.css'
import { useEffect, useState } from 'react'
import { getSingleEmployeeActivity } from "../../Controllers/Employee/index"
import { useRouter } from 'next/router'

const Activity = () => {
  const router = useRouter()
  const [activities, setActivities] = useState([])

  useEffect(() => {
    getSingleEmployeeActivity({ id: router.query.id }).then((res) => {
      setActivities(res.data.response.data);
    })
  }, [])


  return (
    <div className="container" style={{paddingTop:"20px"}} >
      <div className={styles.ats_text_area} >
        <h2>Project Activity</h2>
        <p>Amet minim mollit non deserunt ullamco and aliqua dolor do amet sint elit</p>
      </div>

      <div className={styles.ats_meeting} >
        {activities.map((a, i) => {
          return <div key={i} className={styles.ats_meeting_box} >
            <div className={styles.ats_meeting_img} >
              <img src="https://i.ibb.co/ZzQy1Dk/meeting-1.png" alt="img" />
            </div>
            <div className={styles.ats_meeting_det} >
              <h5>{a.text}</h5>
              <div className={styles.ats_meeting_more} >
                <div>
                  <h6>{a.type}</h6>
                </div>
                <div className={styles.ats_created_on} >
                  <AccessTimeOutlined style={{ fill: "grey", fontSize: "19px" }} />
                  <h5>Created on:<span> {new Date(a.createdAt).toLocaleDateString()}</span></h5>
                </div>
              </div>
            </div>
          </div>
        })}
      </div>

    </div>
  )
}

export default Activity