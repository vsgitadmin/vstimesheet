import { useEffect, useState } from 'react'
import ProfileImage from '../../ProfileImage/Image'
import styles from '../../../../styles/Hr.module.css'
import { Divider } from '@mui/material'
import { getHrActivities, createEmployeeActivity } from '../../../../src/Controllers/Hr/index'
import { toast } from 'react-toastify'
import moment from 'moment'
import AddActivityPopup from '../../Popups/General/AddActivityPopup'

const Activity = ({ ParentState }) => {

  const [activeMenu, setActiveMenu] = useState("all")
  const [activities, setActivities] = useState([])
  const [labels, setlabels] = useState([])
  const [addActivityPopup, setActivityPopup] = useState(false)

  const handleAddActivityPopup = (props) => {
    props.employeeId = ParentState.auth._id
    props.employeeName = ParentState.auth.firstName + " " + ParentState.auth.lastName
    createEmployeeActivity(props).then((res) => {
      toast.success("Activity added")
      fetchInitialData()
    }).catch((err) => console.log(err))
    setActivityPopup(false)
  }

  const getHrActivitiesController = async (type) => {
    let date = new Date()
    let response = getHrActivities({type})
      .then((response) => { setActivities(response.data.response.data); return response })
      .catch((err) => toast("unable to process request"))
    return response
  }

  const handleTypeChange = (key) => getHrActivitiesController(key)

  const fetchInitialData = () => {
    getHrActivitiesController()
      .then((response) => {
        const newLabels = Object.keys(response.data.response.data).flatMap((key) => response.data.response.data[key].map((obj) => obj.type));
        setlabels([...new Set(newLabels)]);
      })
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  return (
    <div className={styles.hrdash_container} >
      <h2>ENGAGE</h2>
      <p className='mt_1 grey' >Stay on top of important activities like birthdays, appraisals and more</p>

      <div className={styles.activity_bar} >
        <ul>
          <li onClick={() => { setActiveMenu("all"); handleTypeChange("all") }} className={`${activeMenu === "all" && styles.active}`} >All</li>
          <li onClick={() => { setActiveMenu("Birthday"); handleTypeChange("Birthday") }} className={`${activeMenu === "Birthday" && styles.active}`} >Birthday</li>
          <li onClick={() => { setActiveMenu("Employee Events"); handleTypeChange("Employee Events") }} className={`${activeMenu === "Employee Events" && styles.active}`} >Employee Events</li>
          {/* {
            labels.map((label) =>
              <li onClick={() => { setActiveMenu(label.toLowerCase()); handleTypeChange(label.toLowerCase()) }} className={`${activeMenu === label.toLowerCase() && styles.active}`} >{label}</li>
            )
          } */}
          {ParentState?.auth.role === 'HR' && <button onClick={() => setActivityPopup(true)} >ADD ACTIVITY</button>}
        </ul>
      </div>

      <div className={styles.activity_main} >
        {Object.keys(activities).reverse().map((key) =>
          <div className={styles.activity_section_byday} >
            <div className={styles.activity_day} >
              <h3>{key}</h3>
            </div>
            <div className={styles.activities} >
              {
                activities[key].map((activityData) => {
                  return <div className={styles.activity_box_main} >
                    <div className={styles.activity_box} >
                      <div className={styles.profile_details} >
                        {/* <ProfileImage size={43} id={activityData.employeeId} /> */}

                        <div>
                          <h4>{activityData.employeeName}</h4>
                          <p>{moment(activityData.createdAt).format('YYYY-MM-DD')}</p>
                        </div>
                      </div>
                      <div className={styles.activity_text} >
                        <p>{activityData.text}</p>
                      </div>
                    </div>
                    <div className={styles.activity_divider} ></div>
                  </div>
                })
              }
            </div>
            <div className={styles.section_div} ><Divider /></div>
          </div>
        )}


      </div>

      <AddActivityPopup submit={handleAddActivityPopup} addActivityPopup={addActivityPopup} setActivityPopup={setActivityPopup} />
    </div>
  )
}

export default Activity