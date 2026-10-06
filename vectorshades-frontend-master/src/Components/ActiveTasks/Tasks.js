import {
  AccessAlarmOutlined,
  AccessTime,
  AlarmOn,
  AttachFileOutlined,
  CommentOutlined,
  DataObjectOutlined,
  Event,
  NavigateNext,
  Person,
  PersonOutline,
  PlayArrow,
  Schedule,
} from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import TaskDetailPopup from "../Popups/Project/TaskDetailPopup";
import styles from "../../../styles/ActiveTasks.module.css";
import CreateTaskPopup from "../Popups/Project/CreateTaskPopup";
import {
  getProjectTasksController,
  createTaskController,
  editSingleTasksController,
  getAssignedTasksController,
  getProjectTasksCountController,
  getProjectSectionsTasksCountController
} from "../../Controllers/projects/index";
import { toast } from "react-toastify";
import Loader from "../Loader/loader";
import { Avatar, Pagination, Tooltip } from "@mui/material";
import ProfileImage from "../ProfileImage/Image";
import { useRouter } from "next/router";
import projectSections from "../../Constants/projectSections";
import { ParentStore } from "../../../pages/_app";
import rebarSections from "../../Constants/rebarSections";
import { onTaskStatusUpdate } from "../../Utils/taskStatusEvents";

const Tasks = ({ project, projectDetails, generalOnly }) => {
  const { ParentState } = useContext(ParentStore)
  const [sections, setSections] = useState(generalOnly === true ? ['General'] : ['All', ...(!projectDetails.rebar ? projectSections : [...projectDetails.linkedDepartments.map((e) => e.rebarType), 'General'])])
  // const [sections, setSections] = useState(!projectDetails.rebar ? projectSections : rebarSections)
  // real, creatable sections - excludes the synthetic "All" tab, since a
  // task can't actually be created "in All"
  const creatableSections = sections.filter((s) => s !== 'All')
  // the backend treats "no section filter" (undefined) as "match every
  // section", so the "All" tab has to translate to that rather than the
  // literal string
  const toSectionParam = (s) => (s === 'All' ? undefined : s)
  const [taskPopup, setTaskPopup] = useState(false);
  const [createTaskPopup, setCreateTaskPopup] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [loadingApi, setloadingApi] = useState(false)
  const [selectedID, setSelectedID] = useState(0);
  const [editTaskDefaultData, setEditTaskDefaultData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const [yourTasksOpen, setYourTasksOpen] = useState(false)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(3)
  const [selectedTask, setSelectedTask] = useState()
  const [sectionTaskCounts, setSectionTaskCounts] = useState({})

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskpopup = urlParams.get('taskpopup');
    const group = urlParams.get('group');
    if (taskpopup) {
      setSelectedID(taskpopup)
      setTaskPopup(true)
      const queryParams = { ...router.query };

      // Remove the `taskpopup` parameter
      delete queryParams.taskpopup;

      // Update the URL without refreshing the page
      router.replace({
        pathname: router.pathname,
        query: queryParams
      });
    }
  }, []);

  function fetchCountController(project, section) {
    getProjectTasksCountController({ project, section }).then((res) => {
      setPageCount(Math.ceil(res.data.response.count / 6))
    }).catch((err) => {
      console.log(err)
    })
  }

  function fetchSectionTasksCountController(project, sections) {
    getProjectSectionsTasksCountController({ project, sections }).then((res) => {
      setSectionTaskCounts(res.data.response.count)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchCountController(project, toSectionParam(sections[selectedSection]))
    fetchProjectTasks(currentPage, toSectionParam(sections[selectedSection]));
  }, [selectedSection, currentPage])

  useEffect(() => {
    if (yourTasksOpen) fetchYourTasks(1)
    else fetchProjectTasks(1, toSectionParam(sections[selectedSection]));
  }, [yourTasksOpen])

  useEffect(() => {
    if (createTaskPopup == false) {
      setEditTaskDefaultData(null);
    }
  }, [createTaskPopup]);

  useEffect(() => {
    fetchSectionTasksCountController(project, creatableSections)
  }, [])

  // patch a task's status in place wherever it was changed from (the task
  // popup, or the floating working widget) instead of refetching the list
  useEffect(() => {
    return onTaskStatusUpdate((changes) => {
      setTasks((prev) => prev.map((t) => (t._id === changes.id ? { ...t, ...changes } : t)))
    })
  }, [])

  const createOrModifyTask = async (data) => {
    setloadingApi(true)
    data["projectId"] = project;
    if (editTaskDefaultData == null) {
      createTaskController(data).then(async () => {
        toast.success("Task Created Successfully");
        await fetchProjectTasks(1, toSectionParam(sections[selectedSection]));
        setCreateTaskPopup(false);
        setloadingApi(false)
      });
    } else {
      data["id"] = data["_id"];
      editSingleTasksController(data, { project }).then(async () => {
        setEditTaskDefaultData(null);
        toast.success("Task Edited Successfully");
        await fetchProjectTasks(1, toSectionParam(sections[selectedSection]));
        setCreateTaskPopup(false);
        setloadingApi(false)
      });
    }
  };

  const enableTaskPopup = (data) => {
    setEditTaskDefaultData(data);
    setTaskPopup(false);
    // setSelectedTask({});
    setCreateTaskPopup(true);
  };

  const fetchYourTasks = (page) => {
    getAssignedTasksController({ page, project })
      .then(({ data }) => {
        setTasks(data.response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("error occured while fetching tasks");
      });
  }

  const deleteTask = async () => {
    try {
      selectedTask.section = 'Closed'
      selectedTask.id = selectedTask._id
      await editSingleTasksController(selectedTask, { project })
      await fetchProjectTasks(1, toSectionParam(sections[selectedSection]));
      setTaskPopup(false)
      toast.success('Task Closed Successfully')
    } catch (err) {
      toast.error('unable to close task')
    }

  }

  const fetchProjectTasks = async (page, section) => {
    setTasks([])
    getProjectTasksController({ project, page, section })
      .then(({ data }) => {
        setTasks(data.response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("error occured while fetching tasks");
      });
  };

  const isValidToCreateTask = () => {
    const { membersByName } = projectDetails
    return (membersByName.find((user) => user._id === ParentState?.auth?._id))?.role == "AD" ? true : false
  }

  const isProjectMember = () => {
    const { membersByName } = projectDetails;
    return membersByName?.some(user => user._id === ParentState?.auth?._id) || false;
  };

  const renderTasks = () => {
    fetchProjectTasks(1, toSectionParam(sections[selectedSection]));
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

  const modifyTaskData = (data) => {
    setSelectedID(data._id)
    setSelectedTask(data)
  }

  if (Loading) return <Loader />;
  else
    return (
      <>
        {taskPopup && <TaskDetailPopup
          taskPopup={taskPopup}
          setTaskPopup={setTaskPopup}
          setTaskData={(e) => modifyTaskData(e)}
          id={selectedID}
          project={project}
          editTask={enableTaskPopup}
          deleteTask={deleteTask}
          render={renderTasks}
          projectData={projectDetails}
        />}

        {createTaskPopup && <CreateTaskPopup
          projectId={router.query.id}
          loading={loadingApi}
          edit={editTaskDefaultData !== null ? true : false}
          submit={createOrModifyTask}
          generalOnly={generalOnly}
          section={sections[selectedSection] === 'All' ? creatableSections[0] : sections[selectedSection]}
          sections={creatableSections}
          createTaskPopup={createTaskPopup}
          setCreateTaskPopup={setCreateTaskPopup}
          defaultData={editTaskDefaultData}
          members={projectDetails.membersByName}
          projectData={projectDetails}
        />}

        <div className={styles.tasks_main}>
          {!yourTasksOpen && <div className={styles.sub_secions}>
            {sections.map((section, index) => {
              // "All" has no count of its own from the backend - it's the
              // sum of every real section's count instead
              const count = section === 'All'
                ? Object.values(sectionTaskCounts).reduce((sum, c) => sum + c, 0)
                : (sectionTaskCounts[section] || 0)
              return (
                <h5
                  className={index === selectedSection && styles.active_link}
                  onClick={() => setSelectedSection(index)}
                >
                  {section}{` (${count})`}
                </h5>
              );
            })}
            <Tooltip title="View Your Tasks" >
              <PersonOutline onClick={async () => {
                await fetchYourTasks(1)
                setYourTasksOpen(true)
              }
              } >

              </PersonOutline>
            </Tooltip>
          </div>}
          <div className={styles.tasks_top_bar}>
            <h4>{yourTasksOpen ? "Your Tasks" : "Tasks"}</h4>
            <div>
              {projectDetails.rebar === true && isProjectMember() && <button className={styles.create_task_btn} onClick={() => setCreateTaskPopup(true)}>CREATE</button>}
              {(isValidToCreateTask() || conditionEmails.includes(ParentState?.auth?.email)) && !projectDetails.rebar && !yourTasksOpen && <button className={styles.create_task_btn} onClick={() => setCreateTaskPopup(true)}>CREATE</button>}
              {yourTasksOpen &&
                <Tooltip title="View All Tasks" >
                  <PersonOutline className={styles.view_all_tasks} onClick={() => {
                    setYourTasksOpen(false)
                  }}  ></PersonOutline>
                </Tooltip>}
              {/* <NavigateNext style={{fill:"grey"}} fontSize='10px' /> */}
            </div>
          </div>
          <div className={styles.tasks_boxes}>
            {tasks.map((data, i) => {
              const { createdAt, updatedAt , taskIndex } = data;
              const formatDate = (date) =>
                new Date(date)
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                  .replace(",", "");
              const created_at = formatDate(createdAt);
              const updated_at = formatDate(updatedAt);
              return (
                <div
                  onClick={() => {
                    setSelectedID(data._id);
                    setSelectedTask(data)
                    setTaskPopup(true);
                  }}
                  className={styles.tasks_box}
                >
                
                  <div className={styles.tb_1}>
                    <div>
                      <ProfileImage size={'100%'} id={data.assignedTo} />
                    </div>
                  </div>
                  <div className={styles.tb_3}>
                    <div className={styles.tb_title} >
                      <h4>{data.name}</h4>
                      {sections[selectedSection] === 'All' &&
                        <div className={styles.section_badge} >{data.section}</div>
                      }
                      {data.completed === true &&
                        <div className={styles.labels} >Completed</div>
                      }
                    </div>
                    <div className={styles.tb_3_ac}>
                      <div>
                        <div>
                          <Person style={{ fill: "grey", fontSize: "18px" }} />
                          <h4>Assigned To</h4>
                        </div>
                        <h5>{data.assignedToName}</h5>
                      </div>

                      <div>
                        <div>
                          <Schedule
                            style={{ fill: "grey", fontSize: "15px" }}
                          />
                        </div>
                        <h5>{data.allocatedHours}h</h5>
                      </div>
                      <div>
                        <div>
                          <AlarmOn style={{ fill: "grey", fontSize: "15px" }} />
                        </div>
                        <h5>{parseInt(data.completedHours)}h</h5>
                      </div>
                      <div>
                        <div>
                          <DataObjectOutlined style={{ fill: "grey", fontSize: "16px" }} />
                        </div>
                        <h5>#{taskIndex}</h5>
                      </div>
                      <div>
                        <div>
                          <Event style={{ fill: "grey", fontSize: "15px" }} />
                          <h4>Created At</h4>
                        </div>
                        <h5>{created_at}</h5>
                      </div>
                      <div>
                        <div>
                          <Event style={{ fill: "grey", fontSize: "15px" }} />
                          <h4>Updated At</h4>
                        </div>
                        <h5>{updated_at}</h5>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tb_5}>
                    <div>
                      <h5>{data.status}</h5>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {!yourTasksOpen && <div className='project_pagination' >
              <Pagination count={pageCount} onChange={(e, v) => { setCurrentPage(v) }} className='pagination-center' />
            </div>}
          </div>
        </div>
      </>
    );
};

export default Tasks;
