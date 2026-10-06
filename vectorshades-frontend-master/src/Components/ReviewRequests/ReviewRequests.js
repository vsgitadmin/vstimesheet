import styles from '../../../styles/ReviewRequests.module.css';
import ProfileImage from '../ProfileImage/Image';
import { getEmployeeReviewRequest } from "../../Controllers/Reviews/index"
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import InboxIcon from '@mui/icons-material/Inbox';
import { useViewMode } from '../../Hooks/useViewMode';

const ReviewRequests = () => {
  const router = useRouter()
  const [requestsData, setRequestsData] = useState([])
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useViewMode()

  useEffect(() => {
    fetchReviewRequestData()
  }, [])

  const fetchReviewRequestData = () => {
    getEmployeeReviewRequest()
      .then(res => setRequestsData(res.data.response.data))
      .catch(err => console.log(err))
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return requestsData
    return requestsData.filter((data) =>
      (data.requestedByName || '').toLowerCase().includes(term) ||
      (data.domain || '').toLowerCase().includes(term)
    )
  }, [requestsData, search])

  const ActionButton = ({ data }) => {
    if (!data.expired && !data.reviewSubmitted) {
      return (
        <button type="button" className={styles.viewBtn} onClick={() => router.push(`/admin/dashboard/perfomance-review-form/${data._id}`)}>
          <VisibilityOutlinedIcon />VIEW
        </button>
      )
    }
    if (data.expired && data.reviewSubmitted) {
      return <button type="button" disabled className={`${styles.viewBtn} ${styles.viewBtnSubmitted}`}><VisibilityOutlinedIcon />Submitted</button>
    }
    if (data.expired) {
      return <button type="button" disabled className={`${styles.viewBtn} ${styles.viewBtnExpired}`}><VisibilityOutlinedIcon />Expired</button>
    }
    return null
  }

  return (
    <section className={styles.page} >
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><BeenhereOutlinedIcon /></span>Review Requests</h1>
          <p className={styles.subtitle}>All review requests for you, stay informed and organized with ease</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input placeholder='Search by name or domain...' type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <span className={styles.countBadge}><strong>{filtered.length}</strong> request{filtered.length === 1 ? '' : 's'}</span>
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

      {filtered.length > 0 ? (
        viewMode === 'grid' ? (
          <div className={styles.cardsGrid}>
            {filtered.map((data) => (
              <div className={styles.card} key={data._id}>
                <div className={styles.cardTop}>
                  <div className={styles.person}>
                    <ProfileImage id={data.requestedBy} size={45} />
                    <div>
                      <h4>{data.requestedByName}</h4>
                      <h5>{data.domain}</h5>
                    </div>
                  </div>
                  {data.approved && <span className={`${styles.statusPill} ${styles.statusApproved}`}>Approved</span>}
                </div>
                <div className={styles.meta}>
                  Requested on - {new Date(data.createdAt).toDateString()}<br />
                  Requested from - {data.requestedFromName}
                </div>
                <div className={styles.cardFooter}>
                  <ActionButton data={data} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.rowsList}>
            {filtered.map((data) => (
              <div className={styles.row} key={data._id}>
                <div className={styles.rowPerson}>
                  <ProfileImage id={data.requestedBy} size={40} />
                  <div>
                    <h4>{data.requestedByName}</h4>
                    <h5>{data.domain}</h5>
                  </div>
                </div>
                <div className={styles.rowMeta}>
                  Requested on - {new Date(data.createdAt).toDateString()} - Requested from - {data.requestedFromName}
                </div>
                <div className={styles.rowRight}>
                  {data.approved && <span className={`${styles.statusPill} ${styles.statusApproved}`}>Approved</span>}
                  <ActionButton data={data} />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={styles.emptyState}>
          <InboxIcon />
          <h4>No review requests found</h4>
          <p>Try adjusting your search</p>
        </div>
      )}
    </section>
  )
}

export default ReviewRequests
