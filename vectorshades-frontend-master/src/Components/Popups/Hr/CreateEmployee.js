import { useEffect, useState } from 'react';
import { useRouter, Router } from 'next/router';

import styles from './Popup.module.css'
import { CreateEmployeeController, getEmployeeUIDStatusController } from '../../../Controllers/Employee/index';
import { toast } from 'react-toastify';
import ConfirmationPopup from "./ConfirmationPopup"
import leaveTypes from "../../../Constants/leavetypes";
import designations from '../../../Constants/designation';
import { validateCreateEmployeeBody } from '../../../Helpers/General/dataValidation';

const CreateEmployee = ({ createEmp }) => {
  let [body] = useState({})
  const router = useRouter();
  const [ConfirmPopupOpen, setConfirmPopupOpen] = useState(false)
  const [selectedLeaveType, setSelectedLeaveType] = useState([])
  const [UIDExists, setUIDExists] = useState(false)
  const [uid, setUid] = useState('');

  const onLeaveTypeClicked = (type) => {
    if (!selectedLeaveType.includes(type.key))
      setSelectedLeaveType([...selectedLeaveType, type.key])
    else
      setSelectedLeaveType(selectedLeaveType.filter((t) => { return t !== type.key }))
  }
  const addEmployee = (e) => {
    e.preventDefault();
    body.basicDetails = {
      city: body.city,
      gender: body.gender,
      designation: body.designation,
      department: body.department,
      startTime: body.startTime,
      endTime: body.endTime,
      age: body.age,
      pan: body.pan,
      aadhar: body.aadhar,
      salary: body.salary,
      experience: body.experience,
      uid: body.uid,
      leavetypes: selectedLeaveType
    }
    const { valid, message } = validateCreateEmployeeBody(body)
    if (!valid) toast.info(message)
    else if (UIDExists === false) setConfirmPopupOpen(true)

  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (uid) {
        verifyEmployeeUID(uid);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [uid]);


  const verifyEmployeeUID = async (uid) => {
    const { data } = await getEmployeeUIDStatusController(uid)
    if (data.response.data === true) {
      setUIDExists(false)
      body.uid = uid
    }
    else setUIDExists(true)
  }

  return (
    <>
      <ConfirmationPopup action={() => createEmp(body)} setConfirmPopupOpen={setConfirmPopupOpen} confirmPopupOpen={ConfirmPopupOpen} text={"You are about to add a new employee to the system. Please review the following information before proceeding. Once added, the employee's details can be modified later if needed."} title="Confirm Adding New Employee" />
      <div className={styles.ce_popup} >
        <div className={styles.ce_popup_title}>
          <h2>Create Employees</h2>
        </div>
        <form onSubmit={addEmployee} className={styles.ce_form_container} >


          <div className={styles.section_heading} >
            <h3>Personal Details</h3>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>First Name</label>
              <input required placeholder='First Name' type="text" onChange={(e) => body.firstName = e.target.value} />
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Last Name</label>
              <input required placeholder='Last Name' type="text" onChange={(e) => body.lastName = e.target.value} />
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Age</label>
              <input required placeholder='Age' type={'number'} onChange={(e) => body.age = e.target.value} />
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Gender</label>
              <select required onChange={(e) => body.gender = e.target.value}>
                <option hidden>Select</option>
                <option value='male' >Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Location</label>
              <select required onChange={(e) => body.location = e.target.value}>
                <option hidden>Select</option>
                <option value='Chennai' >Chennai</option>
                <option value='kochi'>Kochi</option>
              </select>
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>City</label>
              <input required placeholder='City' type={'text'} onChange={(e) => body.city = e.target.value} />
            </div>
          </div>

          <div className={styles.section_heading} >
            <h3>Employment Details</h3>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Designation</label>
              <select required onChange={(e) => body.designation = e.target.value}>
                <option hidden>Select</option>
                {designations.map((role) => {
                  return (
                    <option>{role}</option>
                  )
                })}
              </select>
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Department</label>
              <select required onChange={(e) => body.department = e.target.value}>
                <option hidden>Select</option>
                <option>Steel</option>
                <option>Rebar</option>
                <option>Management</option>
              </select>
            </div>
          </div>


          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Shift</label>
              <select required onChange={(e) => {
                if (e.target.value === "general") {
                  body.startTime = "10:00";
                  body.endTime = "19:00";
                }
                if (e.target.value === "morning") {
                  body.startTime = "07:00";
                  body.endTime = "16:00";
                }
                if (e.target.value === "secondShift") {
                  body.startTime = "15:30";
                  body.endTime = "00:00";
                }
              }}>
                <option hidden>Select</option>
                <option value={'general'}>General Shift</option>
                <option value={'morning'}>Morning Shift</option>
                <option value={"secondShift"}>Second Shift</option>

              </select>
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Employee Id</label>
              <input style={{ cursor: UIDExists ? 'not-allowed' : 'default', border: `2px solid ${UIDExists ? 'red' : 'green'}`, outline: 'none' }} required placeholder='Employee Id' type='text' onChange={(e) => setUid(e.target.value)} />
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`} >
              <label>Role</label>
              <select required onChange={(e) => body.role = e.target.value}>
                <option hidden>Select</option>
                <option value={'HR'}>Human Resources</option>
                <option value={'EMP'}>Employee</option>
                <option value={'SA'}>Super Admin</option>
                <option value={'PA'}>Project Admin</option>
                <option value={'RB'}>Rebar User</option>
                <option value={'STL'}>Steel User</option>
              </select>
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`} >
              <label>Date of Joining</label>
              <input required placeholder='Date of Joining' type="date" onChange={(e) => body.joining = e.target.value} />
            </div>
          </div>

          {/* <div className={styles.ce_form_group_main} >
          <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Employee Id</label>
              <input required placeholder='Employee Id' type='text' onChange={(e) => body.employeeId = e.target.value} />
            </div>
          </div> */}

          <div className={styles.section_heading} >
            <h3>Contact Information</h3>
          </div>


          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Personal Email</label>
              <input required placeholder='Personal Email' type="email" onChange={(e) => body.personalEmail = e.target.value} />
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Email</label>
              <input required placeholder='Email' type="email" onChange={(e) => body.email = e.target.value} />
            </div>
            {/* <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Start Time</label>
              <input required placeholder='Start Time' type="time" onChange={(e) => { body.startTime = e.target.value;  }} />
            </div> */}
          </div>

          <div className={styles.section_heading} >
            <h3>Identification and Financial</h3>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Aadhar Number</label>
              <input required placeholder='Aadhar Number' type="text" onChange={(e) => body.aadhar = e.target.value} />
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Pan Number</label>
              <input required placeholder='Pan' type={'text'} onChange={(e) => body.pan = e.target.value} />
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Annual CTC</label>
              <input required placeholder='Annual CTC' type="number" onChange={(e) => body.salary = e.target.value} />
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Experience</label>
              <input required placeholder='Experience' type={'number'} onChange={(e) => body.experience = e.target.value} />
            </div>
          </div>

          <div className={styles.section_heading} >
            <h3>Leaves Type</h3>
          </div>

          <div className={styles.rooms}>
            <div className={styles.rooms_option} >
              <div className={styles.options} >
                {leaveTypes.map(t => {
                  return <div onClick={() => onLeaveTypeClicked(t)} className={selectedLeaveType.includes(t.key) && styles.selected}>{t.name}</div>
                })}

              </div>
            </div>
          </div>

          <div className={styles.ce_form_group}>
            <input value="CREATE EMPLOYEE" type="submit" />
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateEmployee