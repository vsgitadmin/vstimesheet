import { useContext, useEffect, useState } from 'react'
import { ParentStore } from '../../../../_app'
import { getPunchingInfoListController } from '../../../../../src/Controllers/PunchingInfo'
import NoDataFound from '../../../../../src/Components/NoDataFound/NoDataFound'
import styles from '../../../../../styles/PunchingInfo.module.css'

const secondsToHHMM = (seconds) => {
  if (!seconds) return '00:00'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const secondsToMMSS = (seconds) => {
  if (!seconds) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

const statusClass = (status) => {
  if (status === 'Present') return styles.status_present
  if (status === 'Absent') return styles.status_absent
  return styles.status_none
}

const PunchingInfo = () => {
  const { ParentState } = useContext(ParentStore)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const role = ParentState?.auth?.role
  const isSelfView = role === 'EMP'

  useEffect(() => {
    if (!role) return
    const query = isSelfView ? { uid: ParentState?.auth?.uid } : {}
    getPunchingInfoListController(query)
      .then(({ data }) => setRecords(data?.response?.data || []))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [role, ParentState?.auth?.uid])

  return (
    <div className="container">
      <h1 className={styles.heading}>Punching Info</h1>
      <p className='mt_1 grey'>View employee time punch details</p>

      {!loading && records.length === 0 && <NoDataFound />}

      {records.length > 0 &&
        <table className={styles.table}>
          <thead>
            <tr>
              {!isSelfView && <th>UID</th>}
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Break Duration <span style={{opacity: '0.8', color: 'gray', textTransform: 'lowercase'}}>( hh:mm )</span></th>
              <th>Actual Work</th>
              <th>Status</th>
              <th>Approval Status</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                {!isSelfView && <td>{record.uid}</td>}
                <td>{new Date(record.date).toDateString()}</td>
                <td>{record.inTime}</td>
                <td>{record.outTime}</td>
                <td>{secondsToMMSS(record.breakDuration)}</td>
                <td>{secondsToHHMM(record.actualWorkSeconds)}</td>
                <td><span className={`${styles.status} ${statusClass(record.status)}`}>{record.status}</span></td>
                <td>{record.approvalStatus}</td>
                <td>{record.source}</td>
              </tr>
            ))}
          </tbody>
        </table>}
    </div>
  )
}

export default PunchingInfo
