import JobActivity from '../../../../src/Components/JobActivity/JobActivity'
import styles from '../../../../src/Components/JobActivity/JobActivity.module.css'

const jobactivity = () => {
  return (
    <>
    <section className={styles.ja_container} >
        <h1>Job Activity</h1>
        <JobActivity/>
    </section>
    </>
  )
}

export default jobactivity