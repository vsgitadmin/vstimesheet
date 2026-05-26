import { Search, DoneAll, MoreVert, FiberManualRecord } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { MenuItem, Modal } from '@mui/material'
import ProfileImage from '../ProfileImage/Image'
import styles from '../../../styles/Chat.module.css'
import OutsideClickHandler from 'react-outside-click-handler'
import CreateGroupPopup from '../Popups/General/CreateGroupPopup'
import AddMemberPopup from '../Popups/General/AddMemberPopup'


const Dropdown = ({ setCreateGroupPopup, setaddMemberPopup }) => {
   return (
      <div className={styles.chat_dropdown} >
         <MenuItem onClick={() => setCreateGroupPopup(prev => !prev)} >New group</MenuItem>
         <MenuItem onClick={() => setaddMemberPopup(true)}>New chat</MenuItem>
      </div>
   )
}

const LeftSide = ({ chats, currentChat, setCurrentChat,selectNewUser, createChat, groups, setIsGroupChat, parentState, render }) => {

   const [dropdown, setDropdown] = useState(false)
   const [createGroupPopup, setCreateGroupPopup] = useState(false)
   const [addMemberPopup, setaddMemberPopup] = useState(false)

   const handleAddMemberSubmit = async (user) => {
      await selectNewUser(user)
      setaddMemberPopup(false)
      // createChat({ reciver: member }).then((res) => {
      //    setaddMemberPopup(false)
      // }).catch((err) => {
      //    console.log(err);
      // })
   }

   return (
      <>
         <CreateGroupPopup render={render}  createGroupPopup={createGroupPopup} setCreateGroupPopup={setCreateGroupPopup} />
         <Modal open={addMemberPopup} onClose={() => { setaddMemberPopup(false) }}><AddMemberPopup title={"Selct user to add"} submit={handleAddMemberSubmit} /></Modal>
         <div className={styles.left_side} >
            <div className={styles.left_side_top} >
               <div className={styles.left_search} >
                  <div><Search /></div>
                  <input type="text" placeholder='Search' />
               </div>
               <OutsideClickHandler onOutsideClick={() => setDropdown(false)} >
                  {dropdown && <Dropdown setCreateGroupPopup={setCreateGroupPopup} setaddMemberPopup={setaddMemberPopup} />}
                  <MoreVert onClick={() => setDropdown(prev => !prev)} className={styles.more_vert} />
               </OutsideClickHandler>
            </div>

            <div className={styles.left_contacts} >


               {/* <div className={styles.online_list} >
                  <div className={styles.online_list_top} >
                     <h4>Online Now</h4>
                     <h5>See All</h5>
                  </div>

                  <div className={styles.online_list_profiles} >

                     <div className={styles.em_profile}>
                        <ProfileImage id="fde95230-8cff-4e53-a78b-c16a1a8c4cae" size={40} />
                        <div><FiberManualRecord /></div>
                     </div>
                     <div className={styles.em_profile}>
                        <ProfileImage id="0f6e4563-f558-4811-9197-3bcf6c7d3d2b" size={40} />
                        <div><FiberManualRecord /></div>
                     </div>
                     <div className={styles.em_profile}>
                        <ProfileImage id="38a2dd3f-1c1a-42d9-b1e1-52532fc3b85e" size={40} />
                        <div><FiberManualRecord /></div>
                     </div>
                     <div className={styles.em_profile}>
                        <ProfileImage size={40} />
                        <div><FiberManualRecord /></div>
                     </div>
                     <div className={styles.em_profile}>
                        <ProfileImage size={40} />
                        <div><FiberManualRecord /></div>
                     </div>
                  </div>
               </div> */}
               {/* <div className={`${styles.left_contact_box} ${styles.left_selected_contact}`} >
                  <ProfileImage id="38a2dd3f-1c1a-42d9-b1e1-52532fc3b85e" size={40} />
                  <div className={styles.left_contact_details} >
                     <div className={styles.left_name_time} >
                        <h3>Design Team</h3>
                        <h5>6:30 AM</h5>
                     </div>
                     <div className={styles.left_message_label} >
                        <p>Thanks, I appreciate it.</p>
                        <DoneAll style={{ fill: "skyblue" }} />
                     </div>
                  </div>
               </div> */}
               {chats.map((chat) => {
                  if (chat.employeeId != parentState?.auth._id) return <>
                     <div onClick={() => { setCurrentChat(chat); setIsGroupChat(false) }} id={chat.employeeId} className={`${styles.left_contact_box} ${chat == currentChat && styles.left_selected_contact}`} >
                        <div className={styles.em_profile}>
                           <ProfileImage id={chat.employeeId} size={40} />
                           <div><FiberManualRecord /></div>
                        </div>
                        <div className={styles.left_contact_details} >
                           <div className={styles.left_name_time} >
                              <h3>{chat.employeeName}</h3>
                              <h5>10:30 AM</h5>
                           </div>
                           <div className={styles.left_message_label} >
                              <p>Hey, how's it going?</p>

                           </div>
                        </div>
                     </div>
                  </>
               })}

               {groups.map((chat) => {
                  return <>
                     <div onClick={() => { setCurrentChat(chat); setIsGroupChat(true) }} id={chat.employeeId} className={`${styles.left_contact_box} ${chat == currentChat && styles.left_selected_contact}`} >
                        <div className={styles.em_profile}>
                           <ProfileImage id={chat.groupAdmins[0].id} size={20} /> <ProfileImage id={chat.groupMembers[0]} size={20} />
                           <div><FiberManualRecord /></div>
                        </div>
                        <div className={styles.left_contact_details} >
                           <div className={styles.left_name_time} >
                              <h3>{chat.groupName}</h3>
                              <h5>10:30 AM</h5>
                           </div>
                           <div className={styles.left_message_label} >
                              <p>Hey, how's it going?</p>

                           </div>
                        </div>
                     </div>
                  </>
               })}
            </div>
         </div>
      </>
   )
}

export default LeftSide