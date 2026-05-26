import { useEffect, useState } from 'react'
import { CancelRounded, CheckCircle } from '@mui/icons-material'
import styles from './EmpoyeeTimeSheet.module.css'
import HourglassDisabledOutlinedIcon from '@mui/icons-material/HourglassDisabledOutlined';
import NoDataFound from '../../NoDataFound/NoDataFound';
import DailyLogs from '../../Popups/Hr/DailyLogs';


const Calendar = ({ timeSheet }) => {
  const [CalenderIndexes, setCalenderIndexes] = useState([]);
  const [ dailyLogsPopupOpen, setDailyLogsPopupOpen] = useState(false)
  const [selectedDate,setSelectedDate] = useState(null)
  const [CalDays, setCalDays] = useState([])
  const months = ["january", "jebruary", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

  const getMonthIndex = (monthStr) => {
    if (!monthStr) return -1
    const m = String(monthStr).toLowerCase()
    const idx = months.indexOf(m)
    if (idx !== -1) return idx
    if (m === 'february') return 1 // accept correct spelling too

    // Last resort: let JS parse a month name
    const year = Number(timeSheet?.year) || new Date().getFullYear()
    const parsed = new Date(`${monthStr} 1, ${year}`)
    return Number.isNaN(parsed.getTime()) ? -1 : parsed.getMonth()
  }

  const getDaysInMonth = (year, monthIndex) => {
    if (!Number.isFinite(year) || monthIndex < 0 || monthIndex > 11) return 0
    return new Date(year, monthIndex + 1, 0).getDate()
  }
 
  useEffect(() => {
    if (timeSheet) {
      const year = Number(timeSheet?.year) || new Date().getFullYear()
      const monthI = getMonthIndex(timeSheet.month)
      const maxdays = getDaysInMonth(year, monthI)
      const callArr = Array.from({ length: maxdays }).map(() => null)
      timeSheet.timeSheet.forEach((data) => {
        const date = parseInt(data.date.split('-')[2].split('T')[0])
        callArr[date - 1] = data
      })
      setCalDays(callArr)
    } else setCalDays([])
  }, [timeSheet])

  const noStyle = {
    height: '56%',
    display: 'flex',
    alignItems: 'center'
  }

  const closeLogs = () => {
    setDailyLogsPopupOpen(false)
    setSelectedDate(null)
  }

  if (timeSheet)

  return (
    <>
      <div className={styles.calendar_container} >
     { dailyLogsPopupOpen &&  <DailyLogs close={closeLogs}  key={selectedDate} dailyLogsPopupOpen={dailyLogsPopupOpen} setDailyLogsPopupOpen={setDailyLogsPopupOpen} selectedDate={selectedDate}/>}
        <ul className={styles.weekdays}>
          <li>Mo</li>
          <li>Tu</li>
          <li>We</li>
          <li>Th</li>
          <li>Fr</li>
          <li>Sa</li>
          <li>Su</li>
        </ul>

        <ul className={styles.days}>
          {timeSheet && (() => {
            const year = Number(timeSheet?.year) || new Date().getFullYear()
            const monthI = getMonthIndex(timeSheet.month)
            const firstDay = new Date(year, monthI, 1)
            // JS: 0=Sun..6=Sat; UI header is Monday-first -> shift so Monday=0..Sunday=6
            const leadingBlanks = Number.isNaN(firstDay.getTime()) ? 0 : ((firstDay.getDay() + 6) % 7)
            const grid = Array.from({ length: leadingBlanks }).map(() => ({ _blank: true }))
              .concat(CalDays.map((d) => d))

            return grid.map((data, index) => {
            if (data && data._blank) {
              return <li key={`blank-${index}`} />
            }

            const dayNumber = index - leadingBlanks + 1
            if (!data) {
              return (
                <li key={`day-${dayNumber}`} >
                  <h2>{dayNumber}</h2>
                  <div className={styles.calendar_attendance} >
                    <HourglassDisabledOutlinedIcon style={{ fill: "gold" }} />
                    <h3>Not Marked</h3>
                  </div>
                </li>
              )
            } else if (data.type == "AT") {
              return (
                <li key={`day-${dayNumber}`} onClick={() =>{ setSelectedDate(data.date);setDailyLogsPopupOpen(true)}} >
                  <h2>{dayNumber}</h2>
                  <div className={styles.calendar_attendance} >
                    <CheckCircle style={{ fill: "green" }} />
                    <h3>present</h3>
                  </div>
                </li>
              )

              }  else if (data.approved == true && data.type == "LV") {
                return (
                  <li key={`day-${dayNumber}`} onClick={() => setDailyLogsPopupOpen(true)} >
                    <h2>{dayNumber}</h2>
                    <div className={styles.calendar_attendance} >
                      <CancelRounded style={{ fill: "red" }} />
                      <h3>Approved Leave</h3>
                    </div>
                  </li>
                )
              }
              else if (data.type== "LV" && data.approved == false ){
                return (
                  <li key={`day-${dayNumber}`} onClick={() => setDailyLogsPopupOpen(true)} >
                    <h2>{dayNumber}</h2>
                    <div className={styles.calendar_attendance} >
                      <CancelRounded style={{ fill: "red" }} />
                      <h3>Pending</h3>
                    </div>
                  </li>
                )
              }
            return null
            })
          })()}
          </ul>
        </div>
      </>
    )
  else return <div style={noStyle}><NoDataFound /></div>
}

export default Calendar