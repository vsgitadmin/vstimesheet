import { useState, useContext } from 'react'
import ProfileImage from '../ProfileImage/Image'
import styles from '../../../styles/NoticesPage.module.css'
import CreateNoticePopupComponent from '../Popups/General/CreateNoticePopup'
import { ParentStore } from '../../../pages/_app'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import InboxIcon from '@mui/icons-material/Inbox'
import { useViewMode } from '../../Hooks/useViewMode'

const NoticesComponent = ({ data, createNotice, deleteNotice, type, empView }) => {
  const { ParentState } = useContext(ParentStore)
  const [createNoticePopup, setcreateNoticePopup] = useState(false);
  const [viewMode, setViewMode] = useViewMode();
  const canCreate = ParentState && ParentState?.auth.role !== "EMP" && !empView

  const subtitle = ParentState?.auth.role === "EMP"
    ? 'Stay informed with important updates & announcements'
    : 'Create notices for employees using the create button, keep everyone informed and engaged.'

  return (
    <>
      {createNoticePopup && <CreateNoticePopupComponent submit={createNotice} createNoticePopup={createNoticePopup} setcreateNoticePopup={setcreateNoticePopup} />}
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <h1><span className={styles.titleIcon}><CampaignOutlinedIcon /></span>Notices</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {canCreate && <button type="button" className={styles.addBtn} onClick={() => setcreateNoticePopup(true)}><AddCircleOutlineIcon />CREATE</button>}
        </div>

        <div className={styles.toolbar}>
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

        {data.length > 0 ? (
          viewMode === 'grid' ? (
            <div className={styles.cardsGrid}>
              {data.map(({ createdByObj, empId, body, createdAt, title, empName, _id }) => (
                <div className={styles.card} key={_id}>
                  <div className={styles.person}>
                    <ProfileImage id={type === "HR" && !empView ? empId : createdByObj.id} size={40} />
                    <div>
                      <h5>{type === "HR" && !empView ? empName : createdByObj.name}</h5>
                      <h5>{type === "HR" && !empView ? 'Employee' : 'Human Resources'}</h5>
                    </div>
                  </div>
                  <div className={styles.messageBox}>
                    <h2>{title}</h2>
                    <p>{body}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.dateLabel}>{new Date(createdAt).toDateString()}</span>
                    {type === "HR" && !empView && <button type="button" className={styles.deleteBtn} onClick={() => deleteNotice(_id)}><DeleteOutlineOutlinedIcon />Delete</button>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.rowsList}>
              {data.map(({ createdByObj, empId, body, createdAt, title, empName, _id }) => (
                <div className={styles.row} key={_id}>
                  <ProfileImage id={type === "HR" && !empView ? empId : createdByObj.id} size={40} />
                  <div className={styles.rowBody}>
                    <h2>{title}</h2>
                    <p>{body}</p>
                  </div>
                  <div className={styles.rowRight}>
                    <span className={styles.dateLabel}>{new Date(createdAt).toDateString()}</span>
                    {type === "HR" && !empView && <button type="button" className={styles.deleteBtn} onClick={() => deleteNotice(_id)}><DeleteOutlineOutlinedIcon />Delete</button>}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className={styles.emptyState}>
            <InboxIcon />
            <h4>No notices yet</h4>
          </div>
        )}
      </div>
    </>
  )
}

export default NoticesComponent
