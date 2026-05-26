import { Add, Delete, NavigateBefore, NavigateNext } from '@mui/icons-material';
import {motion} from 'framer-motion';
import styles from '../ActivationMultiForm.module.css'
import TopBar from '../TopBar';

const SecondStep = ({stepIndex, setStepIndex}) => {

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
    
    <h2>FAMILY DETAILS</h2>
  
   <div className={styles.family_main} >
   <div className={styles.family_input_details_main} >
      <div className={styles.family_input_group} >
        <label>Full Name</label>
        <input placeholder='Full Name' type="text" />
      </div>
      <div className={styles.family_input_group} >
        <label>Relationship</label>
        <select>
         <option value="Father">Father</option>
         <option value="Mother">Mother</option>
         <option value="Brother">Brother</option>
         <option value="Sister">Sister</option>
         <option value="Son">Son</option>
         <option value="Daughter">Daughter</option>
        </select>
      </div>
      <div className={styles.family_input_group} >
        <label>Date of Birth</label>
        <input placeholder='Date of Birth' type="date" />
      </div>
      <div className={styles.family_input_group} >
        <label>Passport Number</label>
        <input placeholder='Passport Number' type="text" />
      </div>
        <button className={styles.familly_details_btn} > <Add style={{fill:'white'}} /> ADD</button>
    </div>

    <div className={styles.family_details_container} >
      <table>
      <tr>
       <th>No.</th>
       <th>Full Name</th>
       <th>Relationship</th>
       <th>Date of Birth</th>
       <th>Passport Number</th>
       <th></th>
      </tr>
      <tr>
       <td>1</td>
       <td>Sample Name</td>
       <td>Brother</td>
       <td>12-02-1990</td>
       <td>000001</td>
       <td><Delete style={{fill:"grey"}} /></td>
      </tr>
      <tr>
       <td>1</td>
       <td>Sample Name</td>
       <td>Brother</td>
       <td>12-02-1990</td>
       <td>000001</td>
       <td><Delete style={{fill:"grey"}} /></td>
      </tr>
      <tr>
       <td>1</td>
       <td>Sample Name</td>
       <td>Brother</td>
       <td>12-02-1990</td>
       <td>000001</td>
       <td><Delete style={{fill:"grey"}} /></td>
      </tr>
      <tr>
       <td>1</td>
       <td>Sample Name</td>
       <td>Brother</td>
       <td>12-02-1990</td>
       <td>000001</td>
      </tr>
      </table>
    </div>
   </div>
    

    </motion.div>
    </>
  )
}

export default SecondStep