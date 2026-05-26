import ProfileImage from '../../ProfileImage/Image'
import styles from './EmpoyeeTimeSheet.module.css'
import getBusinessDays from '../../../Helpers/General/getBuissnessDays'
import { useEffect, useState } from 'react'


const ProfileSection = ({ data, analytics, user , employyBasicData}) => {
  const [isWorkingOutsideBoolean,setIsWorkingOutsideBoolean] = useState(false)

  const isWorkingOutside = ()=>{
    const currentTime = new Date().getHours()
    const [startTime,endTime] = [parseInt(employyBasicData?.startTime?.split(':')[0]),parseInt(employyBasicData?.endTime?.split(':')[0])]
    if(currentTime >= startTime && currentTime <= endTime) return false
    else return true
}

  useEffect(()=>{
    setIsWorkingOutsideBoolean(isWorkingOutside())
  },[])
  return (
    <>
      <div className={styles.profile_section}>
        <div className={styles.profile_box} >
          <ProfileImage size={100} id={user} key={data} />
          <div>
            <h4>{`${data.firstName} ${data.lastName}`}</h4>
            <h4>{data.designation}</h4>
            <h4>{data.department}</h4>
          </div>
        </div>
        <div className={styles.working_main} >
          <div className={styles.working_hours} >
            <div className={styles.wr_box} >
              <h1> {getBusinessDays()} days</h1>
              <h4>Total Days</h4>
            </div>
            <div className={styles.wr_box} >
              <h1>{analytics?.attendence || 0} days</h1>
              <h4>Present</h4>
            </div>
            <div className={styles.wr_box} >
              <h1>{analytics?.leaves || 0} days</h1>
              <h4>Leave</h4>
            </div>
            <div className={styles.wr_box} >
              <h1>{Math.abs(getBusinessDays() - (analytics?.attendence + analytics?.leaves) )|| 0} days</h1>
              <h4>Not Marked</h4>
            </div>
          </div>
          <div className={styles.wr_buttons} >
            <button className={styles.wr_out} style={{background:isWorkingOutsideBoolean ? 'grey' :'coral'}}>Outside Working Hours</button>
            <button className={styles.wr_working} style={{background: data.online ? 'green' : '#8d99ae'}} >Working</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileSection