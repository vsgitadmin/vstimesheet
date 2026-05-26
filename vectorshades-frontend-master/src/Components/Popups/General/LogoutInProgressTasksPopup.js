import { ChevronRight, WarningAmberOutlined } from '@mui/icons-material';
import { Modal } from '@mui/material';
import { useRouter } from 'next/router';
import styles from './LogoutInProgressTasksPopup.module.css';

const LogoutInProgressTasksPopup = ({
  open,
  onClose,
  tasks = [],
  onRecheck,
  checking = false,
}) => {
  const router = useRouter();
  const count = tasks.length;

  const openTask = (task) => {
    if (task.projectId) {
      router.push({
        pathname: `/admin/dashboard/projects/${task.projectId}`,
        query: {
          taskpopup: task._id,
          ...(task.section ? { group: task.section } : {}),
        },
      });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}
    >
      <div className={styles.overlay} role="dialog" aria-labelledby="logout-blocked-title">
        <div className={styles.card}>
          <header className={styles.header}>
            <div className={styles.iconWrap} aria-hidden>
              <WarningAmberOutlined fontSize="small" />
            </div>
            <div className={styles.titleBlock}>
              <h2 id="logout-blocked-title">Pause tasks before logout</h2>
              <p>
                {count === 1
                  ? 'One task is still in progress. Open it, pause the timer, then try logging out again.'
                  : `${count} tasks are still in progress. Pause each one, then try logging out again.`}
              </p>
            </div>
          </header>

          <div className={styles.body}>
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li key={task._id} className={styles.taskItem}>
                  <button
                    type="button"
                    className={styles.taskButton}
                    onClick={() => openTask(task)}
                  >
                    <span className={styles.taskLabel}>{task.label || task.name}</span>
                    {task.taskIndex != null && (
                      <span className={styles.taskMeta}>#{task.taskIndex}</span>
                    )}
                    <ChevronRight className={styles.taskChevron} fontSize="small" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <footer className={styles.footer}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              disabled={checking}
              onClick={onRecheck}
            >
              {checking ? 'Checking…' : 'Try logout again'}
            </button>
          </footer>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutInProgressTasksPopup;
