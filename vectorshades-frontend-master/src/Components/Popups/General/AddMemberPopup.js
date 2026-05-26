import { Modal } from '@mui/material'
import styles from './Popup.module.css'
import SelectUserInput from '../../SelectUserInput/index'
import ProfileImage from '../../ProfileImage/Image'
import { useEffect, useState } from 'react'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { selectEmployeesController } from '../../../Controllers/Filters/index'
import { Close } from '@mui/icons-material'
import { toast } from "react-toastify";

const AddMemberPopup = ({ title, subTitle, submit, multiSelect }) => {
  const [selectedUser, setSelectedUser] = useState([])
  const [Users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])


  const handleUserClick = (employ) => {
    if (multiSelect) {
      const userExist = (selectedUser.filter((u) => { return u._id === employ._id }).length != 0)
      !userExist && setSelectedUser([...selectedUser, employ])
    } else {
      setSelectedUser([employ])
    }

  }

  const deleteUser = (user) => {
    setSelectedUser((e) => e.filter((u) => u._id !== user._id ))
  }

  const searchEmployee = async (search) => {
    try {
      const emp = await selectEmployeesController({ search: search.target.value });
      setUsers(emp.data.response.employee)
    } catch (err) { throw err }
  }

  const fetchUsers = async () => {
    const emp = await selectEmployeesController({});
    setUsers(emp.data.response.employee)
  }

  const handleSubmitClick = () => {
    if (selectedUser.length != 0) {
      submit && multiSelect?submit(selectedUser):submit(selectedUser[0])
    } else {
      toast.error("select atleast one employ")
    }
  }

  return (
    <>
      <div className={styles.cloud_admin} >
        <div className={styles.ca_title} >
          <h2>{title}</h2>
          <p>{subTitle}</p>
        </div>
        <input className='notice_input' placeholder='Search User' onChange={searchEmployee} type='text' />
        {selectedUser.map((user) => {
          return <div key={user._id} className={`award_selected_users`}>
            <ProfileImage id={user._id} size="25px" />
            <h3>{user.firstName} {user.lastName}</h3>
            <Close onClick={() => deleteUser(user)} />
          </div>
        })}

        <div className={styles.ca_list_main} >
          {/*<h4>Select user with shared</h4>*/}
          <div className={styles.ca_list}  >

            {Users?.map((employ, i) => {
              return <div onClick={() => handleUserClick(employ)} key={employ._id} className={styles.ca_list_user} >
                <div className={styles.ca_list_user_name} >
                  <ProfileImage id={employ._id} size={40} />
                  <div>
                    <h4>{employ.firstName} {employ.lastName}</h4>
                    <p>{employ.email}</p>
                  </div>
                </div>
                {selectedUser.filter((id) => id == employ).length != 0}
                {/*<select><option>Editer</option><option>Owner</option><option>Remove</option> </select>*/}
              </div>

            })}
          </div>

          <div className={styles.ca_btn} >
            <button onClick={handleSubmitClick}>Done</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddMemberPopup