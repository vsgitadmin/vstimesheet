import { FormControl, InputLabel, MenuItem, Modal, Rating, Select } from '@mui/material';
import SelectUserInput from '../../SelectUserInput';
import styles from './Popup.module.css'
import { useState } from 'react';
import { toast } from 'react-toastify';

const CreateChangeOrderPopup = ({ onClose, perHour, submit, defaultData, edit, update }) => {
    const [body, setbody] = useState(edit ? defaultData : {perHour})
    const [detailer, setdetailer] = useState(edit ? defaultData.detailer : null)

    const changeInputValue = (e) => body[e.target.name] = e.target.value

    const formSubmit = (e) => {
        e.preventDefault()
        if (!detailer) toast.error('please assign detailer')
        else body.detailer = detailer
        if (edit) update(body)
        else submit(body)
    }

    return (
        <Modal open onClose={onClose}>
            <div className={`${styles.create_notice_popup}`} >
                <div className={styles.cn_title} >
                    <h2>Create Change Order</h2>
                </div>
                <form onSubmit={formSubmit}>
                    <div className={styles.cn_form_group}>
                        <label>Name</label>
                        <input name='name' defaultValue={defaultData.name} onChange={changeInputValue} required placeholder='change order name' />
                    </div>
                    <div className={styles.cn_form_group}>
                        <label>Estimated CO hours</label>
                        <input name='estimatedCOhours' defaultValue={defaultData.estimatedCOhours} onChange={changeInputValue} type={'number'} placeholder='CO hours' />
                    </div>
                    <div className={styles.cn_form_group}>
                        <label>Actual CO hours</label>
                        <input name='actualCOhours' defaultValue={defaultData.actualCOhours} onChange={changeInputValue} type={'number'} placeholder='CO hours' />
                    </div>
                    <div className={styles.cn_form_group}>
                        <label>Per Hour</label>
                        <input name='perHour' defaultValue={edit ? defaultData.perHour : perHour} onChange={changeInputValue} type={'number'} placeholder='$PH' />
                    </div>
                    <div className={styles.cn_form_group}>
                        <label>Detailer</label>
                        <SelectUserInput returnUser={(user) => setdetailer(user)} deleteUser={() => setdetailer({})} defaultData={edit ? defaultData.detailer : detailer} returnRaw={true}
                        />
                    </div>
                    <div className={styles.cn_form_group}>
                        <label>Revision Status</label>
                        <select name='revisionStatus' defaultValue={defaultData.revisionStatus} onChange={changeInputValue}>
                            <option hidden>Select Status</option>
                            <option value={true}>Completed</option>
                            <option value={false}>Pending</option>
                        </select>
                    </div>
                    <div className={styles.cn_form_group}>
                        <label>Ready to Bill</label>
                        <select name='readyToBill' defaultValue={defaultData.readyToBill} onChange={changeInputValue}>
                            <option hidden>Select Status</option>
                            <option value={true}>Billed</option>
                            <option value={false}>Not Billed</option>
                        </select>
                    </div>
                    <div className={styles.cn_form_group}>
                        <label>Description</label>
                        <textarea defaultValue={defaultData.description} onChange={changeInputValue} required name='description' id='message' placeholder='change order description' ></textarea>
                    </div>

                    <div className={styles.cn_form_group}>
                        <button type='submit' >{edit ? 'UPDATE' : 'CREATE'} ORDER</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default CreateChangeOrderPopup