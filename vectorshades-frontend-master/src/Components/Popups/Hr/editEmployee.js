import { useContext, useState } from 'react';
import { ParentStore } from '../../../../pages/_app';
import { useRouter, Router } from 'next/router';
import styles from './Popup.module.css'
import cardStyles from './EditEmployeeDetail.module.css'
import { toast } from 'react-toastify';
import ConfirmationPopup from "./ConfirmationPopup"
import { updateEmployeeController, getEmployeeBasicDetailsController } from '../../../../src/Controllers/Employee/index'
import leavetypes from "../../../Constants/leavetypes";
import designations from '../../../Constants/designation';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'

const EditEmployee = ({ employeeData, basicData, onFormSubmitAction, setBasicData }) => {
  let [body] = useState({})
  const router = useRouter();
  const [ConfirmPopupOpen, setConfirmPopupOpen] = useState(false)
  const { ParentState } = useContext(ParentStore)
  const isHrUser = ParentState?.auth?.role === 'HR'

  const updateEmpoloyee = (e) => {
    const payload = { ...employeeData, basicDetails: basicData }
    delete payload.punch
    onFormSubmitAction(payload)
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    setConfirmPopupOpen(true)
  }

  const handleLeaveTypeClick = (lT) => {
    const updatedLeaveTypes = basicData.leavetypes.includes(lT.key)
      ? basicData.leavetypes.filter((t) => t !== lT.key)
      : [...basicData.leavetypes, lT.key];

    setBasicData({ ...basicData, leavetypes: updatedLeaveTypes });
  };

  return (
    <>
      <ConfirmationPopup action={() => updateEmpoloyee()} setConfirmPopupOpen={setConfirmPopupOpen} confirmPopupOpen={ConfirmPopupOpen} text={"Confirm making changes to employee details.This might take couple of minutes"} title="Are you sure you want to change details" />
      <div className={`${styles.ce_popup} ${cardStyles.pageContainer}`} >
        <div className={styles.ce_popup_title}>
          <h2>Edit Employee</h2>
        </div>
        <form onSubmit={onFormSubmit} className={styles.ce_form_container} >


          <div className={cardStyles.card}>
            <div className={cardStyles.cardHeaderRow}>
              <span className={cardStyles.cardIcon}><PersonOutlineIcon /></span>
              <h3 className={cardStyles.cardTitle}>Personal Details</h3>
            </div>
            {(employeeData && basicData) &&
              <>
                <div className={styles.ce_form_group_main} >
                  <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                    <label>First Name</label>
                    <input defaultValue={employeeData.firstName} required placeholder='First Name' type="text" onChange={(e) => employeeData.firstName = e.target.value} />
                  </div>
                  <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                    <label>Last Name</label>
                    <input defaultValue={employeeData.lastName} required placeholder='Last Name' type="text" onChange={(e) => employeeData.lastName = e.target.value} />
                  </div>
                </div>

                <div className={styles.ce_form_group_main} >
                  <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                    <label>Age</label>
                    <input defaultValue={basicData.age} required placeholder='Age' type={'number'} onChange={(e) => basicData.age = e.target.value} />
                  </div>
                  <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                    <label>Gender</label>
                    <select defaultValue={basicData.gender} required onChange={(e) => basicData.gender = e.target.value}>
                      <option hidden>Select</option>
                      <option value='male' >Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                  <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                    <label>Location</label>
                    <select defaultValue={employeeData.location} required onChange={(e) => employeeData.location = e.target.value}>
                      <option hidden>Select</option>
                      <option value='Chennai' >Chennai</option>
                      <option value='kochi'>Kochi</option>
                    </select>
                  </div>
                </div>

                <div className={styles.ce_form_group_main} >
                  <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                    <label>City</label>
                    <input value={basicData.city} required placeholder='City' type={'text'} onChange={(e) => basicData.city = e.target.value} />
                  </div>
                </div>
              </>}
          </div>

          <div className={cardStyles.card}>
            <div className={cardStyles.cardHeaderRow}>
              <span className={cardStyles.cardIcon}><WorkOutlineIcon /></span>
              <h3 className={cardStyles.cardTitle}>Employment Details</h3>
            </div>
            {basicData &&
              <>
                <div className={styles.ce_form_group_main} >
                  <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                    <label>Designation</label>
                    <select defaultValue={basicData.designation} required onChange={(e) => {
                      basicData.designation = e.target.value
                      employeeData.designation = e.target.value
                    }}>
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
                    <select defaultValue={basicData.department} required onChange={(e) => basicData.department = e.target.value}>
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
                    <select
                      defaultValue={
                        basicData.startTime === "10:00" && basicData.endTime === "19:00"
                          ? "general"
                          : basicData.startTime === "07:00" && basicData.endTime === "16:00"
                            ? "morning"
                            : basicData.startTime === "15:30" && (basicData.endTime === "00:00")
                              ? "secondShift"
                              : ""
                      }
                      required
                      onChange={(e) => {
                        if (e.target.value === "general") {
                          basicData.startTime = "10:00";
                          basicData.endTime = "19:00";
                        }
                        if (e.target.value === "morning") {
                          basicData.startTime = "07:00";
                          basicData.endTime = "16:00";
                        }
                        if (e.target.value === "secondShift") {
                          basicData.startTime = "15:30";
                          basicData.endTime = "00:00";
                        }
                      }}
                    >
                      <option hidden>Select</option>
                      <option value={"general"}>General Shift</option>
                      <option value={"morning"}>Morning Shift</option>
                      <option value={"secondShift"}>Second Shift</option>
                    </select>
                  </div>
                  <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                    <label>Employee Id</label>
                    <input defaultValue={basicData.uid} required placeholder='Employee Id' type='text' onChange={(e) => basicData.uid = e.target.value} />
                  </div>
                </div>

                {isHrUser && employeeData &&
                  <div className={styles.ce_form_group_main} >
                    <div className={`${styles.ce_form_group} ${styles.ce_label}`} >
                      <label>Role</label>
                      <select defaultValue={employeeData.role} required onChange={(e) => employeeData.role = e.target.value}>
                        <option hidden>Select</option>
                        <option value={'SA'}>Super Admin</option>
                        <option value={'HR'}>Human Resources</option>
                        <option value={'EMP'}>Employee</option>
                        <option value={'PA'}>Project Admin</option>
                        <option value={'RB'}>Steel Rebar Employee</option>
                        <option value={'STL'}>Steel Employee</option>
                      </select>
                    </div>
                    <div className={`${styles.ce_form_group} ${styles.ce_label}`} >
                      <label>Joining Date</label>
                      <input
                        defaultValue={employeeData.joining ? employeeData.joining.substring(0, employeeData.joining.indexOf('T')) : ''}
                        required
                        type="date"
                        onChange={(e) => employeeData.joining = e.target.value}
                      />
                    </div>
                  </div>
                }
              </>
            }
          </div>

          <div className={cardStyles.card}>
            <div className={cardStyles.cardHeaderRow}>
              <span className={cardStyles.cardIcon}><MailOutlineIcon /></span>
              <h3 className={cardStyles.cardTitle}>Contact Information</h3>
            </div>
            {employeeData && <>
              <div className={styles.ce_form_group_main} >
                <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                  <label>Personal Email</label>
                  <input defaultValue={employeeData.personalEmail} required placeholder='Personal Email' type="email" onChange={(e) => employeeData.personalEmail = e.target.value} />
                </div>
                <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                  <label>Email</label>
                  <input defaultValue={employeeData.email} required placeholder='Email' type="email" onChange={(e) => employeeData.email = e.target.value} />
                </div>
              </div>
            </>
            }
          </div>

          <div className={cardStyles.card}>
            <div className={cardStyles.cardHeaderRow}>
              <span className={cardStyles.cardIcon}><BadgeOutlinedIcon /></span>
              <h3 className={cardStyles.cardTitle}>Identification and Financial</h3>
            </div>
            {basicData && <>
              <div className={styles.ce_form_group_main} >
                <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                  <label>Aadhar Number</label>
                  <input defaultValue={basicData.aadhar} required placeholder='Aadhar Number' type="text" onChange={(e) => basicData.aadhar = e.target.value} />
                </div>
                <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                  <label>Pan Number</label>
                  <input defaultValue={basicData.pan} required placeholder='Pan' type={'text'} onChange={(e) => basicData.pan = e.target.value} />
                </div>
              </div>

              <div className={styles.ce_form_group_main} >
                <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                  <label>Annual CTC</label>
                  <input defaultValue={basicData.salary} required placeholder='Annual CTC' type="number" onChange={(e) => basicData.salary = e.target.value} />
                </div>
                <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
                  <label>Experience</label>
                  <input defaultValue={basicData.experience} required placeholder='Experience' type={'number'} onChange={(e) => basicData.experience = e.target.value} />
                </div>
              </div>
            </>}
          </div>

          <div className={cardStyles.card}>
            <div className={cardStyles.cardHeaderRow}>
              <span className={cardStyles.cardIcon}><EventAvailableOutlinedIcon /></span>
              <h3 className={cardStyles.cardTitle}>Leaves Type</h3>
            </div>
            <div className={styles.rooms}>
              <div className={styles.rooms_option} >
                <div className={styles.options} >

                  {
                    basicData?.leavetypes && leavetypes.map((lT) => {
                      return <div onClick={() => handleLeaveTypeClick(lT)} className={`${basicData?.leavetypes?.includes(lT.key) ? styles.selected : ''}`}>{lT.name}</div>
                    })
                  }
                  {/**/}
                  {/**/}
                  {/*<div>Unpaid</div>*/}
                  {/*<div>Special</div>*/}
                </div>
              </div>
            </div>
          </div>

          <div className={cardStyles.submitRow}>
            <input className={cardStyles.submitBtn} value="EDIT EMPLOYEE" type="submit" />
          </div>
        </form>
      </div>
    </>
  )
}

export default EditEmployee