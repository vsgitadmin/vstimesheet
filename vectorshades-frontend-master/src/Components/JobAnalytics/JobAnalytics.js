import { AddCircleOutline, DownloadDoneOutlined, DownloadOutlined, TrendingFlatOutlined } from '@mui/icons-material'
import styles from '../../Components/JobActivity/JobActivity.module.css'
import style from '../../../styles/ActiveTasks.module.css'
import ProfileImage from '../ProfileImage/Image'
import CreateChangeOrderPopup from '../Popups/General/CreateChangeOrderPopup'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useState } from 'react'
import { useRouter } from 'next/router'
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { toast } from 'react-toastify'
import { redirect } from 'next/navigation'

const JobAnalytics = ({ perHour, submit, orders, update, deleteOrder, jobLinks, steel, createCOReport }) => {
  const router = useRouter()
  const [createPopup, setcreatePopup] = useState(false)
  const [edit, setedit] = useState(false)
  const [coPath, setcoPath] = useState(null)
  const [defaultData, setdefaultData] = useState({})

  const createCOReportFunction = async () => {
    try {
      if (coPath) {
          window.location.href = coPath
      } else {
        const { data } = await createCOReport()
        setcoPath(data.response.data)
        toast.success('CO Report Generated')
      }
    } catch (err) {
      toast.error('unable to create CO Report')
    }
  }

  return (
    <div className={styles.job_analytics_container} >
      {createPopup && <CreateChangeOrderPopup defaultData={defaultData} update={update} edit={edit} submit={submit} perHour={perHour} onClose={() => setcreatePopup(false)} />}
      <div className={styles.ja_title} >
        <h1>Change Orders</h1>
      </div>
      <div className={styles.ja_top} >
        <button onClick={() => { setedit(false); setdefaultData({}); setcreatePopup(true) }}><AddCircleOutline style={{ fontSize: '17px', marginRight: '5px' }} />Create</button>
        <button style={coPath ? { backgroundColor: '#1e9e52' } : undefined} onClick={() => { createCOReportFunction() }}>{!coPath ? <SummarizeOutlinedIcon style={{ fontSize: '18px' }} /> : <DownloadOutlined style={{ fontSize: '18px' }} />}</button>
      </div>
      <br />
      {/* <div className='job_months'>
              <div className='job_list_main' >
                <div className='job_month_analytics' >
                  <div className='job_analytics_title' style={{width:"25%"}} >
                    <h3>Total Cost</h3>
                    <h2>$200</h2>
                  </div>
                  <div className='job_analytics_title' style={{width:"25%"}} >
                    <h3>Total Bid</h3>
                    <h2>$200</h2>
                  </div>
                  <div className='job_analytics_title' style={{width:"25%"}} >
                    <h3>Total Bid Hour</h3>
                    <h2>$200</h2>
                  </div>
                  <div className='job_analytics_title' style={{width:"25%"}} >
                    <h3>Total Jobs</h3>
                    <h2>$200</h2>
                  </div>
                </div>
              </div>
        </div> */}

      <div className={styles.ja_table_main} >
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Description</th>
              <th>Estimated CO</th>
              <th>Actual CO</th>
              <th>$PH</th>
              <th>Detailer</th>
              <th>Revision</th>
              <th>Billing</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr className={styles.ja_empty_row}><td colSpan={10}>No change orders yet</td></tr>}
            {orders.map((data) => {
              return (
                <tr key={data._id}>
                  <td>
                    {data.name}
                  </td>
                  <td>{data.description}</td>
                  <td>{data.estimatedCOhours}</td>
                  <td>{data.actualCOhours}</td>
                  <td>{data.perHour}</td>
                  <td>{data.detailer.firstName + ' ' + data.detailer.lastName}</td>
                  <td><span className={`${styles.ja_chip} ${data.revisionStatus ? styles.ja_chip_positive : styles.ja_chip_pending}`}>{data.revisionStatus ? 'Completed' : 'Pending'}</span></td>
                  <td><span className={`${styles.ja_chip} ${data.readyToBill ? styles.ja_chip_positive : styles.ja_chip_pending}`}>{data.readyToBill ? 'Billed' : 'Not Billed'}</span></td>
                  <td>
                    <span className={styles.ja_action_icon} onClick={() => {
                      setedit(true)
                      setdefaultData(data)
                      setcreatePopup(true)
                    }}><EditOutlinedIcon style={{ fontSize: "17px" }} /></span>
                  </td>
                  <td>
                    <span className={styles.ja_action_icon} onClick={() => {
                      deleteOrder(data._id)
                    }}><DeleteOutlineOutlinedIcon style={{ fontSize: "17px" }} /></span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {!steel &&
        <div className='mt_3' >
          <h4>Linked Jobs</h4>
        </div>
      }
      <div className={styles.quick_links_main} >
        {jobLinks.map((data) => {
          return <div className={style.quick_link_box} onClick={() => router.push(`/admin/dashboard/rebar/${data._id}`)}>
            <div className={style.sub_card} >JOB</div>
            <div className={style.text_card} >{data.rebarType}</div>
            <div className={style.icon_card} ><div><TrendingFlatOutlined /></div></div>
          </div>
        })}
      </div>

    </div>
  )
}

export default JobAnalytics