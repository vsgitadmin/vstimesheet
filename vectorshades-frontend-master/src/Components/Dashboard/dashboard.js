import React, { useEffect, useState,useContext } from 'react';
import styles from '../Dashboard/dashboard.module.css';
import Image from 'next/image';
import Avatar from '../../../public/Images/dashboard_welcome.png';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParentStore } from '../../../pages/_app';

function Dashboard() {
  const { ParentState, setParentState } = useContext(ParentStore);
  const router = useRouter();
  return (
    <>
      <div className={styles.page_content}>
        <div className={styles.section_header}>
          <div className='row'>
            <h1 className='h4_title'>Dashboard</h1>
          </div>
        </div>
        <div className='row my_4'>
          <div className={`${styles.welcome_note} row`}>
            <div className='col_6 p_5'>
              <h3 className='h3_title'>Welcome back {ParentState?.auth?.firstName}!</h3>
              <p className='my_3'>Home for vectorshades management tool<br /> Jobs , Awarded Jobs , Project Dashboard!</p>
            </div>
          </div>
        </div>
        <div className={`${styles.course_list_wrapper} mb_5`}>

          <div className={styles.section_header}>
            <div className='row fx_hv_between_center'>
              <h1 className='h4_title'>Quick Links / Jobs</h1>
              <p className='fx_hv_center h6_title'><span className='fw_600 px_2'>More</span> <TrendingFlatIcon /></p>
            </div>
          </div>
          <div className='row mt_4 quick_link_parent' style={{ gap: '10px' }}>

            <div className="quick_link_main_card" onClick={() => router.push('/admin/dashboard/jobs/')}>
              <div className="sub_card">JOBS</div>
              <div className="text_card"><h4>View All Jobs<br/><span>Jobs Link</span></h4></div>
              <div className="icon_card"><div><TrendingFlatIcon /></div></div>
            </div>
            <div className="quick_link_main_card" onClick={() => router.push('/admin/dashboard/jobs/awarded')}>
              <div className="sub_card">JOBS</div>
              <div className="text_card"><h4>View All Awarded Jobs<br/><span>Jobs Link</span></h4></div>
              <div className="icon_card"><div><TrendingFlatIcon /></div></div>
            </div>
            <div className="quick_link_main_card" onClick={() => router.push('/admin/dashboard/jobs/dashboard')}>
              <div className="sub_card">JOBS</div>
              <div className="text_card"><h4>View Project Dashboard<br/><span>Jobs Link</span></h4></div>
              <div className="icon_card"><div><TrendingFlatIcon /></div></div>
            </div>
          </div>
        </div>

        
        <div className={`${styles.course_list_wrapper} mb_5`}>
          <div className={styles.section_header}>
            <div className='row fx_hv_between_center'>
              <h1 className='h4_title'>Quick Links / HR</h1>
              <p className='fx_hv_center h6_title'><span className='fw_600 px_2'>More</span> <TrendingFlatIcon /></p>
            </div>
          </div>
          <div className='row mt_4 quick_link_parent' style={{ gap: '10px' }}>

            <div className="quick_link_main_card" onClick={() => router.push('/admin/dashboard/hr/')}>
              <div className="sub_card">HR</div>
              <div className="text_card"><h4>View All Activation Request<br/><span>Request Link</span></h4></div>
              <div className="icon_card"><div><TrendingFlatIcon /></div></div>
            </div>

            <div className="quick_link_main_card" onClick={() => router.push(`/admin/dashboard/hr/employees/`)}>
              <div className="sub_card">EMP</div>
              <div className="text_card"><h4>View Employee List<br/><span>Employee Link</span></h4></div>
              <div className="icon_card"><div><TrendingFlatIcon /></div></div>
            </div>

            <div className="quick_link_main_card" onClick={() => router.push(`/admin/dashboard/hr/leaves/`)}>
              <div className="sub_card">EMP</div>
              <div className="text_card"><h4>Leaves<br/><span>Employee Link</span></h4></div>
              <div className="icon_card"><div><TrendingFlatIcon /></div></div>
            </div>
         
          </div>
        </div>


      </div>
    </>


  )

}
export default Dashboard;