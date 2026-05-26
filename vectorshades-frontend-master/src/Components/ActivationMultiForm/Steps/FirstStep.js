import { useState } from 'react';
import { NavigateNext } from '@mui/icons-material';
import {motion} from 'framer-motion';
import styles from '../ActivationMultiForm.module.css'
import TopBar from '../TopBar';

const FirstStep = ({stepIndex, setStepIndex}) => {
  const [Step1Data, setStep1Data] = useState({})
  const [Gender, setGender] = useState('')
  const [Marital, setMarital] = useState('')
  const [dualnationality, setdualnationality] = useState('')

  const dualNationalityFunction = (value) => {
    Step1Data['dual_nationality'] = value
    setdualnationality(value)
  }

  const genderCheckFunction = (gender) => {
    Step1Data['gender'] = gender
    setGender(gender)
  }

  const maritalCheckFunction = (status) => {
    Step1Data['marital'] = status
    setMarital(status)
  }

  const changeInputValue = (e) => Step1Data[e.target.name] = e.target.value

  return (
    <>
    <TopBar stepIndex={stepIndex} />
    <motion.div
     transition={{delay: 0,x: { duration: 0.7 },default: { ease: "linear" }}}
     animate={{ x:[1000,0] }} 
     className={styles.mf_step_container}>

    <h2>PERSONAL INFORMATION</h2>
    <div className={styles.mf_step_main} >
        {/* first box start */}
      <div className={styles.mf_step_box}>
        <div className={styles.mf_step_section}>
          <div className={styles.mf_step_box_title} >
            <h5>Present Address</h5>
          </div>
          <div className={styles.mf_form_group}>
            <textarea defaultValue="sample address 001" placeholder='Present Address' name='present_adress' onChange={changeInputValue}></textarea>
          </div>
          <div className={styles.mf_form_flex_group} >
            <input defaultValue="Malappuram" placeholder='District' type="text" name='present_district' onChange={changeInputValue}/>
            <input defaultValue="98756" placeholder='Pin' type="number" name='present_pin' onChange={changeInputValue}/>
          </div>
          <div className={`${styles.mf_form_group} ${styles.form_not_filled}`} >
             <input placeholder='State' type="text" name='present_state' onChange={changeInputValue}/>
          </div>
          <div className={`${styles.mf_form_group} ${styles.form_not_filled}`} >
             <input placeholder='Resi Tel' type="number" name='present_residential_telephone' onChange={changeInputValue}/>
          </div>
          <div className={`${styles.mf_form_group} ${styles.form_not_filled}`} >
             <input placeholder='Mobile Number' type="number" name='present_mobile_number' onChange={changeInputValue}/>
          </div>
        </div>
        
        <div className={styles.mf_step_section} style={{marginTop:"10px"}}  >
          <div className={styles.mf_step_box_title} >
            <h5>Permanent Address</h5>
          </div>
          <div className={styles.mf_form_group}>
            <textarea placeholder='Permanent Address' name='permanent_adress' onChange={changeInputValue}></textarea>
          </div>
          <div className={styles.mf_form_flex_group} >
            <input placeholder='District' type="text" name='permanent_district' onChange={changeInputValue}/>
            <input placeholder='Pin' type="number" name='permanent_pin' onChange={changeInputValue}/>
          </div>
            <div className={styles.mf_form_group} >
            <input placeholder='State' type="text" name='permanent_state' onChange={changeInputValue}/>
          </div>
          <div className={styles.mf_form_group} >
             <input placeholder='Resi Tel' type="number" name='permanent_telephone' onChange={changeInputValue}/>
          </div>
          <div className={styles.mf_form_group} >
             <input placeholder='Mobile Number' type="number" name='permanent_mobile' onChange={changeInputValue}/>
          </div>
        </div>
      </div>
     {/* first box end */}
     {/* second box start */}
     <div className={styles.mf_step_box}>
      <div className={styles.mf_step_section} >
        <div className={styles.mf_step_box_title} >
           <h5>Birth / Nationality Details</h5>
        </div>
        <div className={styles.mf_form_group} >
          <input placeholder='Place of birth (City)' type="text" name="birth_city" onChange={changeInputValue}/>
        </div>
        <div className={styles.mf_form_group} >
          <input placeholder='Date of Birth&nbsp;:&nbsp;' type="date" name="DOB" onChange={changeInputValue}/>
        </div>
        <div className={styles.mf_form_group} >
          <input placeholder='Nationality at birth' type="text" name='NAB' onChange={changeInputValue}/>
        </div>
        <div className={`${styles.mf_form_group}`} >
          <input placeholder='Nationality at Present' type="text" name='NAP' onChange={changeInputValue}/>
        </div>
        <div className={styles.mf_form_checkbox_main} >
         <div className={styles.mf_step_box_title} >
           <h5 style={{fontSize:"13px"}} >Do You Hold Dual Nationality</h5>
         </div>
         <div className={styles.mf_form_checkbox} >
          <div>
            <input type="checkbox" checked={dualnationality === 'Yes'} onChange={(e) => dualNationalityFunction('Yes')} /><label htmlFor="">Yes</label>
          </div>
          <div>
            <input  placeholder='if yes, specify' name='dual_nationality_text' type="text" />
          </div>
          <div>
            <input type="checkbox" checked={dualnationality === 'No'} onClick={(e) => dualNationalityFunction('No')}/><label htmlFor="">No</label>
          </div>
        </div>
        </div>
      </div>
    
    <div className={styles.mf_step_section} style={{marginTop:"12px"}} >
      <div className={styles.mf_step_box_title} >
        <h5>Passport Details</h5>
      </div>
      <div className={styles.mf_form_group} >
        <input placeholder='Passport Number' name='passport_number' type="number" onChange={changeInputValue}/>
      </div>
      <div className={styles.mf_form_group} >
        <input placeholder='Place of Issue' name='passport_place_of_issue' type="text" onChange={changeInputValue}/>
      </div>
      <div className={styles.mf_form_group} >
        <input placeholder='Date of Issue&nbsp;:&nbsp;' name='passport_date_of_issue' type="date" onChange={changeInputValue}/>
      </div>
      <div className={styles.mf_form_group} >
        <input placeholder='Date of Expiry&nbsp;:&nbsp;' name='passport_date_of_expiry' type="date" onChange={changeInputValue} />
      </div>
    </div>

    <div className={styles.mf_step_section} style={{marginTop:"25px"}} >
      <div className={styles.mf_step_box_title} >
        <h5>Pan Card Details</h5>
      </div>
      <div className={styles.mf_form_group} >
        <input placeholder='PAN CARD Number' type="number" name='pan_card_number' onChange={changeInputValue}/>
      </div>
      <div className={styles.mf_form_group} >
        <input placeholder='Name as per PAN' type="text" name='name_as_per_pan' onChange={changeInputValue}/>
      </div>
    </div>
      
    </div>
    {/* second box end */}
    {/* third box start */}
    <div className={styles.mf_step_box} >
      <div className={styles.mf_step_section} >
       <div className={styles.mf_step_box_title} >
          <h5>Aadhar Number</h5>
       </div>
       <div className={styles.mf_form_group} >
          <input placeholder='Aadhaar Number' type="number" name='aadhar_number' onChange={changeInputValue}/>
       </div>
       <div className={styles.mf_form_group} >
         <input placeholder='Name as per Aadhaar' type="text" name='name_as_per_aadhar_number' onChange={changeInputValue}/>
       </div>
      </div>

      <div className={styles.mf_step_section} style={{marginTop:"10px"}} >
        <div className={styles.mf_step_box_title} >
            <h5>Gender</h5>
        </div>
        <div className={styles.mf_form_checkbox_main} >
          <div className={styles.mf_form_checkbox} >
            <div>
            <input type="checkbox" onChange={(e) => genderCheckFunction('male')} checked={Gender === 'male'}/>
            <label htmlFor="">Male</label>
            </div>
            <div>
            <input type="checkbox" onChange={(e) => genderCheckFunction('female')} checked={Gender === 'female'}/>
            <label htmlFor="">Female</label>
            </div>
            <div>
            <input type="checkbox" onChange={(e) => genderCheckFunction('trans')} checked={Gender === 'trans'}/>
            <label htmlFor="">Transgender</label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mf_step_section} >
        <div className={`${styles.mf_step_box_title}`} style={{marginTop:"12px"}} >
            <h5>Marital status</h5>
        </div>
        <div className={styles.mf_form_checkbox_main}  >
          <div className={styles.mf_form_checkbox} >
            <div>
            <input type="checkbox" onChange={(e) => maritalCheckFunction('Unmarried')} checked={Marital === 'Unmarried'}/>
            <label htmlFor="">Unmarried</label>
            </div>
            <div>
            <input type="checkbox" onChange={(e) => maritalCheckFunction('Married')} checked={Marital === 'Married'}/>
            <label htmlFor="">Married</label>
            </div>
            <div>
            <input type="checkbox" onChange={(e) => maritalCheckFunction('Separated')} checked={Marital === 'Separated'}/>
            <label htmlFor="">Separated</label>
            </div>
            <div>
            <input type="checkbox" onChange={(e) => maritalCheckFunction('Divorced')} checked={Marital === 'Divorced'}/>
            <label htmlFor="">Divorced</label>
            </div>
            <div>
            <input type="checkbox" onChange={(e) => maritalCheckFunction('Widowed')} checked={Marital === 'Widowed'}/>
            <label htmlFor="">Widowed</label>
            </div>
          </div>
        </div> 
      </div>

      <div className={styles.mf_step_section} style={{marginTop:"12px"}} >
        <div className={styles.mf_step_box_title} >
          <h5>Other Details</h5>
        </div>
        <div className={styles.mf_form_group} >
          <input placeholder='Blood Group' type="text" name='blood_group' onChange={changeInputValue}/>
        </div>
        <div className={styles.mf_form_group} >
          <input placeholder='Email ID' type="text" name='email' onChange={changeInputValue}/>
        </div>
      </div>

    </div>  
    </div>
    <div className={styles.mf_cp_btn}>
        <button className={styles.mf_continew_btn} onClick={()=> {
          setStepIndex(stepIndex+1)
        }}  >
          Continue
          <NavigateNext style={{fill:"white"}} />
        </button>
     </div>
    </motion.div>
    </>
  )
}

export default FirstStep


  