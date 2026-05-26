import { Search, Comment } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import ToDoPopup from '../Popups/Project/ToDoPopup'
import style from '../../../styles/Bord.module.css'
import { toast } from 'react-toastify'
import { debounce } from 'lodash';
import { getAllTasksController, getFilteredProjectTasks } from "../../Controllers/projects/index"
import Loader from '../Loader/loader'
import { useRouter } from 'next/router'

const ProjectTODOBoard = ({ project }) => {
  const [TODOitems, setTODOitems] = useState([]);
  const [Inprogress, setInprogress] = useState([]);
  const [CompletedItems, setCompletedItems] = useState([])
  const [toDoPopupOpen, setToDoPopupOpen] = useState(false);
  const [Loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    InitialLoad(1)
  }, [])

  const InitialLoad = (page) => {
    getAllTasksController({ id: project, page }).then(({ data }) => {
      const finalData = data.response.data
      const ToDO = finalData.filter((data) => ['queued', 'Paused'].includes(data.status))
      const Progress = finalData.filter((data) => data.status === "In Progress")
      const Completed = finalData.filter((data) => data.completed === true)
      setTODOitems(ToDO)
      setInprogress(Progress)
      setCompletedItems(Completed)
      setLoading(false)
    }).catch((err) => {
      console.log(err)
      toast.error("error occured while fetching")
    })
  }

  const routeTask = (id, section) => {
    router.push({
      pathname: `/admin/dashboard/projects/${router.query.id}`,
      query: { taskpopup: id, group: section }
    });
  }

  const filterTasks = debounce((e) => {
    getFilteredProjectTasks({ project, filter: e.target.value }).then(({ data }) => {
      const finalData = data.response.data.data
      const ToDO = finalData.filter((data) => data.status === "queued")
      const Progress = finalData.filter((data) => data.status === "in_progress")
      const Completed = finalData.filter((data) => data.completed === true)
      setTODOitems(ToDO)
      setInprogress(Progress)
      setCompletedItems(Completed)
    }).catch((err) => {
      console.log(err)
      toast.error("error occured while fetching")
    })
  }, 1000);

  if (Loading) return <Loader />

  else

    return (
      <>
      <br/>
        <div className={style.bord_container} >
          <div className={style.bord_title} >
            <h1>Manage Tasks</h1>
            <p>To Do list specialised only for you , the list is only accessible by you for personal management</p>
          </div>
          <div className={style.bord_search_create}>
            <div>
              <Search />
              <input type="text" placeholder='Search TO DO items' onChange={filterTasks} />
            </div>
            <button onClick={() => setToDoPopupOpen(true)} >Create</button>
          </div>
          <div className={style.border_bottom}></div>

          <div className={style.bord_lists} >

            <div className={style.bord_list}>
              <div className={style.bord_list_heading}>
                <h3>To Do</h3>
                <h3>{TODOitems.length}</h3>
              </div>
              <div className={style.bord_lists_inner}>
                {TODOitems.map((data) => {
                  return (
                    <div className={style.bord_inner_list} onClick={() => routeTask(data._id, data.section)}>
                      <div className={style.bord_inner_list_top} >
                        <div>{data.name}</div>
                        <div className={style.yellow_label} >{data.status}</div>
                      </div>
                      <div className={style.bord_inner_list_mid} >
                        <h5>{new Date(data.createdAt).toDateString()}</h5>
                      </div>
                      <div className={style.bord_inner_list_bottom}>
                        <p>
                          {data.description}
                        </p>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>

            <div className={style.bord_list}>
              <div className={style.bord_list_heading}>
                <h3>In Progress</h3>
                <h3>{Inprogress.length}</h3>
              </div>
              <div className={style.bord_lists_inner}>
                {Inprogress.map((data) => {
                  return (
                    <div className={style.bord_inner_list} onClick={() => routeTask(data._id, data.section)}>
                      <div className={style.bord_inner_list_top} >
                        <div>{data.name}</div>
                        <div className={style.yellow_label} >{data.status}</div>
                      </div>
                      <div className={style.bord_inner_list_mid} >
                        <h5>{new Date(data.createdAt).toDateString()}</h5>
                      </div>
                      <div className={style.bord_inner_list_bottom}>
                        <p>
                          {data.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={style.bord_list}>
              <div className={style.bord_list_heading}>
                <h3>Done</h3>
                <h3>{CompletedItems.length}</h3>
              </div>
              <div className={style.bord_lists_inner}>
                {CompletedItems.map((data) => {
                  return (
                    <div className={style.bord_inner_list} onClick={() => routeTask(data._id, data.section)}>
                      <div className={style.bord_inner_list_top} >
                        <div>{data.name}</div>
                        <div className={style.yellow_label} >{data.status}</div>
                      </div>
                      <div className={style.bord_inner_list_mid} >
                        <h5>{new Date(data.createdAt).toDateString()}</h5>
                      </div>
                      <div className={style.bord_inner_list_bottom}>
                        <p>
                          {data.description}
                        </p>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>

          </div>
        </div>
      </>
    )
}

export default ProjectTODOBoard