import { useEffect, useState } from 'react'
import Leaves from '../../../../src/Components/Hr/Leaves/Leaves'
import styles from '../../../../styles/Hr.module.css'
import { getAllLeavesByHRController, ApproveLeavesByHRController, getLeaveCountController, updateLeaveController, rejectLeaveController } from "../../../../src/Controllers/Employee"
import Loader from "../../../../src/Helpers/Loader/index"
import NoDataFound from "../../../../src/Components/NoDataFound/NoDataFound"
import { toast } from 'react-toastify'
import { Pagination } from '@mui/material'

const leaves = () => {
  const [leaveData, setleaveData] = useState([])
  const [LoaderState, setLoaderState] = useState(true)
  const [NoOfPages, setNoOfPages] = useState(1)
  const [toggledFilter, setToggledFilter] = useState(false)

  useEffect(() => {
    initialHydration()
  }, [])

  const initialHydration = () => {
    getLeaveCountController({}).then((count) => {
      const pageCount = count.data.response.count / 7
      setNoOfPages(Math.ceil(pageCount))
    })
    getAllLeavesByHRController({ page: 0 })
      .then((response) => {
        setleaveData(response.data.response.data)
      })
      .then(() => setLoaderState(false))
      .catch(() => toast.error("unable to process request"))
  }

  const fetchLeaves = (query) => {
    getAllLeavesByHRController(query)
      .then((response) => {
        setleaveData(response.data.response.data)
      })
      .then(() => setLoaderState(false))
      .catch(() => toast.error("unable to process request"))
  }

  const onPageChange = (event, value) => {
    getAllLeavesByHRController({ page: value }).then((response) => { setleaveData(response.data.response.data); setLoading(false) }).catch((err) => console.log(err))
  }

  const approveLeave = (id) => {
    ApproveLeavesByHRController(id)
      .then(() => toast.success("Leave Approved Successfully"))
      .then(() => initialHydration())
      .catch((err) => toast.error("unable to process request"))
  }

  const rejectLeave = (id, message) => {
    if (!id) return toast("Error")
    rejectLeaveController({ id }, message)
      .then(() => initialHydration())
      .then(() => toast.success("Leave Rejected Successfully"))
      .catch((err) => toast.error("unable to process request"))
  }

  if (LoaderState) return <Loader />

  else
    return (
      <>
        <section className={styles.lv_container} >
          <h1>Leaves</h1>
          <p className='mt_1 grey' >Effortlessly handle all leave requests in one place</p>
          { <Leaves toggledFilter={toggledFilter} setToggledFilter={setToggledFilter} initialHydration={initialHydration} fetchLeaves={fetchLeaves} rejectLeave={rejectLeave} canForward={true} setLoaderState={setLoaderState} approveLeave={approveLeave} data={leaveData} /> }
          {(NoOfPages > 1 && !toggledFilter) && <div className='project_pagination mt_1' > <Pagination count={NoOfPages} className='pagination-center' onChange={onPageChange} /></div>}

        </section>
      </>
    )
}

export default leaves