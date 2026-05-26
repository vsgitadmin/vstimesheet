import { useRouter } from 'next/router';
import { Modal } from '@mui/material';
import styles from './Popup.module.css'
import { useEffect, useState } from 'react';
import formatDate, { formatTime } from '../../../Helpers/Functions/General/formatDate';
import { getEmployeeSingleTimeSheetActivity } from '../../../Controllers/Employee/index'
import oldDateFormatter from '../../../Helpers/Functions/General/oldDateFormatter';
import CommitIcon from '@mui/icons-material/Commit';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const DailyLogs = ({ dailyLogsPopupOpen, setDailyLogsPopupOpen, selectedDate , close }) => {
  const router = useRouter()
  const [workLogs, setWorkLogs] = useState([])
  //for close popup    
  const handleClose = () => close();

  useEffect(() => {
    getEmployeeSingleTimeSheetActivity({ id: router.query.id, date: oldDateFormatter(selectedDate) })
      .then((response) =>  setWorkLogs(response.data.response.logs))
  }, [])


  console.log(workLogs)

  return (
    <>
      <Modal open={dailyLogsPopupOpen} onClose={handleClose} >
        <div className={styles.daily_logs_container} >
          <div className={styles.daily_logs_title} >
            <h3>Work Logs Of {new Date(selectedDate).toDateString()}</h3>
          </div>
            <div className='work_logs' >
            {
              workLogs.map((worklog, index) =>
                 <div className="work_log_item">
                   <div className='work_log_icon' >
                    <CommitIcon/>
                    <span></span>
                   </div>
                   <div className='work_log_details' > 
                    <span>{worklog.text} At {formatTime(worklog.createdAt)}</span>
                    <h5>{worklog.task.name}</h5>
                    <i>
                      <AlternateEmailIcon />
                      {worklog.task.projectName}
                    </i>
                   </div>
                 </div>
              )
            }
            </div>
        </div>
      </Modal>
    </>
  )
}

export default DailyLogs