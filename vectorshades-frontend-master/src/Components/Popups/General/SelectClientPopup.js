import { Modal } from '@mui/material'
import styles from './Popup.module.css'
import SelectUserInput from '../../SelectUserInput/index'
import ProfileImage from '../../ProfileImage/Image'
import { useContext, useEffect, useState } from 'react'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { selectEmployeesController } from '../../../Controllers/Filters/index'
import { Close } from '@mui/icons-material'
import { toast } from "react-toastify";
import { ParentStore } from '../../../../pages/_app'

const SelectClientPopup = ({ title, subTitle, submit, multiSelect }) => {
  const [selectedClients, setSelectedClients] = useState([])
  const { ParentState } = useContext(ParentStore)
  const [clients, setClients] = useState(ParentState.config.client)

  const deleteClient = (c) => {
    setSelectedClients(selectedClients.filter((c2) => {
      return c !== c2
    }))
  }

  const handleUserClick = (c) => {
    if (selectedClients.includes(c)) {
      setSelectedClients(selectedClients.filter((c2) => {
        return c !== c2
      }))
    } else {
      setSelectedClients([c, ...selectedClients])
    }
  }

  const searchClient = (q) => {
    let search = q.target.value
    if (search == '') {
      setClients(ParentState.config.client)
    } else {
      setClients(
        ParentState.config.client.filter((c) => {
          return JSON.stringify(c).toLocaleLowerCase().includes(search.toLocaleLowerCase())
        })
      )
    }
  }

  const handleSubmitClick = () => {

  }

  return (
    <>
      <div className={styles.cloud_admin} >
        <div className={styles.ca_title} >
          <h2>{title}</h2>
          <p>{subTitle}</p>
        </div>
        <input className='notice_input' placeholder='Search User' onChange={searchClient} type='text' />
        {selectedClients.map((client) => {
          return <div key={client._id} className={`award_selected_users`}>
            <h3>{client.name}</h3>
            <Close onClick={() => deleteClient(client)} />
          </div>
        })}

        <div className={styles.ca_list_main} >
          <div className={styles.ca_list}  >

            {clients?.filter((c) => {
              return !selectedClients.includes(c)
            }).map((client, i) => {
              return <div style={{ border: 'solid 1px lightgray', marginBottom: '4px' }} onClick={() => handleUserClick(client)} key={client._id} className={styles.ca_list_user} >
                <div className={styles.ca_list_user_name} >
                  <div>
                    <h4>{client.name}</h4>
                    <p>{client.location}</p>
                  </div>
                </div>
                {selectedClients.filter((c) => c == client).length != 0}
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

export default SelectClientPopup