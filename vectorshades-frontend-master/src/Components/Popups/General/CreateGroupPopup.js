import { Modal } from '@mui/material';
import { AddAPhoto } from '@mui/icons-material';
import ProfileImage from '../../ProfileImage/Image';
import SelectUserInput from '../../SelectUserInput/index'
import styles from './Popup.module.css'
import { useState,useContext } from 'react';
import {createNewGroup} from '../../../Controllers/Chat/index'
import { toast } from 'react-toastify';
import {ParentStore} from '../../../../pages/_app'

const CreateGroupPopup = ({render,createGroupPopup, setCreateGroupPopup }) => {
  const {ParentState} = useContext(ParentStore)
  const [members, setMembers] = useState([])
  const [admins, setAdmins] = useState([]) //This is a clone for members
  const [selectedadmins,setSelectedAdmins] = useState([]) //these selected admins are sent to backend
  const [body] = useState({})

  const handleClose = () => setCreateGroupPopup(false);

  const handleAddMember = (user) => {
    setMembers([...members, user])
    setAdmins([...admins,user])
  }
  const handleDeleteMember = (user) => {
    setMembers(members.filter((member) => { return member != user }))
    setAdmins(admins.filter((member) => { return member != user }))
  }

  const handleSelectAdmin = (admin) =>{
    if(selectedadmins.includes(admin)) setSelectedAdmins(selectedadmins.filter((id)=>id !== admin))
    else setSelectedAdmins([...selectedadmins,admin])
  }

  const createNewGroupController = async () => {
    if (members.length === 0) return toast("Please Select At Least One Member ")
    if (selectedadmins.length == 0) return toast("Please Select At Least One Admin ")
    body.groupAdmins = admins
    body.groupMembers = members    
    body.createdBy = {id:ParentState.auth._id,employeeName:`${ParentState.auth.firstName}  ${ParentState.auth.lastName}`}
    createNewGroup(body)
    .then((r)=>toast("group created successfully"))
    .then(()=>render())
    .then(()=>setCreateGroupPopup(false))
    .then(()=>{setAdmins([]); setMembers([]); setSelectedAdmins([]) })
    .catch((err)=>toast("unable to process request"))
  }

  return (
    <>
      <Modal open={createGroupPopup} onClose={handleClose} >
        <div className={styles.create_group_popup} >
          <div className={styles.cg_title} >
            <h2>Create New Group</h2>
          </div>
          <div className={styles.cg_form} >
            <div className={styles.cg_group_image} >
              <div>
                <AddAPhoto />
              </div>
            </div>
            <div className={styles.cg_form_group} >
              <input onChange={(e)=>body.groupName=e.target.value} type="text" placeholder='Group Name' />
            </div>
            <div className={styles.cg_form_group} >
              <textarea onChange={(e)=>body.groupDescription=e.target.value} placeholder='Group Description' ></textarea>
            </div>
            <div className={styles.cg_form_group} >
              <label>Add Group Members</label>
              <SelectUserInput noSelectedUsers={true} multiSelect={true} deleteUser={handleDeleteMember} returnUser={handleAddMember} noTitle={true} />
            </div>
            <div className={styles.cg_members} >
              {members.map((member) => {
                return <ProfileImage id={member} onClick={() => handleDeleteMember(member)} />
              })}

            </div>
            <div className={styles.cg_form_group} >
              <label>Select Admin</label>
            </div>
            <div className={styles.cg_members} >
              {admins.map((admin) => {
                return <ProfileImage id={admin} style={selectedadmins.includes(admin)?{ border: "2px solid var(--redTheme)" }:{}} onClick={() =>handleSelectAdmin(admin)} />
              })}
            </div>
            <div className={styles.cg_buttons} >
              <button onClick={handleClose} >CANCEL</button>
              <button onClick={createNewGroupController}>CREATE</button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default CreateGroupPopup