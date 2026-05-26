import { Avatar, MenuItem, Modal } from '@mui/material'
import { useState, useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import styles from './Popup.module.css'
import { selectEmployeesController } from '../../../Controllers/Filters/index'
import { toast } from 'react-toastify'
import { AddProjectMembersController } from '../../../Controllers/projects/index'
import { Close } from '@mui/icons-material'
import ProfileImage from '../../ProfileImage/Image'
import SelectUserInput from '../../SelectUserInput'

function AddUserPopup({ addUserPopup, setAddUserPopup, id, render , rebar }) {
  const [Users, setUsers] = useState([])
  const [isDropDownOpen, setIsDropdownOpen] = useState(false)
  const [isUserSelected, setIsUserSelected] = useState(false)
  const [selectedUser, setSelectedUser] = useState()
  const [selectedUserName, setSelectedUserName] = useState("")
  const [selectedRole, setSelectedRole] = useState()

  useEffect(() => {
    // selectEmployeesController({ search: '' }).then((emp) => {
    //   setUsers(emp.data.response.employee)
    //   setIsDropdownOpen(true)
    // }).catch(err => {
    //   toast.error('error occured')
    // })
  }, [])

  const searchEmployee = async (search) => {
    try {
      const emp = await selectEmployeesController({ search: search.target.value });
      setIsDropdownOpen(true)
      setUsers(emp.data.response.employee)
      return emp
    } catch (err) { throw err }
  }

  const addUsers = (e) => {
    if (Users.length === 0) return
    AddProjectMembersController({ members: Users.map((data) => data._id), role: selectedRole }, { project: id }).then(() => {
      setAddUserPopup(false)
      render()
      toast.success('user added successfully')
      window.location.reload()
    })
      .catch(err => {
        toast.error('error occured')
      })
  }


  return (
    <Modal open={addUserPopup} onClose={() => setAddUserPopup(false)} >
      <div className={styles.add_user} >
        <OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)} >
          <div className={styles.form_group}>
            <h2>User Management</h2>
            <SelectUserInput createProject={true} rebar={rebar} returnUser={(users) => setUsers(users)} multiSelect={true} />
          </div>
        </OutsideClickHandler>
        {isUserSelected && <div className={styles.selected_users}>
          <ProfileImage id={selectedUser} size="25px" />
          <h3>{selectedUserName}</h3>
          <Close onClick={() => setIsUserSelected(false)} />
        </div>}
        <select name='role' onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="contributor">Contributor</option>
          <option value="AD">Admin</option>
        </select>
        <button onClick={() => addUsers()}>Submit</button>
      </div>
    </Modal>
  )
}

export default AddUserPopup