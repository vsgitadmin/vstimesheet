import Link from 'next/link'
import styles from '../../JobCard/index.module.css'
import VerifiedIcon from '@mui/icons-material/Verified';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const RebarCard = ({jobData}) => {

    const props = {
        awarded: true,
        pending: false
    }

    return (
        <div className={styles.card}>
            <Link className={styles.card_child} href={`/admin/dashboard/jobs/rebar/${jobData.jobId}`}>
                <div className={styles.h3_container}>
                    <h3 className={styles.h3_container_text}>{jobData.jobDetails?.project}</h3>
                    <MoreVertIcon/>
                </div>
                <div className={styles.flex_details_container}>
                    <h5 className={styles.flex_details_container_text}><span>Client :  </span>{jobData.jobDetails?.client}</h5>
                    <h5 className={styles.flex_details_container_text}><span>Date :  </span>{new Date(jobData.jobDetails?.date).toDateString().split(' ').slice(1).join(' ')}</h5>
                    <h5 className={styles.flex_details_container_text}><span>Last Updated :  </span>{new Date(jobData.jobDetails?.lastUpdated).toDateString().split(' ').slice(1).join(' ')}</h5>
                </div>
                <div className={styles.card_keywords_container}>
                    {jobData.jobDetails?.sub_items.map((key) =>
                        <div className={styles.card_keyword_box}>
                            <h6 className={styles.card_keyword}>{key.point}</h6>
                        </div>
                    )}
                </div>
                <div className={styles.approved_job_container}>
                    <h1 className={styles.approved_job_container_text}>{jobData.rebarType}</h1>
                    <VerifiedIcon/>
                </div>
            </Link>
        </div>
    );
}

export default RebarCard;