import { useState ,useEffect,useContext} from 'react'
import styles from './Popup.module.css'
import { Avatar, AvatarGroup, Modal } from '@mui/material'
import { Add } from '@mui/icons-material'
import {getEmployeesController} from '../../../Controllers/projects/index'
import { toast } from 'react-toastify'
import {ParentStore} from '../../../../pages/_app'

const CreateProjectPopup = ({ proPopup, setProPopup, submit }) => {
  const [employeesFilter, setemployeesFilter] = useState([])
  const {ParentState} = useContext(ParentStore)
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    members: [ParentState?.auth?._id],
    admin: ParentState?.auth?._id,
    description: '',
    estimatedHours: '',
    createdBy:ParentState?.auth?._id
  });

  const handleInputChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    if(proPopup)
    getEmployeesController()
    .then((data) => {
      setemployeesFilter(data.data.response.data)
    })
    .catch((err) => {
      console.log(err);
      toast.error("error occured while fetching employees")
    })
  }, [proPopup])
  

  const handleCreate = () => {  };
  const handleClose = () => setProPopup(false)

  return (
    <>
      <Modal open={proPopup} onClose={handleClose} >
        <div className={styles.project_popup} >
          <div className={styles.heading}>
            <h2>Create Project</h2>
          </div>
          <div className={styles.form_group}>
            <label>Project Name</label>
            <input
              type="text"
              name="projectName"
              placeholder="Enter Project Name"
              value={formData.projectName}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.form_group}>
            <label>Client Name</label>
            <input
              type="text"
              name="client"
              placeholder="Client Name"
              value={formData.client}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.form_group} >
            <label>Team Members</label>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} >
            <div className={styles.project_members}>
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png" />
                <Avatar alt="Travis Howard" src="https://w7.pngwing.com/pngs/481/915/png-transparent-computer-icons-user-avatar-woman-avatar-computer-business-conversation-thumbnail.png" />
                <Avatar alt="Cindy Baker" src="https://cdn-icons-png.flaticon.com/512/147/147133.png" />
                <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
              </AvatarGroup>
              <button>ADD</button>
            </div>
            <div className={styles.form_group} style={{ marginTop: "10px" }} >
              <label>Add Admin</label>
            </div>
            <div className={styles.project_members}>
              <Avatar alt="Remy Sharp" src="https://cdn-icons-png.flaticon.com/512/147/147133.png" />
              <button>ADD</button>
            </div>
          </div>
          <div className={styles.form_group} >
            <label>Project Description</label>
            <textarea placeholder='Project Description' name='description' onChange={handleInputChange}></textarea>
          </div>
          <div className={styles.form_group}>
            <label>Estimated Hour</label>
            <input type="number" defaultValue="2" name='estimatedHours' onChange={handleInputChange}/>
          </div>
          <div className={styles.last_buttons} >
            <button onClick={() => submit(formData)}>CREATE</button>
            <button onClick={handleClose}>CANCEL</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default CreateProjectPopup