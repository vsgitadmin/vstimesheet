import { useState ,useEffect, useRef} from 'react';
import { Add, Delete, NavigateBefore, NavigateNext } from '@mui/icons-material';
import styles from '../MultiForm.module.css'
import TopBar from '../TopBar';

const SecondStep = ({stepIndex, setStepIndex, setData, Data,empId ,section}) => {
  const [Step2Data, setStep2Data] = useState([]);
  const [CardData, setCardData] = useState({});
  const [cardDetails, setcardDetails] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if(Data.family !== undefined) setcardDetails(Data.family)
  }, [])

  const changeInputValue = (e) => CardData[e.target.name] = e.target.value

  const addMember = (e) => {
    e.preventDefault()
    if(JSON.stringify({}) != JSON.stringify(CardData)){
      CardData['id'] = crypto.randomUUID()
      setcardDetails((e) => [CardData,...e])
      setCardData({})
    }
    // clear input fields
    const form = e.target;
    form.elements.full_name.value = "";
    form.elements.relation.selectedIndex = -1;
    form.elements.dob.value = "";
    form.elements.phone.value = "";
  }

  const deleteMember = (id) => {
    const filtered = cardDetails.filter((data) => data.id !== id)
    setcardDetails(filtered)
  }

  return (
    <>
    <TopBar stepIndex={stepIndex} />
    <div className={styles.mf_step_container}>
      {!section && <div className={styles.mf_cp_btn}>
        <button className={styles.mf_continew_btn}  onClick={()=>{
          setData(cardDetails,'family')
          setStepIndex(stepIndex-1)
          }}  >
          <NavigateBefore style={{fill:"white"}} />
          Previous
        </button>
        <button className={styles.mf_continew_btn} onClick={()=> {
          setData(cardDetails,'family')
          setStepIndex(stepIndex+1)
          }}  >
          Continue
          <NavigateNext style={{fill:"white"}} />
        </button>
     </div>} 
     
    
    <h2>FAMILY DETAILS</h2>
  
   <div className={styles.family_main} >
   <form onSubmit={addMember} className={styles.family_input_details_main} >
      <div className={styles.family_input_group} >
        <label>Full Name</label>
        <input ref={inputRef} required={true} placeholder='Full Name' type="text" name="full_name" onChange={changeInputValue}/>
      </div>
      <div className={styles.family_input_group} >
        <label>Relationship</label>
        <select name='relation' required onChange={(e) => CardData['relation'] = e.target.value}>
         <option value="Select">Select</option>
         <option value="Father">Father</option>
         <option value="Mother">Mother</option>
         <option value="Brother">Brother</option>
         <option value="Spouse">Spouse</option>
         <option value="Sister">Sister</option>
         <option value="Son">Son</option>
         <option value="Daughter">Daughter</option>
        </select>
      </div>
      <div className={styles.family_input_group} >
        <label>Date of Birth</label>
        <input ref={inputRef} required  type="date" name="dob" onChange={changeInputValue}/>
      </div>
      <div className={styles.family_input_group} >
        <label>Contact Number</label>
        <input ref={inputRef} required placeholder='Contact Number' type="text" name="phone" onChange={changeInputValue}/>
      </div>
        <button className={styles.familly_details_btn} > <Add style={{fill:'white'}} /> ADD</button>
    </form>

    <div className={styles.family_details_container} >
      <table>
      <tr>
       <th>No.</th>
       <th>Full Name</th>
       <th>Relationship</th>
       <th>Date of Birth</th>
       <th>Contact Number</th>
       <th></th>
      </tr>
      {cardDetails.map((data,index) => {
        return(
          <tr>
            <td>{index+1}</td>
            <td>{data.full_name}</td>
            <td>{data.relation}</td>
            <td>{data.dob}</td>
            <td>{data.phone}</td>
            <td style={{cursor:"pointer"}} onClick={() => deleteMember(data.id)}><Delete style={{fill:"grey"}} /></td>
         </tr>
        )
      })}
      </table>
    </div>
    <h2 className='mt_5' ></h2>
   </div>
    

    </div>
    </>
  )
}

export default SecondStep