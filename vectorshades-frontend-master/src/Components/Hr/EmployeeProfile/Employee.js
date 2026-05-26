import React, { useEffect, useState } from 'react';
import { ActivationReqController } from '../../../Controllers/Hr/index';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import styles from './employee.module.css';
import { style } from '@mui/system';
import Image from 'next/image';
import Avatar from '../../../../public/Images/profile_user.jpg';

function Employee() {
  const [body] = useState({})
  const router = useRouter();



  return (
    <section className={`${styles.p_4} ${styles.section}`}>
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={`${styles.col_3} ${styles.profile}`}>
            <div className={styles.p_4}>
              <h3 className={`${styles.h5_title} ${styles.form_title}  ${styles.text_center}`}>Your Profile</h3>

              <div className={`${styles.profile_photo}`}>
                <Image src={Avatar} alt="image" width="100" height="100" />
              </div>
              <div className={`${styles.profile_detail} ${styles.text_center}`}>
                <h5 className={styles.h4_title}>Pb47 Zira</h5>
                <p>Designer</p>
              </div>
              <div className={`${styles.profile_social} ${styles.py_5}`}>
                <div className={`${styles.row} ${styles.hv_evenly_center}`} >
                  <div className={`${styles.text_center} ${styles.profile_social_item}`}>
                    <h3 className={styles.h3_title}>85</h3>
                    <p>Posts</p>
                  </div>
                  <div className={`${styles.text_center} ${styles.profile_social_item}`}>
                    <h3 className={styles.h3_title}>1.1k</h3>
                    <p>messages</p>
                  </div>
                  <div className={`${styles.text_center} ${styles.profile_social_item}`}>
                    <h3 className={styles.h3_title}>4.5k</h3>
                    <p>members</p>
                  </div>
                </div>

              </div>
              <div className={styles.text_center}>
                <button className={`${styles.btn_theme} ${styles.btn}`}>Upload Avatar</button>
              </div>
              <div className={styles.text_center}>
                <button className={`${styles.btn_secondary} ${styles.btn}`}>Delete</button>
              </div>
            </div>
          </div>

          {/* <div className={styles.col_9}>
            <div className={styles.row}>
              <div className={`${styles.col_6} `}>
                <h4 className={`${styles.h5_title} ${styles.form_title} ${styles.p_4}`}>Edit Your Personal Settings</h4>

                <div className={`${styles.form_group} ${styles.p_4}`}>

                  <div className={`${styles.textbox_group} ${styles.row}`}>
                    <label className={`${styles.form_label} ${styles.col_3}`}>Full Name</label>
                    <input required type="text" placeholder='empId' onChange={(e) => body.empId = e.target.value} className={`${styles.textbox} ${styles.col_9}`} />
                  </div>
                  <div className={`${styles.textbox_group} ${styles.row}`}>
                    <label className={`${styles.form_label} ${styles.col_3}`}>Title</label>
                    <input required type="text" placeholder='Title' onChange={(e) => body.title = e.target.value} className={`${styles.textbox} ${styles.col_9}`} />
                  </div>
                  <div className={`${styles.textbox_group} ${styles.row}`}>
                    <label className={`${styles.form_label} ${styles.col_3}`}>Email</label>
                    <input required type="text" placeholder='Email' onChange={(e) => body.email = e.target.value} className={`${styles.textbox} ${styles.col_9}`} />
                  </div>

                </div>
                <div className={styles.btn_wrapper}>
                  <button className={`${styles.btn_theme} ${styles.btn}`}>Create Request</button>
                </div>
              </div>
              <div className={styles.col_6}>
                FOrm 2
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
export default Employee;