import { Add, Delete, NavigateBefore, NavigateNext } from '@mui/icons-material';
import {motion} from 'framer-motion';
import styles from '../ActivationMultiForm.module.css'
import TopBar from '../TopBar';

const ThirdStep = ({stepIndex, setStepIndex}) => {
  return (
    <>
    <TopBar stepIndex={stepIndex} />
    <motion.div
     transition={{delay: 0,x: { duration: 0.7 },default: { ease: "linear" }}}
     animate={{ x:[1000,0] }} 
     className={styles.mf_step_container}>
     <div className={styles.mf_cp_btn}>
        <button className={styles.mf_continew_btn}  onClick={()=>setStepIndex(stepIndex-1)}  >
          <NavigateBefore style={{fill:"white"}} />
          Previous
        </button>
        <button className={styles.mf_continew_btn} onClick={()=>setStepIndex(stepIndex+1)}  >
          Continue
          <NavigateNext style={{fill:"white"}} />
        </button>
     </div>
    
  <h2>EDUCATION QUALIFICATION</h2>
  <div className={styles.family_main} >
  <div className={styles.family_input_details_main} >
     <div className={styles.family_input_group} >
       <label>Qualification</label>
       <input placeholder='Qualification' type="text" />
     </div>
     <div className={styles.family_input_group} >
       <label>College/ University</label>
       <input placeholder='College/ University' type="text" />
     </div>
     <div className={styles.family_input_group} >
       <label>From</label>
       <input placeholder='From' type="date" />
     </div>
     <div className={styles.family_input_group} >
       <label>To</label>
       <input placeholder='From' type="date" />
     </div>
       <button className={styles.familly_details_btn} > <Add style={{fill:'white'}} /> ADD</button>
   </div>

   <div className={styles.family_details_container} >
     <table>
     <tr>
      <th>No.</th>
      <th>Qualification</th>
      <th>College/ University</th>
      <th>From</th>
      <th>To</th>
      <th></th>
     </tr>
     <tr>
      <td>1</td>
      <td>Plus Two</td>
      <td>ABC School</td>
      <td>Sep 01 2019</td>
      <td>Jun 02 2022</td>
      <td><Delete style={{fill:"grey"}} /></td>
     </tr>
     <tr>
      <td>2</td>
      <td>Plus Two</td>
      <td>ABC School</td>
      <td>Sep 01 2019</td>
      <td>Jun 02 2022</td>
      <td><Delete style={{fill:"grey"}} /></td>
     </tr>
     <tr>
      <td>3</td>
      <td>Plus Two</td>
      <td>ABC School</td>
      <td>Sep 01 2019</td>
      <td>Jun 02 2022</td>
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
    </motion.div>
    </>
  )
}

export default ThirdStep