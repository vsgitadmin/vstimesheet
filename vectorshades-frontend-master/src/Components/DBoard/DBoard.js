import { CurrencyBitcoin, MoreVertOutlined } from '@mui/icons-material'
import styles from '../../../styles/DBoard.module.css'

const DBoard = () => {
  return (
    <>
    <div className={styles.db_container}>
        <h3>Dashboard</h3>
        <div className={styles.db_boxes} >
            <div className={styles.db_box} >
                <div className={styles.top} >
                    <div><CurrencyBitcoin style={{fill:"white"}} /></div>
                    <MoreVertOutlined style={{fill:"white"}} />
                </div>
                <div className={styles.bottom}>
                    <h2>$1200</h2>
                    <h4><span>45%</span> This week</h4>
                </div>
            </div>
            <div className={styles.db_box} >
                <div className={styles.top} >
                    <div><CurrencyBitcoin style={{fill:"white"}} /></div>
                    <MoreVertOutlined style={{fill:"white"}} />
                </div>
                <div className={styles.bottom}>
                    <h2>$532,40</h2>
                    <h4><span>45%</span> This week</h4>
                </div>
            </div>
            <div className={styles.db_box} >
                <div className={styles.top} >
                    <div><CurrencyBitcoin style={{fill:"white"}} /></div>
                    <MoreVertOutlined style={{fill:"white"}} />
                </div>
                <div className={styles.bottom}>
                    <h2>152</h2>
                    <h4><span>45%</span> This week</h4>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default DBoard