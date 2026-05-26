import { Search } from '@mui/icons-material'
import { useState } from 'react';
import { createEmployeeTODOController } from "../../../src/Controllers/Employee/index"
import { toast } from 'react-toastify'
import { debounce } from 'lodash';
import style from '../../../styles/Bord.module.css'
import ToDoPopup from '../Popups/Project/ToDoPopup';

const Head = ({ filter ,render}) => {
  const [toDoPopupOpen, setToDoPopupOpen] = useState(false);
  const [String, setString] = useState('')
  const [TODOitems, setTODOitems] = useState([])

  const createToDOFunction = (body) => {
    createEmployeeTODOController(body).then(({ data }) => {
      toast.success("TO DO Created")
      render()
      setToDoPopupOpen(false)
    }).catch((err) => {
      console.log(err);
      toast.error('unable to create items')
    })
  }

  const handleFilter = (e) => {
    setString(e.target.value);
    debounce(() => {
      filter(String);
    }, 500)();
  };

  return (
    <>
      <ToDoPopup submit={createToDOFunction} toDoPopupOpen={toDoPopupOpen} setToDoPopupOpen={setToDoPopupOpen} />
      <div className={style.bord_container} style={{ paddingBottom: "0" }} >
        <div className={style.bord_title} >
          <h1>Your Personal To Do</h1>
          <p className='grey' >To do list specialised only for you , the list is only accessible by you for personal management</p>
        </div>
        <div className={style.bord_search_create}>
          <div>
            <input type="text" placeholder='Search TO DO items' value={String} onChange={handleFilter} />
          </div>
          <button onClick={() => setToDoPopupOpen(true)} >Create</button>
        </div>
        <div className={style.border_bottom}></div>
      </div>
    </>
  )
}

export default Head