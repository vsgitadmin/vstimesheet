import { Add, EditOutlined } from "@mui/icons-material";
import { useState } from "react";
import EditTodo from "./EditTodo";
import style from "../../../styles/Bord.module.css";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const Column = ({ ColomnItems, title, columnId, isPopup, setCreateTodo, edit,deleteTodo }) => {
  const [editClicked, setEditClicked] = useState("");

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id)
  }

  return (
    <>

      <div className={style.bord_list_heading}>
        <h3>{title}</h3>
        {!isPopup && <h3>{ColomnItems.length}</h3>}
        {isPopup && columnId === "TD" && <div onClick={() => setCreateTodo(true)} ><Add /></div>}
      </div>
      <div className={style.bord_lists_inner}>
        {ColomnItems.map((data) => {
          const formatDate = new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(',', '');
          return (
            <div key={data._id} draggable onDragStart={(e) => onDragStart(e, data._id)} className={style.bord_inner_list}>
              {editClicked === data._id ? <EditTodo setEditClicked={setEditClicked} edit={edit} data={data} /> :
                <>
                  <div className={style.bord_inner_list_top} >
                    <div><h2>{data.title}</h2></div>
                    {data.priority === "Relaxed" && <div className="relaxed" >{data.priority}</div>}
                    {data.priority === "Critical" && <div className="critical" >{data.priority}</div>}
                    {data.priority === "High" && <div className="high" >{data.priority}</div>}
                    {data.priority === "Medium" && <div className="medium" >{data.priority}</div>}
                  </div>
                  <div className={style.bord_inner_list_mid} >
                    <h5>{formatDate}</h5>
                  </div>
                  <div className={style.bord_inner_list_bottom}>
                    <p>
                      {data.description}
                    </p>
                  </div>
                  <div  className={style.edit_todo_icon}>
                    <EditOutlined onClick={() => setEditClicked(data._id)} />
                    <DeleteOutlineOutlinedIcon onClick={() => deleteTodo(data._id)} fontSize={'small'} />
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
