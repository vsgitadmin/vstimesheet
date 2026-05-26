import { Modal } from '@mui/material';
import styles from './Popup.module.css'

const BulletPoints = ({openBulletPoints, setBulletPoints}) => {

  return (
    <>
      <Modal open={openBulletPoints} onClose={() => setBulletPoints(false)} >
        <div className={styles.daily_logs_container} >
          <div className={styles.daily_logs_title} >
            <h3>Bullet Points</h3>
          </div>
          <div className={styles.main_total_changes} >

            <div className={styles.main_total_progress} >
                <div className={styles.main_progress_commit}>
                    <div className={styles.main_progress_bar}>
                      <div className={styles.main_progress_circle}></div>
                   </div>
                </div>
                <div className={styles.main_progress_box} >Hello World</div>
            </div>
            <div className={styles.main_total_progress} >
                <div className={styles.main_progress_commit}>
                    <div className={styles.main_progress_bar}>
                      <div className={styles.main_progress_circle}></div>
                   </div>
                </div>
                <div className={styles.main_progress_box} >Hello World</div>
            </div>

          </div>
        </div>
      </Modal>
    </>
  )
}

export default BulletPoints