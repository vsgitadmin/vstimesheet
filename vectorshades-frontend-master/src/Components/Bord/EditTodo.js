import { useEffect, useRef ,useState} from 'react';
import style from '../../../styles/TodoBoard.module.css'

const EditTodo = ({ setEditClicked, data, edit }) => {
  const [Data, setData] = useState(data)
  const textareaRef = useRef(null);

  // Set initial height on todo edit
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  // change hight of todo edit
  const handleChange = (event) => {
    Data.description = event.target.value;
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }

  return (
    <>
      <div className={style.editRow} >
        <input type="text" defaultValue={data.title} onChange={(e) => Data.title = e.target.value} />
        <select defaultValue={data.priority} onChange={(e) => Data.priority = e.target.value}>
          <option value="Relaxed">Relaxed</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
      <textarea className={style.editDesc} ref={textareaRef} onChange={handleChange}
        defaultValue={data.description} />
      <div className={style.editActions} >
        <button onClick={() => { edit(Data); setEditClicked("") }}>SAVE</button>
        <button onClick={() => setEditClicked("")} >CANCEL</button>
      </div>
    </>
  )
}

export default EditTodo
