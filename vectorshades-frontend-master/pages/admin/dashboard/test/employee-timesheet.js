import Calendar from '../../../../src/Components/Hr/EmployeeTimeSheet/Calendar'
import styles from '../../../../src/Components/Hr/EmployeeTimeSheet/EmpoyeeTimeSheet.module.css'
import Middle from '../../../../src/Components/Hr/EmployeeTimeSheet/Middle'
import ProfileSection from '../../../../src/Components/Hr/EmployeeTimeSheet/ProfileSection'

const employeetimesheet = () => {
  return (
    <>
    <section className={styles.et_container} >
        <h1>Attendance Calendar</h1>
        <ProfileSection/>
        <Middle/>
        <Calendar/>
    </section>
    </>
  )
}

export default employeetimesheet