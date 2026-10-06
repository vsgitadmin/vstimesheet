import { Add, EditOutlined } from "@mui/icons-material";
import { useState } from "react";
import EditTodo from "./EditTodo";
import style from "../../../styles/TodoBoard.module.css";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const COLUMN_DOT_CLASS = { TD: 'colDotTD', IP: 'colDotIP', CP: 'colDotCP' }
const STATUS_LABEL = { TD: 'To Do', IP: 'In Progress', CP: 'Completed' }

const Column = ({ ColomnItems, title, columnId, isPopup, setCreateTodo, edit, deleteTodo, moveTodo }) => {
  const [editClicked, setEditClicked] = useState("");

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id)
  }

  return (
    <>
      <div className={style.colHeader}>
        <span className={`${style.colDot} ${style[COLUMN_DOT_CLASS[columnId]]}`}></span>
        <h3 className={style.colTitle}>{title}</h3>
        {!isPopup && <span className={style.colCount}>{ColomnItems.length}</span>}
        {isPopup && columnId === "TD" && <button type="button" className={style.colAddBtn} onClick={() => setCreateTodo(true)} aria-label="Add task"><Add fontSize="small" /></button>}
      </div>
      <div className={style.colBody}>
        {ColomnItems.length === 0 && <div className={style.emptyCol}>No items</div>}
        {ColomnItems.map((data) => {
          const formatDate = new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(',', '');
          return (
            <div key={data._id} draggable onDragStart={(e) => onDragStart(e, data._id)} className={style.card}>
              {editClicked === data._id ? <EditTodo setEditClicked={setEditClicked} edit={edit} data={data} /> :
                <>
                  <div className={style.cardTop} >
                    <h2 className={style.cardTitle}>{data.title}</h2>
                    {data.priority === "Relaxed" && <span className={`${style.priorityPill} relaxed`} >{data.priority}</span>}
                    {data.priority === "Critical" && <span className={`${style.priorityPill} critical`} >{data.priority}</span>}
                    {data.priority === "High" && <span className={`${style.priorityPill} high`} >{data.priority}</span>}
                    {data.priority === "Medium" && <span className={`${style.priorityPill} medium`} >{data.priority}</span>}
                  </div>
                  <div className={style.cardDate} >
                    {formatDate}
                  </div>
                  <div className={style.cardDesc}>
                    {data.description}
                  </div>
                  <div className={style.cardFooter}>
                    <select
                      className={style.moveSelect}
                      value={columnId}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => moveTodo(data._id, e.target.value)}
                      aria-label="Move to"
                    >
                      {Object.keys(STATUS_LABEL).map((key) => (
                        <option key={key} value={key}>{STATUS_LABEL[key]}</option>
                      ))}
                    </select>
                    <div className={style.cardActions}>
                      <EditOutlined onClick={() => setEditClicked(data._id)} />
                      <DeleteOutlineOutlinedIcon onClick={() => deleteTodo(data._id)} fontSize={'small'} />
                    </div>
                  </div>
                </>}
            </div>
          )
        })}
      </div>
    </>
  );
};

export default Column;
