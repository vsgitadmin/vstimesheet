import { Rating } from '@mui/material';
import SelectUserInput from '../../SelectUserInput';
import styles from './Popup.module.css'
import { useState } from 'react';

const ReviewCardPopup = ({reviewEmployee}) => {
  const [body] = useState({  ratingObj: {}  })

  const handleSubmit = () =>{
    const calculateAverageRating = (ratingObj) => Object.values(ratingObj).reduce((acc, rating) => acc + parseInt(rating), 0) / Object.values(ratingObj).length;
    body.starRating = calculateAverageRating(body.ratingObj)
    const newPayload = {...body,...body.ratingObj}
    reviewEmployee(newPayload)
  }

  return (
    <>
        <div className={`${styles.review_card_popup} ${styles.create_notice_popup}`} >
          <div className={styles.cn_title} >
            <h2>Performance Review Form</h2>
          </div>
          <form>
            <div className={styles.cn_form_group}>
              <label>Title</label>
              <input type="text" placeholder='Enter Title' onChange={(e) => body.reviewTitle = e.target.value} />
            </div>
            {/* add user dropdown start */}

            {/* <SelectUserInput noitce={true} /> */}
            {/* add user dropdown end */}
            <div className={styles.cn_form_group}>
              <label>Message</label>
              <textarea onChange={(e)=>body.reviewText = e.target.value} placeholder='Enter Notice Message' ></textarea>
            </div>

          <div className={styles.cn_form_rating} >
            <label>punctuality</label>
            <Rating onChange={(e)=>body.ratingObj.punctuality=parseInt(e.target.value)}  size='large' name="simple-controlled"  />
          </div>

          <div className={styles.cn_form_rating} >
            <label>efficiency</label>
            <Rating onChange={(e,value)=>body.ratingObj.efficiency =parseInt(e.target.value)}  size='large' name="simple-controlled"  />
          </div>

          <div className={styles.cn_form_rating} >
            <label>communication</label>
            <Rating onChange={(e,value)=>body.ratingObj.communication =parseInt(e.target.value)}  size='large' name="simple-controlled"  />
          </div>
         
          <div className={styles.cn_form_rating} >
            <label>performance</label>
            <Rating onChange={(e,value)=>body.ratingObj.performance =parseInt(e.target.value)}  size='large' name="simple-controlled"  />
          </div>

         
          <div className={styles.cn_form_rating} >
            <label>skills</label>
            <Rating onChange={(e,value)=>body.ratingObj.skills =parseInt(e.target.value)}  size='large' name="simple-controlled"  />
          </div>

            <div className={styles.cn_form_group}>
              <button onClick={handleSubmit} type='button' >SUBMIT REVIEW</button>
            </div>
          </form>
        </div>
    </>
  )
}

export default ReviewCardPopup