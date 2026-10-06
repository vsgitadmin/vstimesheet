import styles from '../../../../styles/LeavesPage.module.css'
import ProfileImage from '../../ProfileImage/Image'
import AddMemberPopupComp from '../../Popups/General/AddMemberPopup'
import { useState, useEffect, useContext, useRef } from 'react'
import { forwardReqController } from "../../../Controllers/Hr/index"
import { selectEmployeesController } from "../../../Controllers/Filters/index"
import { Modal } from '@mui/material'
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { toast } from 'react-toastify'
import RejectLeaveReasonPopup from '../../Popups/Hr/RejectLeaveReasonPopup'
import VerifiedIcon from '@mui/icons-material/Verified';
import { Tune } from '@mui/icons-material'
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import SearchIcon from '@mui/icons-material/Search'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import InboxIcon from '@mui/icons-material/Inbox'
import LeavesFilter from '../../Filters/LeavesFilter'
import { useViewMode } from '../../../Hooks/useViewMode'
import { ParentStore } from '../../../../pages/_app'

const Leaves = ({ data, approveLeave, setLoaderState, canForward, rejectLeave, fetchLeaves, initialHydration, toggledFilter, setToggledFilter }) => {

  const { ParentState } = useContext(ParentStore)

  const [AddMemberPopup, setAddMemberPopup] = useState(false)
  const [Employee, setEmployee] = useState([])
  const [ForwardSelectedLeave, setForwardSelectedLeave] = useState(null)
  const [rejectLeavePopup, setRejectLeavePopup] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useViewMode()
  const searchInput = useRef(null)
  const canManage = ParentState?.auth.role === "SA" || ParentState?.auth.role === "HR"

  useEffect(() => {
    fetchEmployee()
  }, [])

  const fetchEmployee = () => {
    selectEmployeesController().then((data) => {
      setEmployee(data.data.response.employee)
    }).catch((e) => {
      console.log(e);
    })
  }

  const handleForwardSubmit = (employ) => {
    setAddMemberPopup(false)
    setLoaderState(true)
    forwardReqController({ user: employ._id, id: ForwardSelectedLeave._id }).then((res) => {
      setLoaderState(false)
      toast("Leave Forwarded Successfully")
    }).catch((err) => {
      setLoaderState(true)
      console.log(err);
    })
  }

  const handleSearch = (e) => {
    if (e.target.value !== '') {
      fetchLeaves({ searchKey: e.target.value }); setToggledFilter(true)
    } else {
      fetchLeaves({ page: 1 })
      setToggledFilter(false)
    }
  }

  const handleForwardClick = (leaveReq) => {
    setAddMemberPopup(true)
    setForwardSelectedLeave(leaveReq)
  }

  useEffect(() => {
    if (!toggledFilter) {
      if (searchInput.current) {
        searchInput.current.value = ''
      }
    }
  }, [toggledFilter])

  const StatusOrActions = ({ data }) => {
    if (data.approved) return <span className={`${styles.statusPill} ${styles.statusApproved}`}>Approved</span>
    if (data.rejected === true) return <span className={`${styles.statusPill} ${styles.statusRejected}`}>Rejected</span>
    if (data.rejected === false) return (
      <div className={styles.actionBtns}>
        <button type="button" className={styles.approveBtn} onClick={() => approveLeave(data._id)}>Approve</button>
        <button type="button" className={styles.rejectBtn} onClick={() => { setRejectLeavePopup(true); setSelectedId(data._id) }}>Reject</button>
      </div>
    )
    return null
  }

  const ForwardIcon = ({ data }) => {
    if (!canForward) return null
    if (!data.approved && !data.rejected) return <button type="button" className={styles.forwardBtn} onClick={() => handleForwardClick(data)} aria-label="Forward"><ReplyAllIcon style={{ transform: 'rotateY(180deg)', fontSize: '18px' }} /></button>
    if (data.approved || data.rejected) return <span className={styles.forwardBtn}><VerifiedIcon style={{ fontSize: '18px' }} /></span>
    return null
  }

  return (
    <>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><ContactPhoneOutlinedIcon /></span>Leaves</h1>
          <p className={styles.subtitle}>Effortlessly handle all leave requests in one place</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        {canManage && <>
          {!toggledFilter ? <>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input ref={searchInput} onChange={handleSearch} placeholder='Search' type="text" />
            </div>
            <div className={styles.filterWrap}>
              <button type="button" className={styles.iconBtn} onClick={() => setIsFilterOpen(prev => !prev)} aria-label="Open filters">
                <Tune />
              </button>
              {isFilterOpen && <LeavesFilter toggledFilter={toggledFilter} setToggledFilter={setToggledFilter} fetchLeaves={fetchLeaves} setIsFilterOpen={setIsFilterOpen} />}
            </div>
          </> : <button type="button" className={styles.clearBtn} onClick={() => { setToggledFilter(false); initialHydration() }}>Clear filter</button>}
        </>}

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

      <RejectLeaveReasonPopup open={rejectLeavePopup} setOpen={setRejectLeavePopup} action={(message) => { rejectLeave(selectedId, message); setRejectLeavePopup(false) }} />
      <Modal open={AddMemberPopup} onClose={() => setAddMemberPopup(false)} ><AddMemberPopupComp multiSelect={false} submit={handleForwardSubmit} title="Forward" subTitle="Forward leave request with others. select a user to forward leave request" employee={Employee} /></Modal>

      {data.length !== 0 ? (
        viewMode === 'grid' ? (
          <div className={styles.cardsGrid}>
            {data.map((leave) => {
              const startDate = new Date(leave.startDate).toDateString()
              const endDate = new Date(leave.endDate).toDateString()
              return (
                <div className={styles.card} key={leave._id}>
                  <div className={styles.cardTop}>
                    <div className={styles.person}>
                      <ProfileImage size={44} id={leave.employeeId} />
                      <div>
                        <h4>{leave.name}</h4>
                        <h5>{leave.type}</h5>
                      </div>
                    </div>
                    <ForwardIcon data={leave} />
                  </div>
                  <div className={styles.dateRange}><strong>{startDate}</strong> &rarr; <strong>{endDate}</strong></div>
                  {leave.note && <div className={styles.reason}>{leave.note}</div>}
                  <div className={styles.cardFooter}>
                    <StatusOrActions data={leave} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Action</th>
                  {canForward && <th>Forward</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((leave) => {
                  const startDate = new Date(leave.startDate).toDateString()
                  const endDate = new Date(leave.endDate).toDateString()
                  return (
                    <tr key={leave._id}>
                      <td>
                        <div className={styles.tablePerson}>
                          <ProfileImage size={34} id={leave.employeeId} />
                          {leave.name}
                        </div>
                      </td>
                      <td>{leave.type}</td>
                      <td>{startDate}</td>
                      <td>{endDate}</td>
                      <td>{leave.note}</td>
                      <td><StatusOrActions data={leave} /></td>
                      {canForward && <td><ForwardIcon data={leave} /></td>}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className={styles.emptyState}>
          <InboxIcon />
          <h4>No leave requests found</h4>
        </div>
      )}
    </>
  )
}

export default Leaves
