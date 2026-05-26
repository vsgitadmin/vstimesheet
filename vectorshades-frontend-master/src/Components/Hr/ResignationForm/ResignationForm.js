import styles from '../../Popups/Hr/Popup.module.css'


const ResignationForm = ({ createEmp }) => {

  return (
    <>
      <div className={styles.ce_popup} >
        <div className={styles.ce_popup_title}>
          <h2>Resignation Form</h2>
        </div>
        <form className={styles.ce_form_container} >

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Employee Id</label>
              <input required placeholder='Employee Id' type="text" />
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Last Working Day</label>
              <input required placeholder='Last Working Day' type="text" />
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Resignation Date</label>
              <input required placeholder='Resignation Date' type={'number'}  />
            </div>
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Resignation Reason</label>
              <select required >
                <option hidden>Resignation Reason</option>
                <option value='' >option 1</option>
                <option value=''>option 2</option>
                <option value=''>option 3</option>
              </select>
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_textarea} ${styles.ce_label}`}>
              <label>Additional Comments</label>
              <textarea placeholder='Additional Comments' ></textarea>
            </div>
          </div>

          <div className={styles.ce_form_group}>
            <input value="SUBMIT" type="submit" />
          </div>
        </form>
      </div>
    </>
  )
}

export default ResignationForm