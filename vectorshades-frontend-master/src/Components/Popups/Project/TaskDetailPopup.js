import { AccessTime, Add, AlarmOn, CalendarMonth, Comment, Delete, Description, Edit, EditOutlined, EventAvailable, EventNote, Info, MoneyOutlined, PauseCircleFilled, People, Person, PlayArrow, PlayCircleFilled, RefreshOutlined } from '@mui/icons-material'
import { Avatar, Divider, Modal, Tab, Tabs, Tooltip } from '@mui/material'
import { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { editSingleTasksController, getSingleTasksController, getTaskActivityController, updateTaskActivityController, deleteTaskActivityController, createTaskActivityController, refreshTaskHrsController } from '../../../Controllers/projects/index'
import ToDoPopup from './ToDoPopup';
import ProfileImage from '../../ProfileImage/Image'
import styles from './Popup.module.css'
import OutsideClickHandler from 'react-outside-click-handler';
import { ParentStore } from '../../../../pages/_app';
import Loader from '../../Loader/loader';
import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone';
import ActualHourPopup from './ActualHourPopup';
import TaskActivity from '../../ActiveTasks/TaskActivity';
import { broadcastTaskStatusUpdate, onTaskStatusUpdate } from '../../../Utils/taskStatusEvents';

const TaskDetailPopup = ({ taskPopup, setTaskPopup, deleteTask, id, project, editTask, render, projectData }) => {
  const [showAddUser, setShowAddUser] = useState(false)
  const [toDoPopupOpen, setToDoPopupOpen] = useState(false)
  const [LoadAgain, setLoadAgain] = useState(false)
  const [actualHourPopup, setactualHourPopup] = useState(false)
  const formatDate = date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(',', '');
  const [taskData, settaskData] = useState(null)
  const created_at = formatDate(taskData?.createdAt);
  const updated_at = formatDate(taskData?.updatedAt);
  const due_date = formatDate(taskData?.dueDate);
  const [Activity, setActivity] = useState([])
  const [isClickCommentBox, setIsClickCommentBox] = useState(false);
  const { ParentState, setParentState } = useContext(ParentStore);
  const [activityMessage, setactivityMessage] = useState(null)
  const popupRef = useRef()
  const [selectedTab, setSelectedTab] = useState(0)
  const [isEditing, setIsEditing] = useState(false);
  const isAdminUser = isUserRoleAD()

  useEffect(() => {
    getInitialTasktaskData()
    // getTaskActivity()
  }, [])

  useEffect(() => {
    if (isClickCommentBox && popupRef.current) {
      popupRef.current.scrollTop += 40;
    }
  }, [isClickCommentBox]);

  // reflect status changes made elsewhere (e.g. pause/resume from the
  // floating working widget) into this same popup, live, if it's open for
  // that same task
  useEffect(() => {
    return onTaskStatusUpdate((changes) => {
      if (!taskData || changes.id !== taskData._id) return
      settaskData((prev) => ({ ...prev, ...changes }))
    })
  }, [taskData?._id]);



  const getInitialTasktaskData = () => {
    getSingleTasksController({ id, project }).then((data) => {
      settaskData(data.data.response.data)
    }).catch((err) => {
      console.log(err)
      toast.error('error while fetching tasks')
    })
  }

  const createTaskActivityHandler = () => {
    const body = { taskId: id, text: activityMessage, type: 'message' }
    createTaskActivity(body)
  }

  const getTaskActivity = () => {
    getTaskActivityController({ task: id, project, type: 'message' }).then(({ data }) => {
      setActivity(data.response.data)
    }).catch((err) => {
      toast.error("failed to fetch task activity")
    })
  }

  const createTaskActivity = (body) => {
    createTaskActivityController(body, { project }).then(() => {
      getTaskActivity()
      setIsClickCommentBox(false)
      setactivityMessage(null)
    }).catch((err) => {
      toast.error("failed to create task activity")
    })
  }

  const deleteTaskActivity = (id) => {
    deleteTaskActivityController({ project, id }).then(() => {
      getTaskActivity()
      toast.success("Task activity deleted successfully")
    }).catch((err) => {
      toast.error("failed to delete task activity")
    })
  }

  const refreshTaskHrs = () => {
    refreshTaskHrsController(id).then(() => {
      render()
      toast.success("Task Hrs Refreshed successfully")
    }).catch((err) => {
      toast.error("failed to refresh Hrs")
    })
  }

  const updateTaskActivity = (body) => {
    updateTaskActivityController(body, { project, id }).then(() => {
      getTaskActivity()
      toast.success("Task activity updated")
    }).catch((err) => {
      console.log("Unable to delete task activity")
    })
  }

  const handleClose = () => setTaskPopup(false)

  const editTaskHandler = (body, message) => {
    if (isEditing) return; 
    setIsEditing(true);

    body = { ...body, id: taskData._id };

    editSingleTasksController(body, { project: taskData.projectId })
      .then(() => {
        toast.success(message);
        settaskData({ ...taskData, ...body });
        setLoadAgain(true);
        broadcastTaskStatusUpdate(body);
      })
      .catch((err) => {
        console.log(err.message);
        toast.error('Task update failed');
      })
      .finally(() => {
        setIsEditing(false); // ✅ Unlock after complete
      });
  };

  function formatHoursToHm(value) {
    value = parseFloat(value)
    if (typeof value === 'string') value = parseFloat(value.replace(',', '.'));
    if (typeof value !== 'number' || Number.isNaN(value)) throw new TypeError('value must be a number or numeric string');

    const sign = value < 0 ? '-' : '';
    const absVal = Math.abs(value);
    let hours = Math.floor(absVal);
    let minutes = Math.round((absVal - hours) * 60);

    if (minutes === 60) {
      hours += 1;
      minutes = 0;
    }

    return `${sign}${hours} h ${minutes} m`;
  }

  // pushes/updates the floating "currently working" widget (rendered globally
  // in the Layout) so pause/resume stays reachable from any page, not just
  // from this popup
  const pushActiveWorkingTask = (status, startedOn) => {
    setParentState(prev => ({
      ...prev,
      activeWorkingTask: {
        id: taskData._id,
        projectId: taskData.projectId,
        projectName: projectData?.projectName,
        taskName: taskData.name,
        section: taskData.section,
        status,
        startedOn,
      }
    }))
  }

  const clearActiveWorkingTask = () => {
    setParentState(prev => {
      if (!prev?.activeWorkingTask || prev.activeWorkingTask.id !== taskData._id) return prev
      const { activeWorkingTask, ...rest } = prev
      return rest
    })
  }

  // if this popup is opened for a task that's already being worked on
  // (in progress/paused, e.g. after a page reload), bring the widget back
  useEffect(() => {
    if (!taskData || taskData.completed) return
    if (taskData.assignedTo !== ParentState?.auth?._id) return
    if (['In Progress', 'Paused'].includes(taskData.status)) {
      pushActiveWorkingTask(taskData.status, taskData.startedOn || new Date())
    }
  }, [taskData?._id, taskData?.status])

  const startWorkingFunction = () => {
    const startedOn = new Date()
    editTaskHandler({ startedOn, status: 'In Progress' }, 'Task moved to In Progress')
    pushActiveWorkingTask('In Progress', startedOn)
  }

  const pauseWorkingFunction = () => {
    editTaskHandler({ status: 'Paused' }, 'Task Paused Successfully')
    pushActiveWorkingTask('Paused', taskData.startedOn)
  }

  const resumeWorkingFunction = () => {
    const startedOn = new Date()
    editTaskHandler({ status: 'In Progress', startedOn }, 'Task Resumed Successfully')
    pushActiveWorkingTask('In Progress', startedOn)
  }

  const markAsCompleteFunction = () => {
    if (projectData.rebar === true) setactualHourPopup(true)
    else {
      editTaskHandler({ completed: true, status: "Completed" }, 'Task marked as completed')
      clearActiveWorkingTask()
    }
  }

  const markAsReviewFunction = () => {
    if (projectData.rebar === true) setactualHourPopup(true)
    else {
      editTaskHandler({ status: "Review" }, 'Task marked as In Review')
      clearActiveWorkingTask()
    }
  }

  const markRebarTaskCompleted = (actualHours, tonsDetailed) => {
    setactualHourPopup(false)
    editTaskHandler({ completed: true, status: "Completed", actualHours, tonsDetailed }, 'Task marked as completed')
    clearActiveWorkingTask()
  }

  function isUserRoleAD() {
    const userId = ParentState?.auth?._id;
    const userMember = projectData.membersByName.find(member => member._id === userId);
    if (userMember && userMember.role === 'AD') return true;
    else return false;
  }


  return (
    <>

      <Modal open={taskPopup} onClose={() => {
        if (LoadAgain) render()
        handleClose()
      }} >
        <div className={styles.task_detail}>
          <div className={styles.task_detail_main} key={taskData} ref={popupRef} >
            {actualHourPopup && <ActualHourPopup rebar={taskData.type === 'rebar'} closePopup={() => setactualHourPopup(false)} submit={markRebarTaskCompleted} />}
            {taskData ? <>
              <ToDoPopup toDoPopupOpen={toDoPopupOpen} setToDoPopupOpen={setToDoPopupOpen} />
              <div className={styles.task_title} >
                <h2>{taskData.name}</h2>
                {taskData.completed && <button className={styles.label}>Completed</button>}
                {taskData.completed === false && taskData.assignedTo == ParentState.auth._id &&
                  <div>
                    {['In Progress', 'Paused'].includes(taskData.status) && <button className={styles.status} onClick={markAsReviewFunction}><CheckCircleOutlineTwoToneIcon />Request Review</button>}
                    {taskData.status === 'In Progress' && <button className={styles.status} onClick={pauseWorkingFunction}><PauseCircleFilled />Pause</button>}
                    {taskData.status === 'queued' && <button className={styles.status} onClick={startWorkingFunction}><PlayCircleFilled />Start Working</button>}
                    {taskData.status === 'Paused' && <button className={styles.status} onClick={resumeWorkingFunction}><PlayArrow />Resume Working</button>}
                    {taskData.status === 'Review' && projectData.rebar === false && <button className={styles.status} onClick={resumeWorkingFunction}><PlayArrow />Move To In Work</button>}
                  </div>
                }
                {taskData.status === 'Review' && isUserRoleAD() | taskData.assignedBy == ParentState.auth._id && projectData.rebar === false && <div>
                  {taskData.status === 'Review' && <button className={styles.status} onClick={markAsCompleteFunction}><CheckCircleOutlineTwoToneIcon />Mark As Complete</button>}
                  {taskData.status === 'Review' && projectData.rebar === false && <button className={styles.status} onClick={pauseWorkingFunction}><PlayArrow />Move To In Work</button>}
                </div>}
              </div>
              {taskData.section !== 'Rework' && <div className={styles.task_progress_bar}>
                <div style={{ width: `${(taskData.completedHours / taskData.allocatedHours) * 100}%`, maxWidth: '100%' }} className={styles.task_progress_bar_inner}></div>
              </div>}

              <div className={styles.task_edit_priority} >
                <h2 style={{ color: 'grey' }}>#{taskData.taskIndex}</h2>
                {taskData.priority === "Relaxed" && <div className="relaxed" >{taskData.priority}</div>}
                {taskData.priority === "Critical" && <div className="critical" >{taskData.priority}</div>}
                {taskData.priority === "High" && <div className="high" >{taskData.priority}</div>}
                {taskData.priority === "Medium" && <div className="medium" >{taskData.priority}</div>}
                {isUserRoleAD() | ParentState.auth.email === 'jemilan@vectorshades.com' && !taskData.completed && <button onClick={() => {
                  editTask(taskData)
                }}><Edit /></button>}
                {isUserRoleAD() && <button onClick={deleteTask}><Delete /></button>}
                {ParentState?.auth?.email === 'jemilan@vectorshades.com' && <button onClick={refreshTaskHrs}> <RefreshOutlined /></button>}
              </div>

              <div className={styles.task_hori} >

                {/* task details start */}
                <div className={styles.task_items} >
                  <div className={styles.task_desc} style={{ marginBottom: "10px" }} >
                    <h3><Info />General Info</h3>
                  </div>
                  <div className={styles.task_item} >
                    <h3><CalendarMonth style={{ fill: "grey" }} />Created At</h3>
                    <h3>{created_at}</h3>
                  </div>
                  <div className={styles.task_item} >
                    <h3><EventNote style={{ fill: "grey" }} />Updated At</h3>
                    <h3>{updated_at}</h3>
                  </div>
                  <div className={styles.task_item} >
                    <h3><AlarmOn style={{ fill: "grey" }} />Completed Hours</h3>
                    <h3>{formatHoursToHm(taskData.completedHours.toFixed(2))}</h3>
                  </div>
                  <div className={styles.task_item} >
                    <h3><MoneyOutlined style={{ fill: "grey" }} />Billable</h3>
                    <h3>{taskData.billable ? 'Yes' : 'No'}</h3>
                  </div>
                  {taskData.drawing && <div className={styles.task_item} >
                    <h3><AccessTime style={{ fill: "grey" }} />Drawing</h3>
                    <h3>{taskData.drawing}</h3>
                  </div>}
                  {taskData.section !== 'Rework' && <div className={styles.task_item} >
                    <h3><AccessTime style={{ fill: "grey" }} />Allocated Hours</h3>
                    <h3>{taskData.allocatedHours}h</h3>
                  </div>}
                  {taskData.actualHours !== undefined && <div className={styles.task_item} >
                    <h3><AccessTime style={{ fill: "grey" }} />Actual Hours</h3>
                    <h3>{taskData.actualHours}h</h3>
                  </div>}
                  {/* {taskData.processedHours !== undefined && <div className={styles.task_item} >
                    <h3><AccessTime style={{ fill: "grey" }} />Tracked Hours</h3>
                    <h3>{taskData.processedHours}h</h3>
                  </div>} */}
                  {taskData.section !== 'Rework' && <div className={styles.task_item} >
                    <h3><EventAvailable style={{ fill: "grey" }} />Due Date</h3>
                    <h3>{due_date}</h3>
                  </div>}

                  <div className={styles.task_item} >
                    <h3><Person style={{ fill: "grey" }} />Assigned By</h3>
                    <h3>{taskData.assignedByName}</h3>
                  </div>
                  <div className={styles.task_users} style={{ marginBottom: "10px" }} >
                    <h3><People />Users</h3>
                    <div>
                      <Avatar sx={{ width: 30, height: 30 }} size="small" src="https://cdn-icons-png.flaticon.com/512/147/147133.png" />
                      <h3>{taskData.assignedToName}</h3>
                    </div>
                  </div>
                  <div className={styles.task_desc} >
                    <h3><Description /> Description</h3>
                    <p>{taskData.description}</p>
                  </div>
                </div>
                {/* task details end */}

                {/* <Divider orientation="vertical" flexItem /> */}

                {/* task comments start */}
                <div className={styles.task_comment_container}>
                  <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
                    <Tab label="Activity" />
                  </Tabs>
                  <div style={{ width: "100%", display: 'flex', overflowX: "hidden" }}>
                    {selectedTab == 1 ? <div style={{ width: "100%" }}>
                      <div style={{ padding: "20px" }}>
                        <div className={styles.task_comment_title} >
                          <h3><Comment /> Comments</h3>
                        </div>
                        <OutsideClickHandler onOutsideClick={() => setIsClickCommentBox(false)} >
                          <div className={styles.task_comment_input} >
                            <ProfileImage size="42px" id={ParentState?.auth._id} />
                            {!isClickCommentBox && <div onClick={() => {
                              setIsClickCommentBox(true)
                            }} className={styles.click_box} >Write a comment...</div>}
                            {isClickCommentBox &&
                              <div className={styles.click_box_main} >
                                <textarea autoFocus type="text" placeholder='Write a comment...' onChange={(e) => setactivityMessage(e.target.value)} />
                                <div className={styles.save_btn} onClick={createTaskActivityHandler}>
                                  <button>SAVE</button>
                                </div>
                              </div>}
                          </div>
                        </OutsideClickHandler>
                      </div>
                    </div> :
                      <div style={{ width: "100%" }}>
                        <TaskActivity data={taskData.activities} />
                      </div>}
                  </div>


                  <div className={styles.task_user_comments}>
                    {Activity.map((activity) => {
                      return (
                        <div className={styles.task_user_comment} >
                          <div className={styles.task_comment_main}>
                            <ProfileImage size="38px" id={activity.createdBy.id} />
                            <div className={styles.task_comment_box} >
                              <h4>{activity.createdBy.name}</h4>
                              <div className={styles.task_comment_delete} >
                                <p>{activity.text}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                {/* task comments end */}

              </div>

            </> : <Loader />
            }
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TaskDetailPopup