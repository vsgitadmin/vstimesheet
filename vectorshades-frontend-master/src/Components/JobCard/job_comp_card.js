import Link from 'next/link'
import styles from './index.module.css'
import VerifiedIcon from '@mui/icons-material/Verified';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { general } from '../../Helpers/index'
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const JobCard = ({ props }) => {
    const { DateToMonthYear } = general
    return (
        <div className={styles.card}>
            <Link className={styles.card_child} href={`/admin/dashboard/jobs/${props._id}`}>
                <div className={styles.h3_container}>
                    <h3 className={styles.h3_container_text}>{props.project.length > 20
                        ? `${props.project.substring(0, 20)}...`
                        : props.project}</h3>
                    <MoreVertIcon />
                </div>
                <div className={styles.flex_details_container}>
                    <h5 className={styles.flex_details_container_text}><span>Client :  </span>{props.client}</h5>
                    <h5 className={styles.flex_details_container_text}><span>Date :  </span>{DateToMonthYear(props.date)}</h5>
                    <h5 className={styles.flex_details_container_text}><span>Last Updated :  </span>{DateToMonthYear(props.lastUpdated)}</h5>
                </div>
                <div className={styles.card_keywords_container}>
                    {props.sub_items.slice(0, 3).filter(({ point }) => point !== 'Total').map((subitems, index) => {
                        return (
                            <div key={index} className={styles.card_keyword_box}><h6 className={styles.card_keyword}>{subitems.point}</h6></div>
                        )
                    })}
                </div>

                {props.awarded &&
                    <div className={styles.approved_job_container}>
                        <h2 className={styles.approved_job_container_text}>Awarded</h2>
                        <VerifiedIcon />
                    </div>
                }
                {props.pending &&
                    <div className={styles.approved_job_container}>
                        <h2 className={styles.approved_job_container_text}>Pending Estimate - {DateToMonthYear(props.estimate)}</h2>
                        <PendingActionsIcon />
                    </div>
                }

            </Link>
        </div>
    );
}

export default JobCard;