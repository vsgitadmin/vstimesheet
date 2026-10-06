import { useEffect, useState } from 'react'
import Column from './Column'
import { editEmployeeTODOController, deleteEmployeeTODOController} from "../../Controllers/Employee/index";
import style from '../../../styles/TodoBoard.module.css'
import { toast } from 'react-toastify';

const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Relaxed: 3 }

// Critical first, then High, Medium, Relaxed. Unknown/missing priority sorts last.
const sortByPriority = (items) => [...items].sort(
  (a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4)
)

const Bord = ({ data, isPopup, setCreateTodo ,render}) => {

  const [InprogressItems, setInprogressItems] = useState([]);
  const [TODOItems, setTODOItems] = useState([])
  const [CompletedItems, setCompletedItems] = useState([])
  const [mainData, setMainData] = useState(data)
  const [dragOverCol, setDragOverCol] = useState(null)

  // update todo, progress, and completed state for map, ordered by priority
  useEffect(() => {
    setInprogressItems(sortByPriority(mainData.filter((data) => data.status === 'IP')))
    setTODOItems(sortByPriority(mainData.filter((data) => data.status === 'TD')))
    setCompletedItems(sortByPriority(mainData.filter((data) => data.status === 'CP')))
  }, [mainData])

  useEffect(() => {
    setMainData(data)
  }, [data])

  const onDragOver = (e, status) => {
    e.preventDefault()
    if (dragOverCol !== status) setDragOverCol(status)
  }

  const onDragLeave = () => setDragOverCol(null)

  // shared status-change handler, used by both drag-and-drop and the
  // per-card "move to" dropdown so a task can be moved without dragging
  const changeStatus = async (id, status) => {
    try {
      await editEmployeeTODOController({ _id: id, status })
      setMainData((prev) => prev.map((task) => task._id === id ? { ...task, status } : task))
    } catch (err) {
      toast.error('unable to update status')
    }
  }

  const onDrop = async (e, status) => {
    e.preventDefault()
    setDragOverCol(null)
    const id = e.dataTransfer.getData("id")
    changeStatus(id, status)
  }

  const editTODOcontroller = async (data) => {
    await editEmployeeTODOController(data)
    render()
  }

  const deleteTodo = async (data)=>{
    deleteEmployeeTODOController(data)
    .then((response)=>{toast.success("todo deleted successfully"); render()})
    .catch((err)=>toast.error("unable to process request"))
  }

  return (
    <>
      <div style={{ marginTop: isPopup ? "0" : null }} >
        <div className={style.board} style={{ marginTop: isPopup ? "0" : null }} >
          <div
            className={`${style.col} ${dragOverCol === "TD" ? style.colDragOver : ''}`}
            onDragOver={(e) => onDragOver(e, "TD")}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, "TD")}
          >
            <Column edit={editTODOcontroller} moveTodo={changeStatus} ColomnItems={TODOItems} title="TO DO" columnId="TD" isPopup={isPopup} setCreateTodo={setCreateTodo} deleteTodo={deleteTodo} />
          </div>
          <div
            className={`${style.col} ${dragOverCol === "IP" ? style.colDragOver : ''}`}
            onDragOver={(e) => onDragOver(e, "IP")}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, "IP")}
          >
            <Column edit={editTODOcontroller} moveTodo={changeStatus} ColomnItems={InprogressItems} title="In Progress" columnId="IP" isPopup={isPopup} setCreateTodo={setCreateTodo}  deleteTodo={deleteTodo} />
          </div>
          <div
            className={`${style.col} ${dragOverCol === "CP" ? style.colDragOver : ''}`}
            onDragOver={(e) => onDragOver(e, "CP")}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, "CP")}
          >
            <Column edit={editTODOcontroller} moveTodo={changeStatus} ColomnItems={CompletedItems} title="Completed" columnId="CP" isPopup={isPopup} setCreateTodo={setCreateTodo}  deleteTodo={deleteTodo} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Bord
