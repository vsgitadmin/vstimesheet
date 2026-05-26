import { useState, useContext } from 'react'
import { TimeSheetContext } from '../../../../pages/admin/dashboard/employee/timesheet/[id]'
import { useRouter } from 'next/router'
import MarkAttendancePopup from '../../Popups/Hr/MarkAttendancePopup'
import styles from './EmpoyeeTimeSheet.module.css'
import LeaveReqestPopup from '../../Popups/Hr/LeaveReqestPopup'

const SubMenu = ({ activeMenu, setActiveMenu }) => {

  //mark attendance popup state
  const [markAttendancePopupOpen, setMarkAttendancePopupOpen] = useState(false)
  //request leave popup state
  const [requestLeavePopupOpen, setRequestLeavePopupOpen] = useState(false)

  const { onLeaveFormSubmit, onAttendenceFormSubmit, EmployeeDetail, id, ParentState, employyBasicData } = useContext(TimeSheetContext)
  const router = useRouter()

  const changeMenu = (menu) => {
    setActiveMenu(menu)
  }

  return (
    <div className={styles.middle_links_main}>
      <div className={styles.middle_links} >
        <h3 onClick={() => changeMenu("calendar")} className={activeMenu === "calendar" ? ` ${styles.active_link}` : null}>Calender</h3>
        <h3 onClick={() => changeMenu("leave")} className={activeMenu === "leave" ? ` ${styles.active_link}` : null} >Leave</h3>
      </div>
      <div className={styles.attend_leav_btn} >
        {activeMenu === "leave" ? <button onClick={() => setRequestLeavePopupOpen(true)}>Leave Request</button> :
          null}
      </div>

      <MarkAttendancePopup
        markAttendancePopupOpen={markAttendancePopupOpen}
        submitData={onAttendenceFormSubmit}
        setMarkAttendancePopupOpen={setMarkAttendancePopupOpen} />
      <LeaveReqestPopup
        requestLeavePopupOpen={requestLeavePopupOpen}
        submitData={onLeaveFormSubmit}
        employyBasicData={employyBasicData}
        setRequestLeavePopupOpen={setRequestLeavePopupOpen} />
    </div>
  )
}

export default SubMenu