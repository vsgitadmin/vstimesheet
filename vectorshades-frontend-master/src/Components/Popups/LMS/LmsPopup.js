import { AccessTime, AlarmOn, CalendarMonth, Cancel, CheckCircle, DeleteForever, Description, Edit, EventAvailable, EventNote, Info, People, Person } from '@mui/icons-material'
import { Avatar, Modal, Tooltip } from '@mui/material'
import styles from '../Project/Popup.module.css'
import style from '../../../../styles/Cloud.module.css'
import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone';
import ProfileImage from "../../ProfileImage/Image"
import PresignedLink from "../../S3/PresignedLink"
import { deleteTraining, markAsActive, markAsComplete } from '../../../Controllers/LMS';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const LmsPopup = ({ lmsPopup, setLmsPopup, data }) => { 
  const router = useRouter()

  const percentageCalculator = (o) => {
    if (o) {
      let percentage = (o.timeSpent / (o.duration * 60 * 60)) * 100
      return percentage > 100 ? 100 : percentage
    } else {
      return 0
    }
  }

  const hanldeMarkAsComplete = () => {
    markAsComplete({ id: data._id }).then((res) => {
      toast.success('marked as compleated')
      setLmsPopup(false)
      data.completed = true
    }).catch((err) => {
      toast.error(err.message)
    })
  }

  const hanldeMarkAsActive = () => {
    markAsActive({ id: data._id, status: !data.active }).then((res) => {
      data.active = !data.active
      toast.success(`marked as ${!data?.active ? 'deactive' : 'active'}`)
      setLmsPopup(false)
    }).catch((err) => {
      toast.error(err.message)
    })
  }

  const handleDeleteTraining = async () => {
    const deleted = await deleteTraining(data._id)
    toast.success('Training Deleted Successfully')
    setLmsPopup(false)
    router.reload()
  }

  return (
    <>
      <Modal open={lmsPopup} onClose={() => setLmsPopup(false)} >
        <div className={styles.task_detail}>
          <div className={styles.task_detail_main} >
            <div className={styles.task_title} >
              <h2>{data?.name}</h2>
              <div>
                {!data?.completed && <> <button onClick={hanldeMarkAsComplete} className={styles.status} ><CheckCircleOutlineTwoToneIcon />Mark As Complete </button><button onClick={hanldeMarkAsActive} className={styles.status} >{data?.active ? <Cancel /> : <CheckCircle />}Mark As {data?.active ? 'deactive' : 'active'} </button></>}
                {data?.completed && <span className='relaxed' style={{display:"flex",alignItems:"center",borderRadius:"50px",fontSize:"13px",paddingLeft:"8px", paddingRight:"8px",padding:"3px" }}>Completed</span>}
              </div>
            </div>

            <div className={styles.task_edit_priority} >
              <button onClick={handleDeleteTraining}><DeleteForever /></button>
            </div>

            <div className={styles.task_hori} >

              {/* task details start */}
              <div className={styles.task_items} style={{ width: "100%" }} >
                <div className={styles.task_desc} style={{ marginBottom: "10px" }} >
                  <h3><Info />General Info</h3>
                </div>
                <div className={styles.task_item} >
                  <h3><EventNote style={{ fill: "grey" }} />Due date</h3>
                  <h3>{new Date(data?.dueDate).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                </div>
                <div className={styles.task_item} >
                  <h3><AlarmOn style={{ fill: "grey" }} />Completed Hours</h3>
                  <h3>{(data?.timeSpent / 3600).toFixed()}h</h3>
                </div>
                <div className={styles.task_item} >
                  <h3><AccessTime style={{ fill: "grey" }} />Allocated Hours</h3>
                  <h3>{data?.duration}h</h3>
                </div>
                <div className={styles.task_item} >
                  <h3><Person style={{ fill: "grey" }} />Assigned By</h3>
                  <h3>{data?.assignedBy}</h3>
                </div>
                <div className={styles.task_users} style={{ marginBottom: "10px" }} >
                  <h3><People />Users</h3>
                  <div>
                    {
                      data?.assignedTo.map((userId) => {
                        return <ProfileImage style={{ width: `30px`, height: `30px` }} size="small" id={userId} />
                      })
                    }
                  </div>
                </div>
                <div className={styles.task_desc} >
                  <h3><Description /> Description</h3>
                  <p>{data?.description}</p>
                </div>
              </div>
              {/* task details end */}

            </div>

            <div style={{ paddingLeft: "4px" }} className={style.cod_recent_files_list} >
              {
                data?.files?.map((file) => {
                  return <Tooltip title='Download'>
                      <div style={{ boxShadow: "0 0 2px 1px lightgrey" }} className={style.cod_recent_file_box} >
                    <PresignedLink s3Ref={file.attributes?.key || file.location} rel="noreferrer">
                        <div>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/65px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png" />
                        </div>
                        <div>
                          <p>{file.fileName}</p>
                        </div>
                    </PresignedLink>
                      </div>
                  </Tooltip>
                })
              }
            </div>

          </div>
        </div>
      </Modal>
    </>
  )
}

export default LmsPopup