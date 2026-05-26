import { Modal } from '@mui/material';
import styles from '../Project/Popup.module.css'

const AddConfigPopup = ({ addConfigPopup, setAddConfigPopup, updateConfig, selectedType }) => {

  const handleClose = () => setAddConfigPopup(false);
  const inputsForType = {
    client: [
      { name: 'name', label: 'Client name', type: 'text' },
      { name: 'location', label: 'Client location', type: 'text' },
      { name: 'date', label: 'Client date', type: 'date' }
    ],
    designation: [
      { name: 'name', label: 'Designation Name', type: 'text' },
      { name: 'description', label: 'Designation Description', type: 'text' },
      { name: 'performanceAttributes', label: 'Performance Attributed (comma seperated)', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' }
    ],
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    let object = {}
    for (let i = 0; i < e.target.length; i++) {
      let t = e.target[i]
      if (t.name !== '')
        object[t.name] = t.value
    }
    let body = { type: selectedType, value: object }
    updateConfig(body)
  }

  return (
    <>
      <Modal open={addConfigPopup} onClose={handleClose} >
        <form onSubmit={handleFormSubmit} className={styles.project_popup} >
          <div className={styles.heading}>
            <h2>Add Config</h2>
          </div>
          {
            selectedType && inputsForType[selectedType]?.map((inp) => {
              return <div className={styles.form_group} >
                <label>{inp.label}</label>
                <input type={inp.type} placeholder={inp.label} name={inp.name} />
              </div>
            })
          }

          {/*<div className={styles.form_group} >*/}
          {/*   <label>Due Date</label>*/}
          {/*   <input type="date" name='dueDate' />*/}
          {/* </div>*/}

          {/*<div className={styles.form_group}>*/}
          {/*   <label>Estimated Hour</label>*/}
          {/*   <input name={"estimated_hour"} placeholder='Estimated Hour' type="number"  />*/}
          {/* </div>*/}

          <div className={styles.last_buttons} >
            <button type={"submit"}>ADD</button>
            <button onClick={handleClose}>CANCEL</button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AddConfigPopup