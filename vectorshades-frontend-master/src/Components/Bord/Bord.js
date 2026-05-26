import { useEffect, useState } from 'react'
import Column from './Column'
import { editEmployeeTODOController, deleteEmployeeTODOController} from "../../Controllers/Employee/index";
import style from '../../../styles/Bord.module.css'
import { toast } from 'react-toastify';


const Bord = ({ data, isPopup, setCreateTodo ,render}) => {

  const [InprogressItems, setInprogressItems] = useState([]);
  const [TODOItems, setTODOItems] = useState([])
  const [CompletedItems, setCompletedItems] = useState([])
  const [mainData, setMainData] = useState(data)

  // update todo, progress, and completed state for map 
  useEffect(() => {
    setInprogressItems(mainData.filter((data) => data.status === 'IP'))
    setTODOItems(mainData.filter((data) => data.status === 'TD'))
    setCompletedItems(mainData.filter((data) => data.status === 'CP'))
  }, [mainData])

  useEffect(() => {
    setMainData(data)
  }, [data])

  const onDragOver = (e) => {
    e.preventDefault()
  }

  // function for change item status  
  const onDrop = async (e, status) => {
    // status stands for to update to which status
    // id - item id
    let id = e.dataTransfer.getData("id")

    // update item status on server
    await editEmployeeTODOController({ _id: id, status })

    // update item status in local state
    const updatedTasks = mainData.map((task) => {
      if (task._id === id) return { ...task, status: status }
      return task;
    })
    setMainData(updatedTasks)
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
      <div className={style.bord_container} style={{ paddingTop: "0", padding: isPopup ? "0" : null }} >
        <div className={style.bord_lists} style={{ marginTop: isPopup ? "0" : null }} >
          <div className={style.bord_list} onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, "TD")}>
            <Column edit={editTODOcontroller} ColomnItems={TODOItems} title="TO DO" columnId="TD" isPopup={isPopup} setCreateTodo={setCreateTodo} deleteTodo={deleteTodo} />
          </div>
          <div className={style.bord_list} onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, "IP")} >
            <Column edit={editTODOcontroller} ColomnItems={InprogressItems} title="In Progress" columnId="IP" isPopup={isPopup} setCreateTodo={setCreateTodo}  deleteTodo={deleteTodo} />
          </div>
          <div className={style.bord_list} onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, "CP")} >
            <Column edit={editTODOcontroller} ColomnItems={CompletedItems} title="Completed" columnId="CP" isPopup={isPopup} setCreateTodo={setCreateTodo}  deleteTodo={deleteTodo} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Bord