import { CalendarToday, FilterAltOutlined, FlagOutlined, KeyboardArrowDown, Search, TrendingFlat } from '@mui/icons-material'
import Router, { useRouter } from 'next/router'
import { useState } from 'react'
import CreateProjectPopup from '../Popups/Project/CreateProjectPopup'
import styles from '../../../styles/ActiveTasks.module.css'
import Home from './Home'
import TasksComponent from './Tasks'
import TeamTable from '../TeamTable/TeamTable'
import Activity from './Activity'
import { useEffect } from 'react'
import ProjectTODOBoard from '../ProjectTODO/Bord'
import ProjectSettings from './ProjectSettings'
import ConfirmationPopup from '../Popups/Hr/ConfirmationPopup'
import ProjectCloud from '../ProjectCloud/ProjectCloud'
import { ParentStore } from '../../../pages/_app'
import { useContext } from 'react'
import { completeProjectController } from '../../Controllers/projects/index'
import { toast } from 'react-toastify'
import Main from '../Chat/Main'
import Drawing from '../Drawing/Drawing'
import Submissions from '../../../pages/admin/dashboard/jobs/submissions'

const ActiveTasks = ({ data, Tasks, project, dashboardData }) => {
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false)
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("home");
  const { ParentState } = useContext(ParentStore)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskpopup = urlParams.get('taskpopup');
    if (taskpopup) setActiveMenu('tasks')
  }, [router.query])

  const isValidToCreateTask = () => {
    if(ParentState?.auth?.role === 'SA') return true
    const { membersByName } = data
    return (membersByName.find((user) => user._id === ParentState?.auth?._id))?.role == "AD" ? true : false
  }

  const completeProject = async () => {
    try {
      await completeProjectController(data._id)
      toast.success("Project Marked Completed Successfully")
      Router.push('/admin/dashboard/projects')
    } catch (err) {
      console.log(err)
      toast.error("error occured while completing project")
    }
  }

  const percentageCompleted = data.rebar ? data.progress : (((data.hours / data.estimatedHours) * 100)>100?100:((data.hours / data.estimatedHours) * 100)).toFixed(2)
  const description = typeof data?.description === 'string' ? data.description : ''
  const shouldTruncateDescription = description.length > 100

  return (
    <>
      <div className={styles.ats_container} >
        <ConfirmationPopup
          confirmPopupOpen={confirmPopupOpen}
          setConfirmPopupOpen={setConfirmPopupOpen}
          title="Mark project as completed?"
          text="Upon confirming the project will be marked as completed and cannot be reverted back"
          action={completeProject}
        />
        <div className={styles.ats_left_side} >
          <div className={styles.ats_project_progress} >
            <h3>Project Progress: <span>{percentageCompleted}% Completed</span></h3>
            <div className={styles.ats_progress_bar} >
              <div style={{ width: `${percentageCompleted}%` }} ></div>
            </div>
          </div>
          <div className={styles.act_tasks_main} >
            <div className={styles.border_bottom} ></div>
            <div className={styles.act_tasks} >
              <div className={styles.act_text} >
                <h2>{data?.projectName} #{data?.projectNo}</h2>
                <p>
                  {shouldTruncateDescription ? description.slice(0, 100) : description}
                  {shouldTruncateDescription ? "..." : ""}
                </p>
              </div>
              {isValidToCreateTask() && !data.completed &&
                <div className={styles.act_flag} >
                  <div onClick={() => setConfirmPopupOpen(true)} ><FlagOutlined /></div>
                </div>
              }
            </div>
          </div>
          <div className={styles.tasks_top_bar} style={{ paddingLeft: "33.6px", marginTop: "10px" }} >
            <h4>Quick Links</h4>
          </div>
          <div className={styles.mini_quick_links} >
            <div style={{border: activeMenu === "home" ? '2px solid var(--redTheme)' : '2px solid transparent'}} onClick={() => setActiveMenu("home")} className={styles.quick_link_box} >
              <div className={styles.sub_card} >PRO</div>
              <div className={styles.text_card} >Home</div>
              <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
            </div>
            <div style={{border: activeMenu === "tasks" ? '2px solid var(--redTheme)' : '2px solid transparent'}}  onClick={() => setActiveMenu("tasks")} className={styles.quick_link_box} >
              <div className={styles.sub_card} >PRO</div>
              <div className={styles.text_card} >Tasks</div>
              <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
            </div>
            {data.rebar && <div style={{border: activeMenu === "drawing" ? '2px solid var(--redTheme)' : '2px solid transparent'}} onClick={() => setActiveMenu("drawing")} className={styles.quick_link_box} >
              <div className={styles.sub_card} >PRO</div>
              <div className={styles.text_card} >Drawing</div>
              <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
            </div>
            }
            <div style={{border: activeMenu === "settings" ? '2px solid var(--redTheme)' : '2px solid transparent'}} onClick={() => setActiveMenu("settings")} className={styles.quick_link_box} >
              <div className={styles.sub_card} >PRO</div>
              <div className={styles.text_card} >Settings</div>
              <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
            </div>
            <div style={{border: activeMenu === "todo" ? '2px solid var(--redTheme)' : '2px solid transparent'}} onClick={() => setActiveMenu("todo")} className={styles.quick_link_box} >
              <div className={styles.sub_card} >PRO</div>
              <div className={styles.text_card} >To Do</div>
              <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
            </div>
            <div style={{border: activeMenu === "cloud" ? '2px solid var(--redTheme)' : '2px solid transparent'}} onClick={() => setActiveMenu("cloud")} className={styles.quick_link_box} >
              <div className={styles.sub_card} >PRO</div>
              <div className={styles.text_card} >Cloud</div>
              <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
            </div>
            <div style={{border: activeMenu === "activity" ? '2px solid var(--redTheme)' : '2px solid transparent'}} onClick={() => setActiveMenu("activity")} className={styles.quick_link_box} >
              <div className={styles.sub_card} >PRO</div>
              <div className={styles.text_card} >Activity</div>
              <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
            </div>
            {isValidToCreateTask() && <div style={{border: activeMenu === "submissions" ? '2px solid var(--redTheme)' : '2px solid transparent'}} onClick={() => setActiveMenu("submissions")} className={styles.quick_link_box} >
              <div className={styles.sub_card} >PRO</div>
              <div className={styles.text_card} >Submissions</div>
              <div className={styles.icon_card} ><div><TrendingFlat /></div></div>
            </div>}
            
          
          </div>
          {activeMenu === "home" && <Home currentUserTasks={dashboardData.currentUserTasks} dashboardData={dashboardData} taskAnalytics={dashboardData.taskAnalytics} data={data} />}
          {activeMenu === "tasks" && <TasksComponent project={data._id} projectDetails={data} />}
          {activeMenu === "drawing" && <Drawing data={data}/>}
          {activeMenu === "settings" && <TeamTable data={data.membersByName} id={data._id} project={data} />}
          {activeMenu === "todo" && <ProjectTODOBoard project={project} />}
          {activeMenu === "cloud" && <ProjectCloud />}
          {activeMenu === "activity" && <Activity dashboardData={dashboardData} />}
          {activeMenu === "chat" && <Main ParentStore={ParentStore} />}
          {activeMenu === "submissions" && <Submissions project={data}/>}
        </div>
        {/* <RightSide dashboardData={dashboardData} /> */}
      </div>
    </>
  )
}

export default ActiveTasks