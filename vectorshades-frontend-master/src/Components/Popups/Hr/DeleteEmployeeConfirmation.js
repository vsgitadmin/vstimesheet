import { useState, useEffect } from 'react';
import { Modal, CircularProgress } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import styles from './Popup.module.css'

// Destructive, irreversible confirmation for permanently deleting an employee
// and every record tied to them. Requires typing the employee's full name to
// arm the button, the same way most platforms guard a hard delete.
const DeleteEmployeeConfirmation = ({ open, setOpen, employee, onConfirm, isDeleting }) => {
  const [typedName, setTypedName] = useState('')
  const fullName = employee ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim() : ''
  const armed = typedName.trim().length > 0 && typedName.trim().toLowerCase() === fullName.toLowerCase()

  useEffect(() => {
    if (open) setTypedName('')
  }, [open, employee])

  const handleClose = () => {
    if (isDeleting) return
    setOpen(false)
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className={styles.del_emp_popup}>
        <div className={styles.del_emp_icon}>
          <WarningAmberRoundedIcon fontSize='large' style={{ fill: '#E64848' }} />
        </div>
        <h2 className={styles.del_emp_title}>Permanently delete {fullName || 'this employee'}?</h2>
        <p className={styles.del_emp_text}>
          This removes the employee account and <b>everything tied to it</b> - basic details, onboarding
          documents, todos, activities, notices, notifications, reviews, timesheets, leaves, attendance,
          punching records, chat history and personal cloud files. They will also be removed from any
          projects, training and billing access they were part of. <b>This cannot be undone.</b>
        </p>
        <p className={styles.del_emp_confirm_label}>
          Type <b>{fullName}</b> to confirm
        </p>
        <input
          className={styles.del_emp_input}
          type="text"
          placeholder={fullName}
          value={typedName}
          disabled={isDeleting}
          onChange={(e) => setTypedName(e.target.value)}
        />
        <div className={styles.del_emp_buttons}>
          <button className={styles.del_emp_cancel} onClick={handleClose} disabled={isDeleting}>Cancel</button>
          <button
            className={styles.del_emp_confirm}
            onClick={() => armed && onConfirm()}
            disabled={!armed || isDeleting}
          >
            {isDeleting ? <CircularProgress size={18} style={{ color: 'white' }} /> : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteEmployeeConfirmation
