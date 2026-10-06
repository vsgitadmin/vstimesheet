import React, { useState } from 'react';
import { Tune } from '@mui/icons-material';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import InboxIcon from '@mui/icons-material/Inbox';
import styles from '../../../../styles/EmployeesList.module.css'
import { useRouter } from 'next/router';
import EmployeeListFilter from '../../Filters/EmployeeListFilter';
import ProfileImage from '../../ProfileImage/Image';
import EmployeeTable from './EmployeeTable';

function Employees({ setOnFilters, InitialHydration, props, onChange, onFilter, setProfileOpen, selectEmployee, render, viewMode, setViewMode }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()

  const StatusPill = ({ data }) => {
    if (data.active === false && data.working === false) return <span className={`${styles.statusPill} ${styles.statusOnboarding}`}>Onboarding</span>
    if (data.onBench === true) return <span className={`${styles.statusPill} ${styles.statusOnBench}`}>On Bench</span>
    if (data.resigned === true) return <span className={`${styles.statusPill} ${styles.statusResigned}`}>Resigned</span>
    return null
  }

  const formatJoinDate = (joining) => {
    let dt = joining.substring(0, joining.indexOf('T'));
    dt = new Date(dt);
    return dt.toLocaleString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  const goToProfile = (id) => {
    router.push(`/admin/dashboard/employee/profile/${id}`)
    selectEmployee(id)
  }

  return (
    <>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><PeopleAltOutlinedIcon /></span>Employees</h1>
          <p className={styles.subtitle}>View the list of employees and use the create button to add new members</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        {onFilter === null ? <>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input placeholder='Search' type="text" onChange={onChange} />
          </div>
          <div className={styles.filterWrap}>
            <button type="button" className={styles.iconBtn} onClick={() => setIsFilterOpen(!isFilterOpen)} aria-label="Open filters">
              <Tune />
            </button>
            {isFilterOpen && <EmployeeListFilter render={(filter) => { setIsFilterOpen(false); render(filter) }} setIsFilterOpen={setIsFilterOpen} />}
          </div>
        </> : <button type="button" className={styles.clearBtn} onClick={() => { setOnFilters(null); InitialHydration() }}>Clear filters</button>}

        {props && <span className={styles.countBadge}><strong>{props.length}</strong> employee{props.length === 1 ? '' : 's'}</span>}

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

        <button type="button" className={styles.addBtn} onClick={() => router.push('/admin/dashboard/hr/employees/create-employee')}>
          <AddCircleOutlineIcon />CREATE
        </button>
      </div>

      {props.length > 0 ? (
        viewMode === 'grid' ? (
          <div className={styles.cardsGrid}>
            {props.map((data, index) => (
              <div className={styles.card} key={data._id || index} onClick={() => goToProfile(data._id)}>
                <div className={styles.avatarWrap}>
                  <ProfileImage id={data._id} size={45} />
                  <span className={`${styles.onlineDot} ${data.online ? styles.onlineDotActive : ''}`}></span>
                </div>
                <div className={styles.cardBody}>
                  <h4>{`${data.firstName} ${data.lastName}`}</h4>
                  <h5>{data.designation}</h5>
                  <h6>Joined - {formatJoinDate(data.joining)}</h6>
                </div>
                <div className={styles.cardRight}>
                  <StatusPill data={data} />
                  <span className={styles.cardArrow}><TrendingFlatIcon /></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmployeeTable employeesData={props} />
        )
      ) : (
        <div className={styles.emptyState}>
          <InboxIcon />
          <h4>No employees found</h4>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </>
  );
}

export default Employees;
