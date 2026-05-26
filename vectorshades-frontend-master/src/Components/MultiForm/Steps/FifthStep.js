import { useState, useEffect } from 'react';
import { Add, Delete, NavigateBefore, NavigateNext } from '@mui/icons-material';
import styles from '../MultiForm.module.css'
import TopBar from '../TopBar';


const FifthStep = ({ stepIndex, setStepIndex, setData, Data ,section}) => {
  const [emergencyDetails, setemergencyDetails] = useState([])
  const [emergencyCard, setemergencyCard] = useState({})
  const [LanguageDetails, setLanguageDetails] = useState([])
  const [LanguageCard, setLanguageCard] = useState({})

  useEffect(() => {
    if (Data.language_proficiency) setLanguageDetails(Data.language_proficiency)
    if (Data.emergency_contact_details) setemergencyDetails(Data.emergency_contact_details)
  }, [])


  const handleEmergencyCardChange = (e) => emergencyCard[e.target.name] = e.target.value
  const handleLanguageCardChange = (e) => LanguageCard[e.target.name] = e.target.value

  const pushEmergencyCard = () => {
    const split_name = emergencyCard.full_name.split(" ");
    const name_object = {
      first: split_name[0],
      middle: split_name.slice(1, -1).join(" "),
      family_surname: split_name[split_name.length - 1],
    };
    emergencyCard['id'] = crypto.randomUUID()
    setemergencyCard({ ...emergencyCard, ...name_object })
    setemergencyDetails((e) => [emergencyCard, ...e])
    setemergencyCard({})
  }

  const pushLanguageCard = () => {
    LanguageCard['id'] = crypto.randomUUID()
    setLanguageDetails((e) => [LanguageCard, ...e])
    setLanguageCard({})
  }

  const deleteLanguageCard = (id) => {
    const filtered = LanguageDetails.filter((data) => data.id !== id)
    setLanguageDetails(filtered)
  }

  const deleteEmergencyCard = (id) => {
    const filtered = emergencyDetails.filter((data) => data.id !== id)
    setemergencyDetails(filtered)
  }


  return (
    <>
      <TopBar stepIndex={stepIndex} />
      <div className={styles.mf_step_container}>
          {!section && <div className={styles.mf_cp_btn}>
          <button className={styles.mf_continew_btn} onClick={() => {
            setStepIndex(stepIndex - 1);
            setData(emergencyDetails, 'emergency_contact_details');
            setData(LanguageDetails, 'language_proficiency');
          }}  >
            <NavigateBefore style={{ fill: "white" }} />
            Previous
          </button>
          <button className={styles.mf_continew_btn} onClick={() => {
            setStepIndex(stepIndex + 1)
            setData(emergencyDetails, 'emergency_contact_details');
            setData(LanguageDetails, 'language_proficiency');
          }}>
            Continue
            <NavigateNext style={{ fill: "white" }} />
          </button>
        </div>}
        

        <h2>EMERGENCY CONTACT DETAILS</h2>
        <div className={styles.family_main} >
          <div className={styles.family_input_details_main} >
            <div className={styles.ref_input_group} >
              <label>Full Name</label>
              <input placeholder='Full Name' type="text" name='full_name' onChange={handleEmergencyCardChange} />
            </div>
            <div className={styles.ref_input_group}  >
              <label>Address</label>
              <input placeholder='Address' type="text" name='address' onChange={handleEmergencyCardChange} />
            </div>
            <div className={styles.ref_input_group}  >
              <label>Relationship</label>
              <input placeholder='Relationship' type="text" name='relationship' onChange={handleEmergencyCardChange} />
            </div>
            <div className={styles.ref_input_group} >
              <label>Mobile Number</label>
              <input placeholder='Mobile Number' type="text" name='mobile_number' onChange={handleEmergencyCardChange} />
            </div>
            <div className={styles.ref_input_group}  >
              <label>Res. Tel</label>
              <input placeholder='Res. Tel' type="text" name='residence_tel' onChange={handleEmergencyCardChange} />
            </div>
            <button className={styles.familly_details_btn} onClick={pushEmergencyCard} > <Add style={{ fill: 'white' }} /> ADD</button>
          </div>

          <div className={styles.family_details_container} >
            <table>
              <tr>
                <th>No.</th>
                <th>Full Name</th>
                <th>Address</th>
                <th>Relationship</th>
                <th>Mobile Number</th>
                <th>Res. Tel</th>
                <th></th>
              </tr>
              {emergencyDetails.map((data, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{data.full_name}</td>
                    <td>{data.address}</td>
                    <td>{data.relationship}</td>
                    <td>{data.mobile_number}</td>
                    <td>{data.residence_tel}</td>
                    <td onClick={() => deleteEmergencyCard(data.id)}><Delete style={{ fill: "grey" }} /></td>
                  </tr>
                )
              })}


            </table>
          </div>

          <h2 className='mt_4' >LANGUAGE PROFICIENCY</h2>
          <div className={styles.family_input_details_main} style={{ marginTop: "0px" }} >
            <div className={styles.family_input_group}  >
              <label>Language</label>
              <select name='language' onChange={handleLanguageCardChange}>
                <option value="" hidden >Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
            <div className={styles.family_input_group}  >
              <label>Read</label>
              <select name='read' onChange={handleLanguageCardChange}>
                <option value="" hidden>Select</option>
                <option value="b">Basic</option>
                <option value="i">Intermediate</option>
                <option value="f">Fluent</option>
              </select>
            </div>
            <div className={styles.family_input_group}  >
              <label>Write</label>
              <select name='write' onChange={handleLanguageCardChange}>
                <option value="" hidden>Select</option>
                <option value="b">Basic</option>
                <option value="i">Intermediate</option>
                <option value="f">Fluent</option>
              </select>
            </div>
            <div className={styles.family_input_group}  >
              <label>Speak</label>
              <select name='speak' onChange={handleLanguageCardChange}>
                <option value="" hidden>Select</option>
                <option value="b">Basic</option>
                <option value="i">Intermediate</option>
                <option value="f">Fluent</option>
              </select>
            </div>
            <button className={styles.familly_details_btn} onClick={pushLanguageCard} > <Add style={{ fill: 'white' }} /> ADD</button>
          </div>

          <div className={styles.family_details_container} >
            <table>
              <tr>
                <th>No.</th>
                <th>Language</th>
                <th>Read</th>
                <th>Write</th>
                <th>Speak</th>
              </tr>
              {LanguageDetails.map((data, index) => {
                const languageExtract = {
                  i: 'Intermediate',
                  b: 'basic',
                  f: 'fluent'
                }
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{data.language}</td>
                    <td>{languageExtract[data.read]}</td>
                    <td>{languageExtract[data.write]}</td>
                    <td>{languageExtract[data.speak]}</td>
                    <td onClick={() => deleteLanguageCard(data.id)}><Delete style={{ fill: "grey" }} /></td>
                  </tr>
                )
              })}

            </table>
          </div>
          <h3 className='mt_5'></h3>
        </div>
      </div>
    </>
  )
}

export default FifthStep