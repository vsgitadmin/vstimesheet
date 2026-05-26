import {
  Add,
  Close,
  DeleteOutlineOutlined,
} from '@mui/icons-material'
import { Avatar, Modal } from '@mui/material'
import { useState, useEffect, useContext, useRef } from 'react'
import styles from '../../../styles/ActiveTasks.module.css'
import AddUserPopup from '../Popups/Project/AddUserPopup'
import { getProjectMembersController, removeProjectMembersController, toogleEmployeeRoleInProjectController, generateProjectReportsController, editSingleProjectController } from '../../Controllers/projects/index'
import { toast } from 'react-toastify'
import { ParentStore } from '../../../pages/_app'
import ProfileImage from '../ProfileImage/Image'
import ConfirmationPopup from '../Popups/Hr/ConfirmationPopup'
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { StyledTable } from '../Table/Table.Styled'
import ReportView from '../General/ReportView'

const TeamTable = ({ data, id, project }) => {
  const { ParentState } = useContext(ParentStore)
  const [users, setusers] = useState([])
  const [addUserPopup, setAddUserPopup] = useState(false)
  const [activeMenu, setActiveMenu] = useState("team")
  const [ConfirmDeletePopup, setConfirmDeletePopup] = useState(false)
  const [selectedUserForDeletion, setselectedUserForDeletion] = useState(null)
  const reportViewRef = useRef()


  useEffect(() => {
    getMembers()
  }, [])


  const getMembers = async () => {
    try {
      const data = await getProjectMembersController({ project: id })
      setusers(data.data.response.data)
    } catch (err) {
      console.log(err)
      toast.error('error occurred')
    }
  }


  const removeMembers = async (user) => {
    try {
      const data = await removeProjectMembersController({ project: id, user })
      getMembers()
      toast.success("Member removed successfully")
    } catch (err) {
      console.log(err)
      toast.error('error occurred')
    }
  }

  const generateEmployeeHourReport = async (user) => {
    reportViewRef.current.openView(generateProjectReportsController, { id: user._id, project: id, type: 'projectEmployeeTasksReport', key: user.email })
  }

  const generateEmployeeHourBillingReport = async (user) => {
    reportViewRef.current.openView(generateProjectReportsController, { id: user._id, project: id, type: 'projectEmployeeTasksBillingReport', key: user.email })
  }

  const generateProjectProductionReport = async () => {
    reportViewRef.current.openView(generateProjectReportsController, { id: id, type: 'projectEmployeeReport', key: project.name })
  }

  const generateProjectTaskBillingReport = async () => {
    reportViewRef.current.openView(generateProjectReportsController, { id: id, type: 'ProjectTasksBilling', key: project.name })
  }

  const generateProjectTaskReport = async () => {
    reportViewRef.current.openView(generateProjectReportsController, { id: id, type: 'projectReport', key: project.name })
  }

  const generateProjectEmployeeBillingReport = async () => {
    reportViewRef.current.openView(generateProjectReportsController, { id: id, type: 'projectBillingReport', key: project.name })
  }

  const handleEditDescription = async (e) => {
    e.preventDefault()
    try {
      let description = e.target[0].value
      const body = { ...project }
      body.description = description
      await toast.promise(editSingleProjectController({ id: id, body: body }), {
        pending: 'Updating Description',
        success: 'Description Updated Successfully',
        error: 'Error Occured'
      })
    } catch (error) {
      console.log(error)
    }

  }

  const conditionEmails = [
    "boopathi.mani@vectorshades.com",
    "patturajan.g@vectorshades.com",
    "prathap.sengagoundar@vectorshades.com",
    "raghu.m@vectorshades.com",
    "anju.kh@vectorshades.com",
    "harikrishnan.m@vectorshades.com",
    "saranya_s@vectorshades.com",
    "dhanilkumar.m@vectorshades.com",
    "akhildas@vectorshades.com",
    "jemilan@vectorshades.com",
    "danbpaul3@gmail.com"
  ]


  const isValidToCreateTask = () => users.find((user) => user._id === ParentState?.auth?._id)?.role == "AD" ? true : false

  const toogleUserRole = async (userId) => {
    toogleEmployeeRoleInProjectController({ projectId: id, userId: userId })
      .then((response) => { toast.success("user role changed"); getMembers() })
      .catch((err) => toast.error("unable to process request"))
  }

  const RenderTable = () => {

    const adminEligible = users.find((user) => user._id === ParentState?.auth?._id)?.role == "AD" ? true : false

    return (
      <div className={styles.tt_table}>
        <div className={styles.tt_table_top}>
          <div className={styles.left}>
            <h4>Team members</h4>
            {users && <span>{users.length}  Users </span>}
          </div>
          <div className={styles.right}>
            {adminEligible && <button onClick={() => setAddUserPopup(true)} >
              <Add style={{ fill: 'white' }} />
              Add User
            </button>}
          </div>
        </div>
        <table>
          <tr>
            <th>
              <div>SL NO</div>
            </th>
            <th>Name</th>
            <th>Role</th>
            <th>Email address</th>
            <th>Designation</th>
            {(isValidToCreateTask() || conditionEmails.includes(ParentState?.auth?.email)) && <th>Edit</th>}
            {isValidToCreateTask() && <th>Pr Report</th>}
            {isValidToCreateTask() && <th>Billing Report</th>}
          </tr>
          {users.map((user, index) => {
            return (
              <tr key={user._id}>
                <td>
                  <div>{index + 1}</div>
                </td>
                <td>
                  <div>
                    <ProfileImage size={35} id={user._id} />
                    <h4>{user.firstName}</h4>
                  </div>
                </td>
                <td>
                  <div>{user.role == "AD" ? "Admin" : "Contributor"}</div>
                </td>
                <td>{user.email}</td>
                <td>
                  <div>{user.designation}</div>
                </td>
                {(adminEligible || conditionEmails.includes(ParentState?.auth?.email)) && <td>
                  {user.role == "AD" ? <div onClick={() => toogleUserRole(user._id)} style={{ cursor: 'pointer' }}><KeyboardDoubleArrowDownOutlinedIcon /> </div> : <div onClick={() => toogleUserRole(user._id)} style={{ cursor: 'pointer' }}><KeyboardDoubleArrowUpOutlinedIcon /></div>}
                </td>}
                {isValidToCreateTask() && <td style={{ cursor: 'pointer' }}>
                  <td onClick={() => generateEmployeeHourReport(user)}>
                    <CloudDownloadOutlinedIcon />
                  </td>
                </td>}
                {isValidToCreateTask() &&
                  <td style={{ cursor: 'pointer' }} onClick={() => generateEmployeeHourBillingReport(user)}>
                    <CloudDownloadOutlinedIcon />
                  </td>
                }

                {isValidToCreateTask() && <td onClick={() => { setselectedUserForDeletion({ id: user._id, name: user.firstName }); setConfirmDeletePopup(true) }}>
                  <DeleteOutlineOutlined />
                </td>}
              </tr>
            )
          })}
        </table>
        {ConfirmDeletePopup && <ConfirmationPopup action={() => removeMembers(selectedUserForDeletion.id)} text={`Are you sure you want to remove ${selectedUserForDeletion.name} From this project`} confirmPopupOpen={ConfirmDeletePopup} setConfirmPopupOpen={setConfirmDeletePopup} title={"Are you sure"} />}
      </div>
    )
  }

  const RenderProject = () => {
    return (
      <div>
        <h4 style={{ paddingTop: "30px" }}>Description</h4>

        <form onSubmit={handleEditDescription} style={{ paddingTop: "10px", display: "flex" }}>
          <textarea
            style={{ minHeight: "70px", minWidth: "400px" }}
            type="text"
            className={styles.default}
            placeholder="Description"
            defaultValue={project?.description}
          />
          <button
            type='submit'
            style={{
              border: "none",
              backgroundColor: "#E64848",
              marginLeft: "10px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              padding: "5px 20px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Save
          </button>
        </form>
        {isValidToCreateTask() && (
          <div>
            <div style={{ marginTop: "20px" }} className={styles.left}>
              <h4>Reports</h4>
            </div>
            <div className={styles.report_buttons}>
              <button onClick={() => generateProjectTaskReport()}>
                Production Report
              </button>
              <button onClick={() => generateProjectTaskBillingReport()}>
                Production Billing Report
              </button>
              <button onClick={() => generateProjectProductionReport()}>
                Employee Production Report
              </button>
              <button onClick={() => generateProjectEmployeeBillingReport()}>
                Employees Billing Report
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <AddUserPopup addUserPopup={addUserPopup} rebar={project.rebar} setAddUserPopup={setAddUserPopup} id={id} render={getMembers} />
      <div className={styles.tt_container}>
        <div className={styles.tt_top_bar}>
          <h2>Settings</h2>
          <div className={styles.top_bar_menu}>
            <ul>
              <li onClick={() => setActiveMenu("team")} className={`${activeMenu === "team" && styles.active}`}>Team</li>
              <li onClick={() => setActiveMenu("project")} className={`${activeMenu === "project" && styles.active}`}>Project</li>
            </ul>
          </div>
        </div>

        {activeMenu === "team" && <RenderTable />}
        {activeMenu === "delete" && "Delete Component"}
        {activeMenu === "project" && <RenderProject />}
        <ReportView ref={reportViewRef} />
      </div>
    </>
  )
}

export default TeamTable
