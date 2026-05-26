
import { Close, FileDownload, PersonAddOutlined } from '@mui/icons-material'
import styles from '../../../styles/Chat.module.css'
import ProfileImage from '../ProfileImage/Image'
import AddMemberPopup from "../Popups/General/AddMemberPopup"
import { Modal } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const RightSide = ({ isGroupChat, groupData, currentChat, addMemberToGroup,employeeData, collapsable, setCollapsable }) => {
  const [openAddMemberPopup, setOpenAddMemberPopup] = useState(false)

  const handleAddMemberSubmit = (users) => {
    const selectedMember = users
    setOpenAddMemberPopup(false)
    addMemberToGroup(selectedMember)
  }

  return (
    <>
      <Modal open={openAddMemberPopup} onClose={() => setOpenAddMemberPopup(false)}><AddMemberPopup title={"Select member to add"} submit={handleAddMemberSubmit} /></Modal>
      <div className={styles.right_side} >
      <div className={styles.close_icon} onClick={()=> setCollapsable(false)} >
          <Close/>
      </div>
        <div className={styles.right_user_profile} >
          <ProfileImage key={!isGroupChat ? currentChat?.employeeId : currentChat._id} id="38a2dd3f-1c1a-42d9-b1e1-52532fc3b85e" size={50} />
          <div>
            <h3>{!isGroupChat ? currentChat?.employeeName : currentChat.groupName}</h3>
            <p>{!isGroupChat && employeeData && employeeData?.designation }</p>
            <p>{!isGroupChat && employeeData && employeeData?.department }</p>
            {isGroupChat && <h3>{currentChat.groupMembers.length + currentChat.groupAdmins.length}</h3>}
            {isGroupChat && <p>Official group of designing team share your thoughts and more</p>}
          </div>
        </div>

        <div className={styles.attach} >
          <div className={styles.attach_heading} >
            <h3>Files</h3>
          </div>

          <div className={styles.attach_lists} >

            <div className={styles.attach_box} >
              <div className={styles.attach_box_top} >
                <img src="https://cdn-icons-png.flaticon.com/64/4577/4577383.png" alt="" />
                <div className={styles.attach_box_det} >
                  <h4>Design Structure</h4>
                  <div>
                    <h5>IMG 184 kB</h5>
                    <h5>24 Jun 2023</h5>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.attach_box} >
              <div className={styles.attach_box_top} >
                <img src="https://cdn-icons-png.flaticon.com/64/337/337932.png" alt="" />
                <div className={styles.attach_box_det} >
                  <h4>Project Description</h4>
                  <div>
                    <h5>DOC 2 MB</h5>
                    <h5>24 Jun 2023</h5>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {isGroupChat &&
            <div className={styles.group_members} >
              <div className={styles.group_members_heading} >
                <h3>Group Members</h3>
              </div>
              <div className={styles.right_group_members_main} style={{ marginTop: "5px" }} >

                <div onClick={() => setOpenAddMemberPopup(true)} className={styles.left_contact_box} style={{ borderBottom: "none" }} >
                  <PersonAddOutlined style={{ fontSize: "18px" }} />
                  <div className={styles.left_contact_details} >
                    <div className={styles.left_name_time} >
                      <h4>Add Member</h4>
                    </div>
                  </div>
                </div>

                {groupData?.groupAdmins?.map((admin) => {
                  return (
                    <div key={admin._id} className={`${styles.left_contact_box}  ${styles.right_group_members}`} >
                      <ProfileImage id={admin.id} size={35} />
                      <div className={styles.left_contact_details} >
                        <div className={styles.left_name_time} >
                          <h4>{admin.employeeName} </h4>
                        </div>
                      </div>
                      <div className={styles.group_admin} >
                        Group Admin
                      </div>
                    </div>
                  )
                })}

                {groupData?.groupMembers?.map((member) => {
                  return (
                    <div key={member.id} className={`${styles.left_contact_box}  ${styles.right_group_members}`} >
                      <ProfileImage id={member._id} size={35} />
                      <div className={styles.left_contact_details} >
                        <div className={styles.left_name_time} >
                          <h4>{`${member.firstName} ${member.lastName}`}</h4>
                        </div>
                      </div>
                    </div>
                  )
                })}


                {/* <div className={`${styles.left_contact_box}  ${styles.right_group_members}`} >
                  <ProfileImage id="0f6e4563-f558-4811-9197-3bcf6c7d3d2b" size={35} />
                  <div className={styles.left_contact_details} >
                    <div className={styles.left_name_time} >
                      <h4>Rashi (You)</h4>
                    </div>
                  </div>
                </div> */}

              </div>
            </div>}

        </div>
      </div>
    </>
  )
}

export default RightSide
