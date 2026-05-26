import { AccessAlarmOutlined, AccessTime, AccessTimeOutlined, Add, AddCircleOutline, ArrowOutwardOutlined, ArticleOutlined, AttachFileOutlined, CalendarToday, CommentOutlined, FiberManualRecord, FilterAltOutlined, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight, MoreVert, NavigateNext, NotificationsOutlined, PeopleAltOutlined, PlayArrow, Search, TrendingFlat, TvOffOutlined, VideocamOutlined } from '@mui/icons-material'
import { Avatar, AvatarGroup } from '@mui/material'
import styles from '../../../styles/ActiveTasks.module.css'
import ProfileImage from '../ProfileImage/Image'
import { useRouter } from 'next/router'
import projectSections from '../../Constants/projectSections'
import { useContext, useState } from 'react'
import { ParentStore } from '../../../pages/_app'

const Home = ({ currentUserTasks, taskAnalytics, dashboardData, data }) => {
  const { ParentState } = useContext(ParentStore)

  const [sections, setsections] = useState(!data.rebar ? projectSections : data.linkedDepartments.map((e) => e.rebarType))
  const router = useRouter();

  const routeTask = (id) => {
    router.push({
      pathname: `/admin/dashboard/projects/${router.query.id}`,
      query: { taskpopup: id }
    });
  }

  const isValidToCreateTask = () => {
    const { membersByName } = data
    return (membersByName.find((user) => user._id === ParentState?.auth?._id))?.role == "AD" ? true : false
  }

  return (
    <>
      <div className={styles.milestones_main} >
        <div className={styles.task_summary_main} >
          <h4>Your summary</h4>
          <div className={styles.task_summary_box} >
            <div className={styles.pro_est} >
              <div className={styles.pro_est_top} >
                <ArticleOutlined style={{ fill: "grey" }} />
                <h5>User Tasks</h5>
              </div>
              <div className={styles.pro_est_mid} >
                <div className={styles.pro_est_mid_box} >
                  <div><TvOffOutlined style={{ fill: "white" }} fontSize="small" /></div>
                  <h5>Total Tasks</h5>
                  <h4>{currentUserTasks.totalSelfTasks}</h4>
                </div>
                <div className={styles.pro_est_mid_box} >
                  <div><AddCircleOutline style={{ fill: "white" }} /></div>
                  <h5>Completed Tasks</h5>
                  <h4>{currentUserTasks.completedSelfTasks}</h4>
                </div>
                <div className={styles.pro_est_mid_box} >
                  <div><ArticleOutlined style={{ fill: "grey" }} fontSize="small" /></div>
                  <h5>Incompleted Tasks</h5>
                  <h4>{currentUserTasks.incompletedSelfTasks}</h4>
                </div>
              </div>
              {/* <div className={styles.pro_est_bottom} >
                <p>On time completion rate:</p>
                <h3>94<span>%</span></h3>
                <div><ArrowOutwardOutlined style={{ fill: "white" }} fontSize="10px" />2.3%</div>
              </div> */}
            </div>
            <div className={styles.vertical_border} ></div>
            <div className={styles.our_team_main} >
              <div className={styles.our_team_top} >
                <PeopleAltOutlined style={{ fill: "grey" }} />
                <h5>Our Team</h5>
              </div>
              <div className={styles.our_team_mid} >
                {data.members.slice(0, 3).map((member) => {
                  return <ProfileImage id={member} />
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isValidToCreateTask() && <>
        <div className={styles.tasks_top_bar} style={{ paddingLeft: "33.6px", marginTop: "0px" }} >
          <h4>Task Analytics</h4>
        </div>

        <div className={styles.pro_details_main} >
          <div className={styles.first_box} >
            <div className={styles.box} >
              <div><h2>{taskAnalytics.totalTasks}</h2><MoreVert style={{ fill: "white" }} /></div>
              <h3>Total Tasks</h3>
            </div>
            <div className={styles.box} >
              <div><h2>{taskAnalytics.completed}</h2><MoreVert style={{ fill: "grey" }} /></div>
              <h3>Completed Tasks</h3>
            </div>
            <div className={styles.box} >
              <div><h2>{taskAnalytics.in_progress}</h2><MoreVert style={{ fill: "grey" }} /></div>
              <h3>In-progress Tasks</h3>
            </div>
            <div className={styles.box} >
              <div><h2>{taskAnalytics.due}</h2><MoreVert style={{ fill: "grey" }} /></div>
              <h3>On Due Tasks</h3>
            </div>
          </div>
          <div className={styles.third_box} >
            <h3>Section Analytics</h3>
            <div className={styles.third_box_progress_bars} >
              {sections.map((section) => {
                const filtered = dashboardData.sectionAnalytics.filter((data) => data._id === section)
                return (
                  <div className={styles.third_box_progress_bar_main} >
                    <div>
                      <span>{section}</span>
                      <span>{filtered.length > 0 ? `${filtered[0].totalCompletedHours.toFixed(2)}Hr/${filtered[0].totalAllocatedHours}Hrs` : `0/0`}</span>
                    </div>
                    <div className={styles.progress_bar}  >
                      <div style={{ width: filtered.length > 0 ? `${(filtered[0].totalCompletedHours / filtered[0].totalAllocatedHours) * 100}%` : `0%`, background: "#4caf50" }} ></div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

        <div className={styles.tasks_top_bar} style={{ paddingLeft: "33.6px", marginTop: "0px" }} >
          <h4>Task Analytics</h4>
        </div>
        <div className={styles.task_table}>
          <div className={styles.task_table_child} >
            <table>
              <tr>
                <th>Task Name</th>
                <th>Status</th>
                <th>Tag</th>
                <th>Time Tracking</th>
                <th>Assignee</th>
                <th>Due Date</th>
              </tr>
              {dashboardData?.taskRecent.map((task, index) => {
                return (
                  <tr onClick={() => routeTask(task._id)}>
                    <td>{task.name}</td>
                    <td>{task.status}</td>
                    <td>
                      <div className='relaxed' >
                        {task.priority}
                      </div>
                    </td>
                    <td>
                      {task.completedHours} Hrs of {task.allocatedHours} Hrs
                    </td>
                    <td>
                      <ProfileImage size={"30px"} id={task.assignedTo} />
                      {task.assignedToName}
                    </td>
                    <td>
                      {task.createdAt}
                    </td>
                  </tr>
                )
              })}

            </table>
          </div>
        </div>
      </>}


    </>
  )
}

export default Home