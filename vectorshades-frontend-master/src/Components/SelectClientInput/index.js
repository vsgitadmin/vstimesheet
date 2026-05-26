import { Close } from '@mui/icons-material';
import { Avatar, MenuItem } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { selectClientsController } from '../../Controllers/Filters/index'
import ProfileImage from '../ProfileImage/Image';
import OutsideClickHandler from 'react-outside-click-handler';
import { ParentStore } from '../../../pages/_app';

function SelectClientInput({ returnClient, deleteUser, noitce, createJob, noTitle, returnRaw, defaultData, createGroup, noSelectedUsers, multiSelect }) {
    const [isDropDownOpen, setIsDropdownOpen] = useState(false);
    const { ParentState } = useContext(ParentStore)
    const [clients, setClients] = useState(ParentState?.config?.filter((i) => { return i.type === 'client' })[0]?.configObjects)
    const [selectedClient, setselectedClient] = useState()

    const searchClient = async (search) => {
        try {
            let searchKey = search.target.value
            if (search == '') {
                setClients(ParentState?.config?.filter((i) => { return i.type === 'client' })[0]?.configObjects)
            } else {
                setClients(ParentState?.config?.filter((i) => { return i.type === 'client' })[0]?.configObjects.filter((c) => {
                    return c.name.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase())
                }))
            }
        } catch (err) { throw err }
    }

    useEffect(() => {
        returnClient(selectedClient)
    }, [selectedClient])


    return (
        <OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)} >
            <div style={{ position: "relative" }}  >
                {/* {noTitle === true ? null : <label>{(selectedClient) ? "Selected User" : "Add User"}</label>} */}
                {!selectedClient && <input className='notice_input' placeholder='Search Client' onChange={searchClient} type='text' onClick={() => setIsDropdownOpen(true)} />}
                {selectedClient && <div className={`award_selected_users ${noitce && 'notice_add_user'} ${createJob && 'create_job_user'} } `}>
                    <h3>{selectedClient.name}</h3>
                    <Close onClick={() => {
                        setselectedClient(null)
                    }} />
                </div>}
                {((!selectedClient && isDropDownOpen) | (multiSelect && isDropDownOpen)) ?
                    //<OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)} >
                    <div className='list_style' style={{ top: '42px' }} >
                        {clients?.map((client) => (
                            <MenuItem key={client._id} value={client._id} onClick={() => {
                                setselectedClient(client)
                                setIsDropdownOpen(false)
                            }}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </div>
                    //  </OutsideClickHandler>
                    : <></>

                }
            </div>
        </OutsideClickHandler>
    )
}

export default SelectClientInput