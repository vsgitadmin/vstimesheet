import Link from 'next/link'
import styles from './list.module.css'
import VerifiedIcon from '@mui/icons-material/Verified';
import { general } from '../../Helpers/index'
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const RebarListRow = ({ props }) => {
    const { DateToMonthYear } = general
    return (
        <Link className={styles.row} href={`/admin/dashboard/rebar/${props._id}`}>
            <div className={styles.rowMain}>
                <h3 className={styles.rowTitle}>{props.project}</h3>
                <div className={styles.rowMeta}>
                    <span><span className={styles.metaLabel}>Client :</span> {props.client}</span>
                    <span><span className={styles.metaLabel}>Date :</span> {DateToMonthYear(props.date)}</span>
                    <span><span className={styles.metaLabel}>Last Updated :</span> {DateToMonthYear(props.lastUpdated)}</span>
                </div>
            </div>

            <div className={styles.rowStatus}>
                {props.awarded &&
                    <div className={styles.statusBadge}>
                        <VerifiedIcon />
                        <span>Awarded</span>
                    </div>
                }
                {props.pending &&
                    <div className={styles.statusBadge}>
                        <PendingActionsIcon />
                        <span>Pending Estimate - {DateToMonthYear(props.estimate)}</span>
                    </div>
                }
            </div>
        </Link>
    );
}

export default RebarListRow;
