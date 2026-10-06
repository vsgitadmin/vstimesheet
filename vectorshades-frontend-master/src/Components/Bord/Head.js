import { useRef, useEffect, useState } from 'react';
import { createEmployeeTODOController } from "../../../src/Controllers/Employee/index"
import { toast } from 'react-toastify'
import { debounce } from 'lodash';
import SearchIcon from '@mui/icons-material/Search'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import style from '../../../styles/TodoBoard.module.css'
import ToDoPopup from '../Popups/Project/ToDoPopup';

const Head = ({ filter, render }) => {
  const [toDoPopupOpen, setToDoPopupOpen] = useState(false);
  const [String, setString] = useState('')

  // keep the latest `filter` callback available to the debounced function
  // without recreating (and therefore resetting) the debounce timer itself
  const filterRef = useRef(filter)
  useEffect(() => { filterRef.current = filter }, [filter])

  const debouncedFilter = useRef(debounce((value) => filterRef.current(value), 400)).current
  useEffect(() => () => debouncedFilter.cancel(), [debouncedFilter])

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
    const value = e.target.value
    setString(value)
    debouncedFilter(value)
  };

  return (
    <>
      <ToDoPopup submit={createToDOFunction} toDoPopupOpen={toDoPopupOpen} setToDoPopupOpen={setToDoPopupOpen} />
      <div className={style.headerRow}>
        <div className={style.titleBlock}>
          <h1><span className={style.titleIcon}><FormatListBulletedIcon /></span>Your Personal To Do</h1>
          <p className={style.subtitle}>To do list specialised only for you, the list is only accessible by you for personal management</p>
        </div>
      </div>

      <div className={style.toolbar}>
        <div className={style.searchBox}>
          <SearchIcon />
          <input type="text" placeholder='Search TO DO items' value={String} onChange={handleFilter} />
        </div>
        <button type="button" className={style.addBtn} onClick={() => setToDoPopupOpen(true)}><AddCircleOutlineIcon />Create</button>
      </div>
    </>
  )
}

export default Head
