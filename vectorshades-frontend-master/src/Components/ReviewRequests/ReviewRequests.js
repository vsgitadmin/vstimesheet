import { Visibility } from '@mui/icons-material';
import styles from '../../../styles/Hr.module.css';
import ProfileImage from '../ProfileImage/Image';
import { getEmployeeReviewRequest } from "../../Controllers/Reviews/index"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ReviewRequests = () => {
  const router = useRouter()
  const [requestsData, setRequestsData] = useState([])

  useEffect(() => {
    fetchReviewRequestData()
  }, [])


  const fetchReviewRequestData = () => {
    getEmployeeReviewRequest()
      .then(res => setRequestsData(res.data.response.data))
      .catch(err => console.log(err))
  }


  return (
    <section className={styles.ar_container} >
      <h1>Review Requests</h1>
      <p className='mt_1 grey' >All review requests for you, stay informed and organized with ease</p>

      <div className={styles.ar_search_filter} >
        <input placeholder='Search' type="text" />
      </div>
      <div className={styles.ar_list_container}>
      {requestsData.map((data) => {
        return <div className={styles.ar_list_box}  key={data._id} >
            <div className={styles.ar_profile}>
              <ProfileImage id={data.requestedBy} size={45} />
            </div>
            <div className={styles.ar_user_name_des}>
              <h3 style={{ fontSize: '15px' }}>{data.requestedByName}</h3>
              <h4>{data.domain}</h4>
              <h5>Requested on - {new Date(data.createdAt).toDateString()} - Requested From - {data.requestedFromName}</h5>
            </div>

            {data.approved && <div className={`${styles.ar_request_status} ${styles.status_pending}`}>
              <div>approved</div>
            </div>}

            <div className={styles.view_btn}>
              {!data.reviewSubmitted && !data.expired && <button onClick={() => router.push(`/admin/dashboard/perfomance-review-form/${data._id}`)}><Visibility style={{ fontSize: "15px", fill: "white" }} />VIEW</button>}
              {data.expired && data.reviewSubmitted && <button ><Visibility style={{ fontSize: "15px", fill: "white" }} />Submitted</button>}
              {data.expired && <button ><Visibility style={{ fontSize: "15px", fill: "white" }} />Expired</button>}
            </div>
          </div>
      })}
      </div>
    </section>
  )
}

export default ReviewRequests