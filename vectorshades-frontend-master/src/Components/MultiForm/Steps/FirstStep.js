import { useState, useEffect, useRef } from 'react';
import { NavigateNext } from '@mui/icons-material';
import styles from '../MultiForm.module.css'
import { uploadS3Document , deleteS3Document} from '../../../Controllers/files/index'
import { employeeProfilePictureKey } from '../../../Helpers/Constants/profilePicture'
import TopBar from '../TopBar';
import PresignedLink from '../../S3/PresignedLink';
import { toast } from 'react-toastify';
import Router from 'next/router';

// maps a "present_*" field name to its "permanent_*" counterpart
const PRESENT_TO_PERMANENT_FIELD = {
  present_address: 'permanent_address',
  present_district: 'permanent_district',
  present_pin: 'permanent_pin',
  present_state: 'permanent_state',
  present_residential_telephone: 'permanent_residential_telephone',
  present_mobile_number: 'permanent_mobile_number',
}

const FirstStep = ({ stepIndex, setStepIndex, setData, Data , empId , employeeDbId, section}) => {
  const [Step1Data, setStep1Data] = useState({})
  const [Gender, setGender] = useState('')
  const [Marital, setMarital] = useState('')
  const [dualnationality, setdualnationality] = useState('')
  const [imgSrc, setimgSrc] = useState(null)
  const [Img, setImg] = useState(null)
  const [sameAsPresent, setSameAsPresent] = useState(false)

  const permanentAddressRefs = {
    permanent_address: useRef(null),
    permanent_district: useRef(null),
    permanent_pin: useRef(null),
    permanent_state: useRef(null),
    permanent_residential_telephone: useRef(null),
    permanent_mobile_number: useRef(null),
  }

  useEffect(() => {
    if (Data.personal_details !== undefined) {
      setStep1Data(Data.personal_details)
      setSameAsPresent(Boolean(Data.personal_details.same_as_present))
      if (Data.personal_details.img !== undefined) {
        setimgSrc(Data.personal_details.img)
      }
    }
  }, [Data])

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

  const uploadProfilePicture = () => {
    const profileId = employeeDbId || empId
    if (!Img || !profileId) {
      toast.error("Unable to upload profile picture")
      return
    }
    const key = employeeProfilePictureKey(profileId)
    uploadS3Document(Img, key)
      .then((data) => {
        Step1Data['img'] = data.key || data.Location
        setimgSrc(data.key || data.Location)
        toast.success("Profile Picture Uploaded")
      })
      .catch(() => toast.error("unable to process request"))
  }

  const changeInputValue = (e) => Step1Data[e.target.name] = e.target.value

  // copies the current present-address values into the permanent-address
  // fields, both in state and in the (uncontrolled) DOM inputs
  const copyPresentToPermanentAddress = () => {
    Object.entries(PRESENT_TO_PERMANENT_FIELD).forEach(([presentKey, permanentKey]) => {
      const value = Step1Data[presentKey] || ''
      Step1Data[permanentKey] = value
      if (permanentAddressRefs[permanentKey]?.current) {
        permanentAddressRefs[permanentKey].current.value = value
      }
    })
  }

  const sameAsPresentAddressFunction = (e) => {
    const checked = e.target.checked
    Step1Data['same_as_present'] = checked
    setSameAsPresent(checked)
    if (checked) copyPresentToPermanentAddress()
  }

  // present-address inputs use this instead of changeInputValue so the
  // permanent-address fields stay in sync while "same as present" is checked
  const changePresentInputValue = (e) => {
    changeInputValue(e)
    if (sameAsPresent) {
      const permanentKey = PRESENT_TO_PERMANENT_FIELD[e.target.name]
      Step1Data[permanentKey] = e.target.value
      if (permanentAddressRefs[permanentKey]?.current) {
        permanentAddressRefs[permanentKey].current.value = e.target.value
      }
    }
  }

  return (
    <>
      <TopBar stepIndex={stepIndex} />
      <div className={styles.mf_step_container}>
        <h2>PERSONAL INFORMATION</h2>
        <div className={styles.mf_step_main} >
          {/* first box start */}
          <div className={styles.mf_step_box}>
            <div className={styles.mf_step_section}>
              <div className={styles.mf_step_box_title} >
                <h5>Present Address</h5>
              </div>
              <div className={styles.mf_form_group}>
                <textarea placeholder='Present Address' defaultValue={Step1Data['present_address']} name='present_address' onChange={changePresentInputValue}></textarea>
              </div>
              <div className={styles.mf_form_flex_group} >
                <input placeholder='District' type="text" defaultValue={Step1Data['present_district']} name='present_district' onChange={changePresentInputValue} />
                <input placeholder='Pin' type="number" defaultValue={Step1Data['present_pin']} name='present_pin' onChange={changePresentInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='State' type="text" defaultValue={Step1Data['present_state']} name='present_state' onChange={changePresentInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Resi Tel' type="number" defaultValue={Step1Data['present_residential_telephone']} name='present_residential_telephone' onChange={changePresentInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Mobile Number' type="number" defaultValue={Step1Data['present_mobile_number']} name='present_mobile_number' onChange={changePresentInputValue} />
              </div>
            </div>

            <div className={styles.mf_step_section} style={{ marginTop: "10px" }}  >
              <div className={styles.mf_section_title_row} >
                <div className={styles.mf_step_box_title} >
                  <h5>Permanent Address</h5>
                </div>
                <label className={styles.mf_same_address_label} >
                  <input type="checkbox" checked={sameAsPresent} onChange={sameAsPresentAddressFunction} />
                  Same as present address
                </label>
              </div>
              <div className={styles.mf_form_group}>
                <textarea ref={permanentAddressRefs.permanent_address} placeholder='Permanent Address' defaultValue={Step1Data['permanent_address']} name='permanent_address' onChange={changeInputValue} disabled={sameAsPresent}></textarea>
              </div>
              <div className={styles.mf_form_flex_group} >
                <input ref={permanentAddressRefs.permanent_district} placeholder='District' type="text" defaultValue={Step1Data['permanent_district']} name='permanent_district' onChange={changeInputValue} disabled={sameAsPresent} />
                <input ref={permanentAddressRefs.permanent_pin} placeholder='Pin' type="number" defaultValue={Step1Data['permanent_pin']} name='permanent_pin' onChange={changeInputValue} disabled={sameAsPresent} />
              </div>
              <div className={styles.mf_form_group} >
                <input ref={permanentAddressRefs.permanent_state} placeholder='State' type="text" defaultValue={Step1Data['permanent_state']} name='permanent_state' onChange={changeInputValue} disabled={sameAsPresent} />
              </div>
              <div className={styles.mf_form_group} >
                <input ref={permanentAddressRefs.permanent_residential_telephone} placeholder='Resi Tel' type="number" defaultValue={Step1Data['permanent_residential_telephone']} name='permanent_residential_telephone' onChange={changeInputValue} disabled={sameAsPresent} />
              </div>
              <div className={styles.mf_form_group} >
                <input ref={permanentAddressRefs.permanent_mobile_number} placeholder='Mobile Number' type="number" defaultValue={Step1Data['permanent_mobile_number']} name='permanent_mobile_number' onChange={changeInputValue} disabled={sameAsPresent} />
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
                <input placeholder='Place of birth (City)' type="text" defaultValue={Step1Data['birth_city']} name="birth_city" onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Date of Birth&nbsp;:&nbsp;' type="date" defaultValue={Step1Data['DOB']} name="DOB" onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Nationality at birth' type="text" defaultValue={Step1Data['NAB']} name='NAB' onChange={changeInputValue} />
              </div>
              <div className={`${styles.mf_form_group}`} >
                <input placeholder='Nationality at Present' type="text" defaultValue={Step1Data['NAP']} name='NAP' onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_checkbox_main} >
                <div className={styles.mf_step_box_title} >
                  <h5 style={{ fontSize: "13px" }} >Do You Hold Dual Nationality</h5>
                </div>
                <div className={styles.mf_form_checkbox} >
                  <div>
                    <input type="checkbox"  onChange={(e) => dualNationalityFunction('Yes')} checked={Step1Data.dual_nationality === "Yes"} /><label htmlFor="">Yes</label>
                  </div>
                  <div>
                    <input placeholder='if yes, specify' defaultValue={Step1Data['is_dual_nationality']} name='is_dual_nationality' type="text" onChange={changeInputValue} />
                  </div>
                  <div>
                    <input type="checkbox" onClick={(e) => dualNationalityFunction('No')} checked={Step1Data.dual_nationality === "No"} /><label htmlFor="">No</label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.mf_step_section} style={{ marginTop: "12px" }} >
              <div className={styles.mf_step_box_title} >
                <h5>Passport Details</h5>
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Passport Number' defaultValue={Step1Data['passport_number']} name='passport_number' type="number" onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Place of Issue' defaultValue={Step1Data['passport_place_of_issue']} name='passport_place_of_issue' type="text" onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Date of Issue&nbsp;:&nbsp;' defaultValue={Step1Data['passport_date_of_issue']} name='passport_date_of_issue' type="date" onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Date of Expiry&nbsp;:&nbsp;' defaultValue={Step1Data['passport_date_of_expiry']} name='passport_date_of_expiry' type="date" onChange={changeInputValue} />
              </div>
            </div>

            <div className={styles.mf_step_section} style={{ marginTop: "25px" }} >
              <div className={styles.mf_step_box_title} >
                <h5>Pan Card Details</h5>
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='PAN CARD Number' type="text" defaultValue={Step1Data['pan_card_number']} name='pan_card_number' onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Name as per PAN' type="text" defaultValue={Step1Data['name_as_per_pan']} name='name_as_per_pan' onChange={changeInputValue} />
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
                <input placeholder='Aadhaar Number' type="number" defaultValue={Step1Data['aadhar_number']} name='aadhar_number' onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Name as per Aadhaar' type="text" defaultValue={Step1Data['name_as_per_aadhar_number']} name='name_as_per_aadhar_number' onChange={changeInputValue} />
              </div>
            </div>

            <div className={styles.mf_step_section} style={{ marginTop: "10px" }} >
              <div className={styles.mf_step_box_title} >
                <h5>Gender</h5>
              </div>
              <div className={styles.mf_form_checkbox_main} >
                <div className={styles.mf_form_checkbox} >
                  <div>
                    <input type="checkbox" onChange={(e) => genderCheckFunction('Male')} checked={Step1Data.gender === "Male"} />
                    <label htmlFor="">Male</label>
                  </div>
                  <div>
                    <input type="checkbox" onChange={(e) => genderCheckFunction('Female')} checked={Step1Data.gender === "Female"} />
                    <label htmlFor="">Female</label>
                  </div>
                  <div>
                    <input type="checkbox" onChange={(e) => genderCheckFunction('Trans')} checked={Step1Data.gender === "Trans"} />
                    <label htmlFor="">Transgender</label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.mf_step_section} >
              <div className={`${styles.mf_step_box_title}`} style={{ marginTop: "12px" }} >
                <h5>Marital status</h5>
              </div>
              <div className={styles.mf_form_checkbox_main}  >
                <div className={styles.mf_form_checkbox} >
                  <div>
                    <input type="checkbox" onChange={(e) => maritalCheckFunction('Unmarried')} checked={Step1Data.marital === "Unmarried"} />
                    <label htmlFor="">Unmarried</label>
                  </div>
                  <div>
                    <input type="checkbox" onChange={(e) => maritalCheckFunction('Married')} checked={Step1Data.marital === "Married"} />
                    <label htmlFor="">Married</label>
                  </div>
                  <div>
                    <input type="checkbox" onChange={(e) => maritalCheckFunction('Separated')} checked={Step1Data.marital === "Separated"} />
                    <label htmlFor="">Separated</label>
                  </div>
                  <div>
                    <input type="checkbox" onChange={(e) => maritalCheckFunction('Divorced')} checked={Step1Data.marital === "Divorced"} />
                    <label htmlFor="">Divorced</label>
                  </div>
                  <div>
                    <input type="checkbox" onChange={(e) => maritalCheckFunction('Widowed')} checked={Step1Data.marital === "Widowed"} />
                    <label htmlFor="">Widowed</label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.mf_step_section} style={{ marginTop: "12px" }} >
              <div className={styles.mf_step_box_title} >
                <h5>Other Details</h5>
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Blood Group' type="text" defaultValue={Step1Data['blood_group']} name='blood_group' onChange={changeInputValue} />
              </div>
              <div className={styles.mf_form_group} >
                <input placeholder='Email ID' type="text" defaultValue={Step1Data['email']} name='email' onChange={changeInputValue} />
              </div>
            </div>

            {/* upload profile picture */}
            <div className={styles.mf_step_section} style={{ marginTop: "12px" }} >
              <div className={styles.mf_step_box_title} >
                <h5>Upload Profile Picture (Max 100x100)</h5>
              </div>
              <div className={styles.mf_profile_pic} >
                <div>
                  <input type="file" onChange={(e) => setImg(e.target.files[0])} accept="image/png,image/jpeg" />
                  {imgSrc && (
                    <PresignedLink s3Ref={imgSrc} style={{ textDecoration: "underline" }} target="_blank" rel="noreferrer">
                      VIEW
                    </PresignedLink>
                  )} 
                </div>
                <button style={{backgroundColor : Img && 'black'}} onClick={uploadProfilePicture}>UPLOAD</button>
              </div>
            </div>

          </div>
        </div>
        {!section && <div className={styles.mf_cp_btn}>
          <button className={styles.mf_continew_btn} onClick={() => {
            setData(Step1Data, 'personal_details')
            setStepIndex(stepIndex + 1)
          }}  >
            Continue
            <NavigateNext style={{ fill: "white" }} />
          </button>
        </div>}
        
      </div>
    </>
  )
}

export default FirstStep