import { useRef, useState } from 'react'
import Paging from '../../Pagination/Index';
import styles from './EmpoyeeTimeSheet.module.css'
import style from '../../../../styles/Hr.module.css'
import { Modal, Pagination } from '@mui/material';
import { Tune } from '@mui/icons-material';
import { getEmployeeLeaveController } from '../../../Controllers/Employee';
import LeaveFilterPopup from "../../Filters/LeavesFilter"

const Leave = ({ Details, changePage, leaveCancel }) => {
    const [Leaves, setLeaves] = useState(Details?.data);
    const [Page, setPage] = useState(Details?.current);
    const [noOfPages, setNoOfPages] = useState(Details?.pageCount)
    const [openLeaveFilterPopup, setOpenLeaveFilterPopup] = useState(false)
    const [toggledFilter, setToggledFilter] = useState(false)
    const searchInput = useRef(null)

    // hard code 
    const [approved, setApproved] = useState(true)

    const LeaveMap = Leaves?.map((data) => {
        if (data.canceledByEmployee === true) return
        const startDate = new Date(data.startDate).toDateString()
        const EndDate = new Date(data.endDate).toDateString()
        return (
            <tr>
                <td>{data.type == "Haf Day" ? "Half Day" : "Full Day"}</td>
                <td>{startDate}</td>
                <td>{EndDate}</td>
                <td>{data.note}</td>
                <td>
                    <span className={styles.approved} style={data.approved ? { background: 'green' } : data.rejected ? { background: 'red' } : { background: 'black' }} >{data.approved ? "Approved" : data.rejected ? "Rejected" : "Pending"}</span>
                    <button onClick={() => leaveCancel(data._id)} className={styles.cancel} >Cancel</button>
                </td>
            </tr>
        )
    })

    const handleSearchInputChange = (e) => {
        if (e.target.value != '') {
            setToggledFilter(true)
            getEmployeeLeaveController({ filter: true, search: e.target.value }).then((res) => {
                setLeaves(res.data.response.logs)
            })
        } else {
            handleResetFilter()
        }
    }

    const handleFilter = (filter) => {
        getEmployeeLeaveController({ filter: true, ...filter }).then((res) => {
            setLeaves(res.data.response.logs)
        })
    }

    const handleResetFilter = () => {
        if (searchInput.current) searchInput.current.value = ''
        getEmployeeLeaveController({ page: 1 }).then((res) => {
            setToggledFilter(false)
            setLeaves(res.data.response.logs)
        })
    }

    if (Leaves)

        return (
            <>
                <Modal open={openLeaveFilterPopup} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center', justifyItems: 'center', width: '100%', height: '100vh',top:"100px" }}>
                    <LeaveFilterPopup onChange={() => { }} setToggledFilter={setToggledFilter} toggledFilter={toggledFilter} setIsFilterOpen={setOpenLeaveFilterPopup} fetchLeaves={handleFilter} />
                </Modal>
                <div className={style.ar_search_filter} >
                    <input ref={searchInput} onChange={handleSearchInputChange} placeholder='Search' type="text" />
                    <div onClick={() => setOpenLeaveFilterPopup(true)}><Tune style={{ fill: 'white' }} /></div>
                    {toggledFilter && <button className='clear_filter_btn' onClick={handleResetFilter}>Clear filter</button>}
                </div>

                <div className={styles.lv_container} >
                    <table className={styles.lv_table} >
                        <tr>
                            <th>Leave Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                        {LeaveMap}
                    </table>
                    <div className='project_pagination' >
                        {!toggledFilter && <Pagination count={noOfPages} page={Page} onChange={(e, value) => { setPage(value); changePage(value); }} className="pagination-center" />}                    </div>
                </div>
            </>
        )
}

export default Leave