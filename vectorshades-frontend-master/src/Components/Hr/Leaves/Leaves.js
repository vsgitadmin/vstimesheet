import styles from '../../../../styles/Hr.module.css'
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
import LeavesFilter from '../../Filters/LeavesFilter'
import { ParentStore } from '../../../../pages/_app'
import NoDataFound from '../../NoDataFound/NoDataFound'

const Leaves = ({ data, approveLeave, setLoaderState, canForward, rejectLeave, fetchLeaves, initialHydration, toggledFilter, setToggledFilter }) => {

  const { ParentState } = useContext(ParentStore)

  const [AddMemberPopup, setAddMemberPopup] = useState(false)
  const [Employee, setEmployee] = useState([])
  const [ForwardSelectedLeave, setForwardSelectedLeave] = useState(null)
  const [rejectLeavePopup, setRejectLeavePopup] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const searchInput = useRef(null)

  useEffect(() => {
    fetchEmployee()
  }, [])

  useEffect(() => {
    console.log(Employee);
  }, [Employee])



  const fetchEmployee = () => {
    selectEmployeesController().then((data) => {
      setEmployee(data.data.response.employee)
    }).catch((e) => {
      console.log(e);
    })
  }

  const noStyle = {
    height: '76%',
    display: 'flex',
    alignItems: 'center'
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


  return (
    <>
      <div className={styles.lvs_container} >

        {ParentState?.auth.role === "SA" || ParentState?.auth.role === "HR" ?
          <>
            <div className={styles.ar_search_filter} >
              {<input ref={searchInput} onChange={handleSearch} placeholder='Search' type="text" />}
              {!toggledFilter && <div onClick={() => setIsFilterOpen(prev => !prev)} ><Tune style={{ fill: 'white' }} /></div>}
              {toggledFilter && <button className='clear_filter_btn' onClick={() => { setToggledFilter(false); initialHydration() }}>Clear filter</button>}
            </div>

            <div className='flt_main' >
              {isFilterOpen && <LeavesFilter toggledFilter={toggledFilter} setToggledFilter={setToggledFilter} fetchLeaves={fetchLeaves} setIsFilterOpen={setIsFilterOpen} />}
            </div>
          </>
          : null}


        <RejectLeaveReasonPopup open={rejectLeavePopup} setOpen={setRejectLeavePopup} action={(message) => { rejectLeave(selectedId, message); setRejectLeavePopup(false) }} />
        <Modal open={AddMemberPopup} onClose={() => setAddMemberPopup(false)} ><AddMemberPopupComp multiSelect={false} submit={handleForwardSubmit} title="Forward" subTitle="Forward leave request with others. select a user to forward leave request" employee={Employee} /></Modal>
        {data.length !== 0 ? <table className={styles.lvs_table} >
          <tr>
            <th>Employee Name</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Action</th>
            {canForward && <th>Forward</th>}
          </tr>
          {data.map((data) => {
            const startDate = new Date(data.startDate).toDateString()
            const EndDate = new Date(data.endDate).toDateString()
            return (
              <tr>
                <td>
                  <ProfileImage size={45} id={data.employeeId} />
                  <div>
                    {data.name}
                  </div>
                </td>
                <td>{data.type}</td>
                <td>{startDate}</td>
                <td>{EndDate}</td>
                <td>{data.note}</td>
                {
                  data.approved && <td><span className={styles.approved} >Approved</span></td>
                }
                {
                  !data.approved && data.rejected === true &&
                  <td ><span style={{ background: 'red' }} className={styles.approved} >Rejected</span></td>

                }
                {
                  !data.approved && data.rejected === false &&
                  <td>
                    <span className={styles.approve_btn} onClick={() => approveLeave(data._id)}>Approve</span>
                    <span onClick={() => { setRejectLeavePopup(true); setSelectedId(data._id) }} className={styles.reject_btn} >Reject</span>
                  </td>

                }
                {canForward &&
                  <td>
                    {/* <GroupAddIcon onClick={() => setCloudAdminPopup(true)} /> */}
                    {!data.approved && !data.rejected && canForward && <ReplyAllIcon style={{ transform: 'rotateY(180deg)' }} onClick={() => handleForwardClick(data)} />}
                    {data.approved || data.rejected && canForward && <VerifiedIcon />}
                  </td>}
              </tr>
            )
          })}
        </table> :
          <div style={noStyle}><NoDataFound /></div>}
      </div>
    </>
  )
}

export default Leaves