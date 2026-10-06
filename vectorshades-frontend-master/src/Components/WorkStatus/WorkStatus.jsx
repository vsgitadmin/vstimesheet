import styles from "../../../styles/WorkStatus.module.css";
import ProfileImage from "../ProfileImage/Image";
import { getEmployeeWorkStatusController } from "../../Controllers/Employee";
import { useEffect, useState } from "react";
import Loader from "../Loader/loader";
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import SearchIcon from '@mui/icons-material/Search'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import InboxIcon from '@mui/icons-material/Inbox'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined'
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined'
import { useViewMode } from '../../Hooks/useViewMode'

const STAT_TILES = [
  { key: 'totalEmployees', label: 'Total Employees', icon: <GroupsOutlinedIcon /> },
  { key: 'workingEmployees', label: 'Working Count', icon: <CheckCircleOutlineIcon />, tone: 'good' },
  { key: 'notWorkingEmployees', label: 'Idle Count', icon: <HourglassBottomIcon />, tone: 'warn' },
  { key: 'noProjectsAssigned', label: 'No Projects Assigned', icon: <FolderOffOutlinedIcon />, tone: 'warn' },
  { key: 'noTasksAssigned', label: 'No Tasks Assigned', icon: <PlaylistRemoveOutlinedIcon />, tone: 'warn' },
]

export default function WorkStatus() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [workData, setWorkData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useViewMode();

  function getWorkStatusSummary(data) {
    const totalEmployees = data.length;

    let workingEmployees = 0;
    let notWorkingEmployees = 0;
    let noProjectsAssigned = 0;
    let noTasksAssigned = 0;

    data.forEach(emp => {
      if (emp.isWorking) workingEmployees++;
      else notWorkingEmployees++;

      if (emp.totalProjects === 0) noProjectsAssigned++;
      if (emp.totalTasks === 0) noTasksAssigned++;
    });

    setSummary({
      totalEmployees,
      workingEmployees,
      notWorkingEmployees,
      noProjectsAssigned,
      noTasksAssigned,
    });
  }

  const fetchWorkStatus = async (searchQuery = '') => {
    const { data } = await getEmployeeWorkStatusController({ search: searchQuery });
    setWorkData(data.response.data);
    getWorkStatusSummary(data.response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkStatus();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
      fetchWorkStatus(debouncedSearch);
  }, [debouncedSearch]);

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><DvrOutlinedIcon /></span>Work Status</h1>
          <p className={styles.subtitle}>Track the work status of employees to ensure project completion and resource allocation.</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            placeholder="Search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.viewToggle}>
          <button
            type="button"
            className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <GridViewRoundedIcon />
          </button>
          <button
            type="button"
            className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <ViewListRoundedIcon />
          </button>
        </div>
      </div>

      <div className={styles.analyticsCard}>
        <div className={styles.analyticsHeading}>
          <h3>Summary Analytics</h3>
        </div>
        <div className={styles.analyticsGrid}>
          {STAT_TILES.map((tile) => (
            <div className={styles.statTile} key={tile.key}>
              <span className={`${styles.statIcon} ${tile.tone === 'good' ? styles.statIconGood : ''} ${tile.tone === 'warn' ? styles.statIconWarn : ''}`}>{tile.icon}</span>
              <div>
                <h4>{tile.label}</h4>
                <h2>{summary?.[tile.key]}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {workData.length > 0 ? (
        viewMode === 'grid' ? (
          <div className={styles.cardsGrid}>
            {workData.map(({ employee, isWorking, totalProjects, totalTasks, currentTask }) => (
              <div className={styles.card} key={employee.id}>
                <div className={styles.cardTop}>
                  <div className={styles.person}>
                    <ProfileImage id={employee.id} size={44} />
                    <div>
                      <h4>{employee.firstName + ' ' + employee.lastName}</h4>
                      <h5>{employee.designation}</h5>
                    </div>
                  </div>
                  <span className={`${styles.statusPill} ${isWorking ? styles.statusWorking : styles.statusIdle}`}>
                    {isWorking ? 'On Work' : 'Idle'}
                  </span>
                </div>

                <div className={styles.taskRow}>
                  <span><strong>{totalProjects}</strong> Projects</span>
                  <span><strong>{totalTasks}</strong> Tasks</span>
                </div>

                {currentTask && (
                  <div className={styles.currentTask}>
                    <p>{currentTask.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.rowsList}>
            {workData.map(({ employee, isWorking, totalProjects, totalTasks, currentTask }) => (
              <div className={styles.row} key={employee.id}>
                <div className={styles.rowPerson}>
                  <ProfileImage id={employee.id} size={38} />
                  <div>
                    <h4>{employee.firstName + ' ' + employee.lastName}</h4>
                    <h5>{employee.designation}</h5>
                  </div>
                </div>
                <div className={styles.rowStats}>
                  <span><strong>{totalProjects}</strong> Projects</span>
                  <span><strong>{totalTasks}</strong> Tasks</span>
                  {currentTask && <span>{currentTask.name}</span>}
                </div>
                <span className={`${styles.statusPill} ${isWorking ? styles.statusWorking : styles.statusIdle}`}>
                  {isWorking ? 'On Work' : 'Idle'}
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={styles.emptyState}>
          <InboxIcon />
          <h4>No employees found</h4>
        </div>
      )}
    </div>
  );
}
