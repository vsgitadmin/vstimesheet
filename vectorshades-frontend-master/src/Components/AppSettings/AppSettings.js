import { AccountCircleOutlined, ApiOutlined, AutoAwesomeOutlined, CreditCardOutlined, ImageAspectRatioOutlined, OutlinedFlag, PeopleAltOutlined, WebAssetOutlined } from '@mui/icons-material'
import styles from '../../../styles/ActiveTasks.module.css'

const AppSettings = () => {
  return (
    <>
    <div className={styles.project_settings} style={{height:"90vh"}} >
        <div className={styles.pro_left} style={{width:"20%"}} >
            <div className={styles.settings_item}>
                <OutlinedFlag/>
                <h3>My Details</h3>
            </div>
            <div className={styles.settings_item}>
                <AccountCircleOutlined/>
                <h3>Profile</h3>
            </div>
            <div className={styles.settings_item}>
                <ImageAspectRatioOutlined/>
                <h3>Password</h3>
            </div>
            <div className={styles.settings_item}>
                <AutoAwesomeOutlined/>
                <h3>Appearance</h3>
            </div>
            <div className={styles.settings_item}>
                <PeopleAltOutlined/>
                <h3>Team</h3>
            </div>
            <div className={styles.settings_item}>
                <CreditCardOutlined/>
                <h3>Billing</h3>
            </div>
            <div className={styles.settings_item}>
                <WebAssetOutlined/>
                <h3>Application</h3>
            </div>
            <div className={styles.settings_item}>
                <ApiOutlined/>
                <h3>API</h3>
            </div>
        </div>
        <div className={styles.pro_right} style={{  padding: "20px"}} >
            <h2>Settings</h2>
        </div>
    </div>
    </>
  )
}

export default AppSettings