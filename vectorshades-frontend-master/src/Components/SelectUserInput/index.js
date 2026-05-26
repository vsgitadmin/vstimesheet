import { Close } from '@mui/icons-material';
import { Avatar, MenuItem } from '@mui/material';
import React, { useState } from 'react'
import { selectEmployeesController } from '../../Controllers/Filters/index'
import ProfileImage from '../ProfileImage/Image';
import OutsideClickHandler from 'react-outside-click-handler';

function SelectUserInput({ returnUser, createProject, deleteUser, label, noitce, createJob, rebar, noTitle, returnRaw, defaultData, createGroup, noSelectedUsers, multiSelect, limitedUsers, projectId }) {
    const [isUserSelected, setisUserSelected] = useState(defaultData ? true : false);
    const [isDropDownOpen, setIsDropdownOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(defaultData ? [defaultData] : []);
    const [allRebarSelected, setallRebarSelected] = useState(false)
    const [Users, setUsers] = useState([]);

    const searchEmployee = async (search) => {
        try {
            const emp = await selectEmployeesController({
                search: search.target.value,
                rebar: rebar === true,
                limitedUsers: limitedUsers ? limitedUsers : null,
                projectId: projectId ? projectId : null
            });
            setIsDropdownOpen(true)
            setUsers(emp.data.response.employee)
            return emp.data.response.employee
        } catch (err) { throw err }
    }

    const handleUserSelect = (user) => {
        if (multiSelect) {
            setSelectedUsers([...selectedUsers, user]);
            returnUser && returnUser([...selectedUsers, user]);

        } else {
            setSelectedUsers([user]);
            returnUser && returnUser(user);

        }
        setIsDropdownOpen(false);
        setisUserSelected(true);
    }

    const handleSelectAllRebarUsers = async () => {
        const currentState = !allRebarSelected
        setallRebarSelected(currentState)
        if (currentState === true) {
            const users = await searchEmployee({ target: { value: 'allRebar' } })
            setSelectedUsers(users)
            setisUserSelected(true)
            returnUser(users)
            setIsDropdownOpen(false)
        }
        else {
            setisUserSelected(false)
            setUsers([])
        }
    }

    const handleUserRemove = (user) => {
        const updatedUsers = selectedUsers.filter((selectedUser) => selectedUser._id !== user._id);
        setSelectedUsers(updatedUsers);
        if (updatedUsers.length === 0) {
            setisUserSelected(false);
        }
        returnUser && returnUser(updatedUsers)
    }

    return (
        <OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)} >
            {rebar && createProject === true && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                    type="checkbox"
                    style={{ width: 'max-content' }}
                    checked={allRebarSelected}
                    onChange={handleSelectAllRebarUsers}
                />
                <label htmlFor="selectAllRebarUsers" style={{ fontSize: '13px' }}>
                    Select All Rebar Users
                </label>
            </div>}

            <div style={{ position: "relative" }} className={`award_add_user ${createJob && `create_job_add_user`}`} >
                {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        style={{ width: 'max-content' }}
                        checked={allRebarSelected}
                        onChange={handleSelectAllRebarUsers}
                    />
                    <label htmlFor="selectAllRebarUsers" style={{ fontSize: '13px' }}>
                        Select All Rebar Users
                    </label>
                </div> */}
                {noTitle === true && allRebarSelected === false ? null : <label>{label ? label : (isUserSelected) ? "Selected User" : "Add User"}</label>}
                {allRebarSelected && <label>{selectedUsers.length} Users Added (<span style={{ color: 'grey' }}>Existing Project Users Will be Ignored</span>)</label>}
                {(isUserSelected && !noSelectedUsers) &&
                    <div className={`award_selected_users ${noitce && 'notice_add_user'} } `}>
                        {selectedUsers.map((user) => (
                            <div key={user._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, paddingTop: "5px" }}>
                                <ProfileImage id={user._id} size="25px" />
                                <h3 style={{ marginLeft: 8, display: 'flex', gap: "4px", fontSize: "13px" }}>
                                    <span>{user.firstName}</span>
                                    <span>{user.lastName}</span>
                                </h3>
                                <Close style={{ position: "absolute", right: 10}} onClick={() => handleUserRemove(user)} />
                            </div>
                        ))}
                    </div>}
                {(!isUserSelected || multiSelect) && !allRebarSelected && <input className='notice_input' placeholder='Search User' onChange={searchEmployee} type='text' />}
                {isDropDownOpen &&
                    <div className='list_style' style={{ top: createGroup && '47px' }} >
                        {Users.map((user) => (
                            <MenuItem key={user._id} value={user._id} onClick={() => handleUserSelect(user)}>
                                <div style={{ marginRight: 8, height: 24 }} >
                                    <ProfileImage id={user._id} size="25px" />
                                </div>
                                {user.firstName} {user.lastName}
                            </MenuItem>
                        ))}
                    </div>
                }
            </div>
        </OutsideClickHandler>
    )
}

export default SelectUserInput