import React, { useState, useContext, useEffect } from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import Link from 'next/link'
// import {
//   Parent,
//   LinkParentIcon,
//   LinkParentChild,
//   UserParentText,
//   LinkParentIconText,
//   UserParentTextSubParent,
//   LinkParent,
//   TopParent,
//   UserParentSubText,
//   TopParentText,
//   UserParentImg,
//   UserParent,
//   UserParentTextParent,
// } from './style'
import SideBarProfilePopup from '../Popups/Hr/SideBarProfilePopup'
import { ParentStore } from '../../../pages/_app'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { SidebarDataSA, SidebarDataHR, SidebarDataEMP, SidebarDataPA, SidebarDataRB, SidebarDataSTL } from '../../Constants/Sidebar'
import TimeLog from '../TimeLog/TimeLog'
import { Badge } from '@mui/material'
import { getEmployeeTODOCountController } from '../../Controllers/Employee/index'
import ProfileImage from '../ProfileImage/Image'

function SideBar() {
  const [Route, setRoute] = useState('')
  const [sideBarProfileOpen, setSideBarProfileOpen] = useState(false)
  let { ParentState, setParentState } = useContext(ParentStore)
  const context = useContext(ParentStore)
  let role;
  if (context?.ParentState?.auth?.role) role = context?.ParentState?.auth?.role
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState("/admin/dashboard")
  const [todoCount, setTodoCount] = useState(0)

  useEffect(() => {
    setCurrentUrl(router.pathname)
    fetchTodoCount()
  }, [])

  const logOutFunction = () => {
    toast.success('Loged out of the account')
    setTimeout(() => {
      setParentState(null)
      sessionStorage.removeItem('cache')
      window.location.replace('/auth/login')
    }, 500);
  }

  const fetchTodoCount = async () => {
    let todocount = await getEmployeeTODOCountController().then((response) => response.data.response.count)
    setTodoCount((todocount && todocount > 0) ? todocount : 0)
  }

  const SideLinks = ({ url, icon, label }) => {
    return (
      <Link href={url} className={currentUrl === url ? "active" : ""} >
        <div onClick={() => { setCurrentUrl(url) }} >
          {label === "To Do" && <Badge badgeContent={todoCount} color="error">{icon}</Badge>}
          {label !== "To Do" && [icon]}
          <h4>{label}</h4>
        </div>
      </Link>
    )
  }

  const roleArrays = {
    SA: SidebarDataSA,
    STL: SidebarDataSTL,
    HR: SidebarDataHR,
    EMP: SidebarDataEMP,
    RB: SidebarDataRB,
    PA: SidebarDataPA
  }

  return (
    <section className="sidebar" key={role}>
      <div className="head">
        <h1>VectorShades</h1>
      </div>
      <div className="child mt_4">
        {role !== undefined && roleArrays[role].map((item, index) => {
          if (item.url === "/admin/dashboard/employee/timesheet/") item.url = item.url + ParentState?.auth._id
          return <SideLinks url={item.url} icon={item.icon} label={item.heading} key={index} />
        })}
      </div>
      {/* {role === "EMP" && <TimeLog/>} */}
    </section>
  )
}

export default SideBar
