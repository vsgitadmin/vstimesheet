import { useContext, useState } from 'react'
import { Modal, Rating } from '@mui/material'
import styles from '../../../styles/Employee.module.css'
import style from '../../../styles/Hr.module.css'
import ProfileImage from '../ProfileImage/Image'
import AddMemberPopup from '../Popups/General/AddMemberPopup'
import { Send, Share } from '@mui/icons-material'
import { createEmployeeReviewRequest } from '../../Controllers/Reviews/index'
import { ParentStore } from '../../../pages/_app'
import { toast } from 'react-toastify'

const PerformanceReview = ({ reviews, employeeYearlyAnalytics, emp }) => {
  const { ParentState } = useContext(ParentStore)
  const [activeMenu, setActiveMenu] = useState("files")
  const [openAddmemberPopup, setOpenAddmemberPopup] = useState(false)

  const handleForwardSubmit = (user) => {
    createEmployeeReviewRequest({ requestedBy: emp ? emp : ParentState.auth._id, requestedTo: user, requestedFrom: ParentState.auth._id })
      .then(() => toast("Review Request Created"))
      .then(() => setOpenAddmemberPopup(false))
      .catch((err) => toast.error("unable to process request"))
  }

  return (
    <div>
      <Modal open={openAddmemberPopup} onClose={() => { setOpenAddmemberPopup(false) }}><AddMemberPopup submit={handleForwardSubmit} title={"Share perfomance"} /></Modal>
      <div className={styles.emp_analytics} >

        <div className={styles.per_title} >
          <h2>Performance Review</h2>
          <div>
            {ParentState?.auth?.role !== 'EMP' && <Share onClick={() => setOpenAddmemberPopup(true)} />}
          </div>
        </div>

        <p className='grey' >Empower your growth with valuable insights and feedback in your performance review</p>

        <div className={styles.per_container} >
          <div className={styles.per_broadcast} >
            <div className={styles.per_broadcast_comp} >
              <div>
                <h3> Work Logs</h3>
              </div>
              <div>
                <p>Hours Worked</p>
                <h2>{employeeYearlyAnalytics?.totalHoursWorked} </h2>
              </div>
              <div>
                <p>Hours Assigned</p>
                <h2>{employeeYearlyAnalytics?.totalHoursAssigned}</h2>
              </div>
              <div>
                <p>Leave Stats</p>
                <h2>{employeeYearlyAnalytics?.leaveAnalytics.length === 2 && `${employeeYearlyAnalytics?.leaveAnalytics[0].count} HD - ${employeeYearlyAnalytics?.leaveAnalytics[1].count} FD`}</h2>
              </div>
            </div>

          </div>

          <div className={styles.per_contacts} >
            {employeeYearlyAnalytics && <div className={styles.per_contact_table} >
              <table>
                <thead>
                  <tr>
                    <th>Performance Attributes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Performance</td>
                    <td>
                      <div>
                        <Rating size='medium' name="read-only" value={employeeYearlyAnalytics.performance} readOnly />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Punctuality</td>
                    <td>
                      <div>
                        <Rating size='medium' name="read-only" value={employeeYearlyAnalytics.punctuality} readOnly />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Communication</td>
                    <td>
                      <div>
                        <Rating size='medium' name="read-only" value={employeeYearlyAnalytics.communication} readOnly />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Work Efficiency</td>
                    <td>
                      <div>
                        <Rating size='medium' name="read-only" value={employeeYearlyAnalytics.efficiency} readOnly />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>}
          </div>
        </div>

        <div className={styles.per_latest_broadcast} >
          <h2>Latest Reviews</h2>

          <div className={style.ns_boxes}>
            {
              reviews && reviews.map((reviewData) =>
                <div className={style.ns_box}>
                  <div className={style.ns_box_pro}>
                    <ProfileImage id={reviewData.reviewdByObj._id} />
                    <div>
                      <h5>{reviewData.reviewdByObj.firstName + "  " + reviewData.reviewdByObj.lastName}</h5>
                      <h5>{reviewData.reviewdByObj.designation}</h5>
                    </div>
                  </div>
                  <div className={style.ns_message_box}>
                    <h2>{reviewData.reviewTitle}</h2>
                    <p>{reviewData.reviewText}</p>
                    <Rating size='medium' name="read-only" value={reviewData.starRating} readOnly />
                  </div>
                  <div className={style.ns_date_delete} >
                    <div className={style.ns_date}>
                      <h4>{new Date(reviewData.createdAt).toDateString()}</h4>
                    </div>
                  </div>
                </div>
              )
            }

          </div>

        </div>
      </div>
    </div>
  )
}
export default PerformanceReview