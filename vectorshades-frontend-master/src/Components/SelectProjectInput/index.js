import { Close } from '@mui/icons-material';
import { Avatar, MenuItem } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { selectProjectController } from '../../Controllers/Filters/index'
import ProfileImage from '../ProfileImage/Image';
import OutsideClickHandler from 'react-outside-click-handler';
import { ParentStore } from '../../../pages/_app';

function SelectProjectInput({ returnProject, deleteUser, noitce, createJob, noTitle, returnRaw, defaultData, createGroup, noSelectedUsers, multiSelect }) {
    const [isDropDownOpen, setIsDropdownOpen] = useState(false);
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState()
    const [search, setSearch] = useState('')


    const fetchProjects = async (s) => {
        selectProjectController({search:s}).then((res) => {
            const data = res.data.response.project
            setProjects(data)
        })
    }

    useEffect(() => {
        returnProject(selectedProject)
    }, [selectedProject])

    useEffect(() => {
        fetchProjects(search)
    }, [search])


    return (
        <OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)} >
            <div style={{ position: "relative" }}  >
                {/* {noTitle === true ? null : <label>{(selectedProject) ? "Selected User" : "Add User"}</label>} */}
                {!selectedProject && <input className='notice_input' placeholder='Search Project' onChange={(e) => setSearch(e.target.value)} type='text' onClick={() => setIsDropdownOpen(true)} />}
                {selectedProject && <div className={`award_selected_users ${noitce && 'notice_add_user'} ${createJob && 'create_job_user'} } `}>
                    <h3>{selectedProject.projectName}</h3>
                    <Close onClick={() => {
                        setSelectedProject(null)
                    }} />
                </div>}
                {((!selectedProject && isDropDownOpen) | (multiSelect && isDropDownOpen)) ?
                    //<OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)} >
                    <div className='list_style' style={{ top: '42px' }} >
                        {projects?.map((project) => (
                            <MenuItem key={project._id} value={project._id} onClick={() => {
                                setSelectedProject(project)
                                setIsDropdownOpen(false)
                            }}>
                                {project.projectName}
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

export default SelectProjectInput