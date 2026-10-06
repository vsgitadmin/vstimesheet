import { useMemo, useState } from 'react'
import ProfileImage from '../ProfileImage/Image'
import styles from '../../../styles/SalesPerformance.module.css'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'
import SearchIcon from '@mui/icons-material/Search'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import InboxIcon from '@mui/icons-material/Inbox'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import { useViewMode } from '../../Hooks/useViewMode'

const SalesPerformance = ({ perfomance, createReport }) => {
    const [search, setSearch] = useState('')
    const [viewMode, setViewMode] = useViewMode()

    const filtered = useMemo(() => {
        if (!perfomance) return null
        const term = search.trim().toLowerCase()
        if (!term) return perfomance
        return perfomance.filter((obj) => {
            const name = `${obj.employeeDetails?.firstName || ''} ${obj.employeeDetails?.lastName || ''}`.toLowerCase()
            const email = (obj.employeeDetails?.email || '').toLowerCase()
            return name.includes(term) || email.includes(term)
        })
    }, [perfomance, search])

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <div className={styles.titleBlock}>
                    <h1><span className={styles.titleIcon}><BadgeOutlinedIcon /></span>Job Admins</h1>
                    <p className={styles.subtitle}>Track job Admins for effective management and growth.</p>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <SearchIcon />
                    <input placeholder='Search by name or email...' type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                {filtered && <span className={styles.countBadge}><strong>{filtered.length}</strong> admin{filtered.length === 1 ? '' : 's'}</span>}
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
                {createReport && <button type="button" className={styles.exportBtn} onClick={() => createReport()}>
                    <CloudDownloadOutlinedIcon />Export Report
                </button>}
            </div>

            {filtered === null ? (
                <div className='loader_center_parent'>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            ) : filtered.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className={styles.cardsGrid}>
                        {filtered.map((obj) => (
                            <div className={styles.card} key={obj.employeeId}>
                                <div className={styles.person}>
                                    <ProfileImage id={obj.employeeId} size={44} />
                                    <div>
                                        <h4>{obj.employeeDetails?.firstName} {obj.employeeDetails?.lastName}</h4>
                                        <h5>{obj.employeeDetails?.email}</h5>
                                    </div>
                                </div>

                                <div className={styles.statsRow}>
                                    <div className={styles.statTile}>
                                        <WorkOutlineIcon />
                                        <h2>{obj.jobCount}</h2>
                                        <h5>Jobs</h5>
                                    </div>
                                    <div className={`${styles.statTile} ${styles.statTileGood}`}>
                                        <CheckCircleOutlineIcon />
                                        <h2>{obj.completedProjectCount}</h2>
                                        <h5>Completed</h5>
                                    </div>
                                    <div className={`${styles.statTile} ${styles.statTileBad}`}>
                                        <HourglassBottomIcon />
                                        <h2>{obj.notCompletedProjectCount}</h2>
                                        <h5>Pending</h5>
                                    </div>
                                </div>

                                <div className={styles.costRow}>
                                    <h5>Total Cost</h5>
                                    <h4>${obj.totalCost}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.rowsList}>
                        {filtered.map((obj) => (
                            <div className={styles.row} key={obj.employeeId}>
                                <div className={styles.rowPerson}>
                                    <ProfileImage id={obj.employeeId} size={38} />
                                    <div>
                                        <h4>{obj.employeeDetails?.firstName} {obj.employeeDetails?.lastName}</h4>
                                        <h5>{obj.employeeDetails?.email}</h5>
                                    </div>
                                </div>

                                <div className={styles.rowStats}>
                                    <div className={styles.rowStat}>
                                        <WorkOutlineIcon />
                                        <span>{obj.jobCount} Jobs</span>
                                    </div>
                                    <div className={`${styles.rowStat} ${styles.rowStatGood}`}>
                                        <CheckCircleOutlineIcon />
                                        <span>{obj.completedProjectCount} Completed</span>
                                    </div>
                                    <div className={`${styles.rowStat} ${styles.rowStatBad}`}>
                                        <HourglassBottomIcon />
                                        <span>{obj.notCompletedProjectCount} Pending</span>
                                    </div>
                                </div>

                                <div className={styles.rowCost}>
                                    <h5>Total Cost</h5>
                                    <h4>${obj.totalCost}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className={styles.emptyState}>
                    <InboxIcon />
                    <h4>No job admins found</h4>
                    <p>Try adjusting your search</p>
                </div>
            )}
        </div>
    )
}

export default SalesPerformance
