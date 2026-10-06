import styles from '../../../styles/LmsHrPage.module.css'
import ProfileImage from '../ProfileImage/Image'

const StatusPill = ({ data }) => {
    if (data?.completed) return <span className={`${styles.statusPill} ${styles.statusCompleted}`}>Completed</span>
    return <span className={`${styles.statusPill} ${data?.active ? styles.statusActive : styles.statusInactive}`}>{data?.active ? 'Active' : 'Inactive'}</span>
}

const Avatars = ({ assignedTo }) => (
    <div className={styles.avatarStack}>
        {assignedTo?.slice(0, 4).map((p) => (
            <span key={p}><ProfileImage size={26} id={p} /></span>
        ))}
    </div>
)

const HrCard = ({ data, setselectedTriningData, setLmsPopup, viewMode }) => {

    const openPopup = () => { setselectedTriningData(data); setLmsPopup(true) }

    if (viewMode === 'list') {
        return (
            <div onClick={openPopup} className={styles.row}>
                <Avatars assignedTo={data?.assignedTo} />
                <div className={styles.rowBody}>
                    <h4>{data?.name}</h4>
                    <p>{data?.description}</p>
                </div>
                <div className={styles.rowRight}>
                    <span className={styles.userCount}>{data?.assignedTo?.length || 0} users</span>
                    <StatusPill data={data} />
                </div>
            </div>
        )
    }

    return (
        <div onClick={openPopup} className={styles.card}>
            <div className={styles.cardTitle}>
                <h4>{data?.name}</h4>
                <p>{data?.description?.slice(0, 100)}{data?.description?.length > 100 && '...'}</p>
            </div>
            <div className={styles.cardFooter}>
                <Avatars assignedTo={data?.assignedTo} />
                <span className={styles.userCount}>{data?.assignedTo?.length || 0} users</span>
                <StatusPill data={data} />
            </div>
        </div>
    )
}

export default HrCard
