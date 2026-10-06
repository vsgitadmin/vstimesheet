import { useEffect, useState } from 'react'
import ProfileImage from '../../ProfileImage/Image'
import styles from '../../../../styles/Engage.module.css'
import { getHrActivities, createEmployeeActivity } from '../../../../src/Controllers/Hr/index'
import { toast } from 'react-toastify'
import moment from 'moment'
import AddActivityPopup from '../../Popups/General/AddActivityPopup'
import CelebrationIcon from '@mui/icons-material/Celebration'
import CakeIcon from '@mui/icons-material/Cake'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import InboxIcon from '@mui/icons-material/Inbox'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'Birthday', label: 'Birthday' },
  { key: 'Employee Events', label: 'Employee Events' },
]

const getActivityIcon = (type) => {
  switch (type) {
    case 'Birthday':
      return { icon: <CakeIcon />, markerClass: 'markerBirthday' }
    case 'Employee Events':
      return { icon: <CelebrationIcon />, markerClass: 'markerEvent' }
    case 'Apraisal':
      return { icon: <EmojiEventsIcon />, markerClass: 'markerAppraisal' }
    default:
      return { icon: <ChatBubbleOutlineIcon />, markerClass: 'markerDefault' }
  }
}

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
    let response = getHrActivities({ type })
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

  const weekKeys = Object.keys(activities).reverse()

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><CelebrationIcon /></span>Engage</h1>
          <p className={styles.subtitle}>Stay on top of important activities like birthdays, appraisals and more</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabList}>
          {TABS.map((tab) => (
            <span
              key={tab.key}
              onClick={() => { setActiveMenu(tab.key); handleTypeChange(tab.key) }}
              className={`${styles.tab} ${activeMenu === tab.key ? styles.tabActive : ''}`}
            >
              {tab.label}
            </span>
          ))}
          {/* {
            labels.map((label) =>
              <span onClick={() => { setActiveMenu(label.toLowerCase()); handleTypeChange(label.toLowerCase()) }} className={`${styles.tab} ${activeMenu === label.toLowerCase() ? styles.tabActive : ''}`} >{label}</span>
            )
          } */}
        </div>
        {ParentState?.auth.role === 'HR' &&
          <button className={styles.addBtn} onClick={() => setActivityPopup(true)}>
            <AddCircleOutlineIcon />ADD ACTIVITY
          </button>}
      </div>

      {weekKeys.length > 0 ? (
        <div className={styles.feed}>
          {weekKeys.map((key) => (
            <div className={styles.weekSection} key={key}>
              <div className={styles.weekHeader}>
                <h3>{key}</h3>
                <span className={styles.countBadge}>{activities[key].length} update{activities[key].length === 1 ? '' : 's'}</span>
              </div>
              <div className={styles.timeline}>
                {activities[key].map((activityData, index) => {
                  const { icon, markerClass } = getActivityIcon(activityData.type)
                  const isLast = index === activities[key].length - 1
                  return (
                    <div className={styles.timelineItem} key={activityData._id || index}>
                      <div className={styles.timelineRail}>
                        <div className={`${styles.timelineMarker} ${styles[markerClass]}`}>
                          {icon}
                        </div>
                        {!isLast && <div className={styles.timelineLine}></div>}
                      </div>
                      <div className={styles.timelineCard}>
                        <div className={styles.timelineCardTop}>
                          <h4>{activityData.employeeName}</h4>
                          <span>{moment(activityData.createdAt).format('YYYY-MM-DD')}</span>
                        </div>
                        <p className={styles.timelineText}>{activityData.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <InboxIcon />
          <h4>No activity yet</h4>
          <p>Birthdays, appraisals and events will show up here</p>
        </div>
      )}

      <AddActivityPopup submit={handleAddActivityPopup} addActivityPopup={addActivityPopup} setActivityPopup={setActivityPopup} />
    </div>
  )
}

export default Activity
