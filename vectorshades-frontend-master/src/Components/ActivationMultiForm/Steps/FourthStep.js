import { Add, Delete, NavigateBefore, NavigateNext } from '@mui/icons-material';
import {motion} from 'framer-motion';
import { useState } from 'react';
import ActivationReview from '../../Popups/Hr/ActivationReview';
import styles from '../ActivationMultiForm.module.css'
import TopBar from '../TopBar';

const FourthStep = ({stepIndex, setStepIndex}) => {

  //for review popup
  const [open, setOpen] = useState(false)
  //for open popup
  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
    <TopBar stepIndex={stepIndex} />
    <motion.div 
     transition={{delay: 0,x: { duration: 0.7 },default: { ease: "linear" }}}
     animate={{ x:[1000,0] }} 
     className={styles.mf_step_container}>
      <div className={styles.mf_accept_review_btn} >
        <button>APPROVE</button>
        <button onClick={handleOpen} >REVIEW</button>
      </div>
     <div className={styles.mf_cp_btn}>
        <button className={styles.mf_continew_btn}  onClick={()=>setStepIndex(stepIndex-1)}  >
          <NavigateBefore style={{fill:"white"}} />
          Previous
        </button>
        <button className={styles.mf_continew_btn} onClick={()=>setStepIndex(stepIndex)}  >
          Complete
          <NavigateNext style={{fill:"white"}} />
        </button>
     </div>
      
  <h2>EMPLOYMENT HISTORY</h2>
  <div className={styles.family_main} >
  <div className={styles.family_input_details_main} >
     <div className={styles.family_input_group} >
       <label>Name and City of Employer</label>
       <input placeholder='Name and City of Employer' type="text" />
     </div>
     <div className={styles.family_input_group} style={{width:"12%"}} >
       <label>From</label>
       <input placeholder='From' type="date" />
     </div>
     <div className={styles.family_input_group} style={{width:"12%"}} >
       <label>To</label>
       <input placeholder='From' type="date" />
     </div>
     <div className={styles.family_input_group} style={{width:"20%"}}  >
       <label>Position Held</label>
       <input placeholder='Position Held' type="text" />
     </div>
     <div className={styles.family_input_group} style={{width:"20%"}}  >
       <label>Annual Salary Package</label>
       <input placeholder='Gross Annual Salary Package' type="text" />
     </div>
       <button className={styles.familly_details_btn} > <Add style={{fill:'white'}} /> ADD</button>
   </div>

   <div className={styles.family_details_container} >
     <table>
     <tr>
      <th>No.</th>
      <th>Name and City of Employer</th>
      <th>From</th>
      <th>To</th>
      <th>Position Held</th>
      <th>Gross Annual Salary Package</th>
      <th></th>
     </tr>
     <tr>
      <td>1</td>
      <td>Sample Employer</td>
      <td>Sep 01 2019</td>
      <td>Jun 02 2022</td>
      <td>Web Developer</td>
      <td>5L</td>
      <td><Delete style={{fill:"grey"}} /></td>
     </tr>
     <tr>
      <td>2</td>
      <td>Sample Employer</td>
      <td>Sep 01 2019</td>
      <td>Jun 02 2022</td>
      <td>Web Developer</td>
      <td>5L</td>
      <td><Delete style={{fill:"grey"}} /></td>
     </tr>
     <tr>
      <td>3</td>
      <td>Sample Employer</td>
      <td>Sep 01 2019</td>
      <td>Jun 02 2022</td>
      <td>Web Developer</td>
      <td>5L</td>
      <td><Delete style={{fill:"grey"}} /></td>
     </tr>
     </table>
   </div>

   <h3 className='mt_4' >Add Documents</h3>

   <div className={styles.documents_input_main}  >
    <div className={styles.document_input_group} >
      <label>Document Name</label>
      <input placeholder='Document Name' type="text" ></input>
    </div>
    <div className={styles.document_input_group} >
      <label>Upload</label>
      <input placeholder='Document Name' type="file" ></input>
    </div>
    <button className={styles.familly_details_btn} > <Add style={{fill:'white'}} /> ADD</button>
   </div>

   <div className={styles.documents_input_main} style={{marginTop:"-10px"}}  >
    <div style={{width:"60%"}} >
    <div className={styles.family_details_container} >
     <table>
     <tr>
      <th>Document Name</th>
      <th>File</th>
      <th></th>
     </tr>
     <tr>
      <td>Plus Two Centificate</td>
      <td className={styles.text_decor} >Added</td>
      <td><Delete style={{fill:"grey"}} /></td>
     </tr>
     <tr>
      <td>Plus Two Centificate</td>
      <td className={styles.text_decor} >Added</td>
      <td><Delete style={{fill:"grey"}} /></td>
     </tr>
     </table>
   </div>
    </div>
   </div>

  </div>
    <ActivationReview open={open} setOpen={setOpen} />
    </motion.div>
    </>
  )
}

export default FourthStep