import React from 'react';
import styles from '../../../../styles/ActivationRequests.module.css';
import { useRouter } from 'next/router';
import ProfileImage from '../../ProfileImage/Image';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import InboxIcon from '@mui/icons-material/Inbox';
import { useViewMode } from '../../../Hooks/useViewMode';

function ActivationRequest({ props, onChange }) {
    const router = useRouter()
    const [viewMode, setViewMode] = useViewMode()

    const formatDate = (date) => date.substring(0, date.indexOf('T'))

    const StatusPill = ({ approved }) => (
        <span className={`${styles.statusPill} ${approved ? styles.statusApproved : styles.statusPending}`}>
            {approved ? 'Approved' : 'Pending'}
        </span>
    )

    return (
        <>
            <div className={styles.headerRow}>
                <div className={styles.titleBlock}>
                    <h1><span className={styles.titleIcon}><HowToRegOutlinedIcon /></span>Activation Requests</h1>
                    <p className={styles.subtitle}>Efficiently handle all account activation requests in one place</p>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <SearchIcon />
                    <input placeholder='Search' type="text" onChange={onChange} />
                </div>
                {props && <span className={styles.countBadge}><strong>{props.length}</strong> request{props.length === 1 ? '' : 's'}</span>}
                <div className={styles.viewToggle}>
                    <button
                        type="button"
                        className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                    >
                        <GridViewRoundedIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                    >
                        <ViewListRoundedIcon />
                    </button>
                </div>
            </div>

            {props && props.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className={styles.cardsGrid}>
                        {props.map((data, index) => (
                            <div className={styles.card} key={data._id || index}>
                                <div className={styles.cardTop}>
                                    <div className={styles.person}>
                                        <ProfileImage size={45} id={data.empId} />
                                        <div>
                                            <h4>{data.empName}</h4>
                                            <h5>{data.designation}</h5>
                                        </div>
                                    </div>
                                    <StatusPill approved={data.approved} />
                                </div>
                                <div className={styles.requestedOn}>Requested on - {formatDate(data.requestedDate)}</div>
                                <div className={styles.cardFooter}>
                                    <button type="button" className={styles.viewBtn} onClick={() => router.push(`/admin/dashboard/hr/activation/${data._id}`)}>
                                        <VisibilityOutlinedIcon />VIEW
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.rowsList}>
                        {props.map((data, index) => (
                            <div className={styles.row} key={data._id || index}>
                                <div className={styles.rowPerson}>
                                    <ProfileImage size={40} id={data.empId} />
                                    <div>
                                        <h4>{data.empName}</h4>
                                        <h5>{data.designation}</h5>
                                    </div>
                                </div>
                                <div className={styles.rowRequestedOn}>Requested on - {formatDate(data.requestedDate)}</div>
                                <div className={styles.rowRight}>
                                    <StatusPill approved={data.approved} />
                                    <button type="button" className={styles.viewBtn} onClick={() => router.push(`/admin/dashboard/hr/activation/${data._id}`)}>
                                        <VisibilityOutlinedIcon />VIEW
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className={styles.emptyState}>
                    <InboxIcon />
                    <h4>No activation requests found</h4>
                    <p>Try adjusting your search</p>
                </div>
            )}
        </>
    )
}

export default ActivationRequest;
