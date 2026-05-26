import { Modal } from '@mui/material';
import { useState, useEffect } from 'react';
import styles from './Popup.module.css';
import { toast } from "react-toastify";

const AddEditDrawingPopup = ({
  open,
  onClose,
  onSubmit,        
  defaultData = null, 
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (defaultData) {
      setName(defaultData.name);
    } else {
      setName('');
    }
  }, [defaultData, open]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Drawing name cannot be empty");
      return;
    }
    const data = defaultData
    data.name = name
    onSubmit(data);
    setName('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleFormSubmit} className={styles.project_popup}>
        <div className={styles.heading}>
          <h2>{defaultData ? 'Edit Drawing' : 'Add Drawing'}</h2>
        </div>

        <div className={styles.form_group}>
          <label>Drawing Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter drawing name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.last_buttons}>
          <button type="submit">
            {defaultData ? 'UPDATE' : 'ADD'}
          </button>
          <button
            type="button"
            onClick={() => {
              setName('');
              onClose();
            }}
          >
            CANCEL
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditDrawingPopup;
