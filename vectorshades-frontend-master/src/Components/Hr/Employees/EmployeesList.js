import React from 'react';
import { FiberManualRecord, TrendingFlat, Tune, CreditCardOutlined, TableChartOutlined } from '@mui/icons-material';
import style from '../../../../styles/Hr.module.css';
import styles from '../../../../styles/Hr.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router';
import NoDataFound from '../../NoDataFound/NoDataFound';
import EmployeeListFilter from '../../Filters/EmployeeListFilter';
import ProfileImage from '../../ProfileImage/Image';
import EmployeeTable from './EmployeeTable';

function Employees({setOnFilters, InitialHydration, props, onChange, onFilter, setProfileOpen, selectEmployee, render }) {
  //for create employee popup open
  //for employee profile popup open
  const handleProfileOpen = () => setProfileOpen(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [switchTable, setSwitchTable] = useState(true)
  const router = useRouter()

  const noStyle = {
    height: '76%',
    display: 'flex',
    alignItems: 'center'
  }
  
  return (
    <>
      {/* search filter start */}
      <div className={styles.em_search_filter_main}>
        <div className={style.ar_search_filter} >
          {onFilter === null ? <>
            <input placeholder='Search' type="text" onChange={onChange} />
            <div onClick={() => setIsFilterOpen(!isFilterOpen)}><Tune style={{ fill: 'white' }} /></div>
          </> : <div className='clear_filter' onClick={() => {
              setOnFilters(null)
              InitialHydration()
          }}>
            <button className="clear_filter_btn" >Clear filters</button>
            <span></span>
          </div>}

          
        </div>
        <div className={styles.create_button}>
          <button onClick={()=> router.push('/admin/dashboard/hr/employees/create-employee')} >CREATE</button>
        </div>
      </div>

      <div className={styles.switch_table} >
          <CreditCardOutlined  onClick={() => setSwitchTable(true)} />
          <TableChartOutlined  onClick={() => setSwitchTable(false)} />
      </div>

      <div className='flt_main' >
        {isFilterOpen && <EmployeeListFilter render={render} setIsFilterOpen={setIsFilterOpen} />}
      </div>

      {/* employees list end */}
      {props.length > 0 && switchTable ? (
        <div className={styles.em_list_container}>
          {props.map((data, index) => {
            let dt = data.joining.substring(0, data.joining.indexOf('T'));
            dt = new Date(dt);
            dt = dt.toLocaleString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return (
              <div className={styles.em_box} key={index} onClick={() => {
                router.push(`/admin/dashboard/employee/profile/${data._id}`)
                selectEmployee(data._id)
              }} >
                <div className={styles.em_profile}>
                  <ProfileImage id={data._id} size={45} />
                  {data.online && <div><FiberManualRecord/></div>}
                  {!data.online && <div style={{background:"none"}} ><FiberManualRecord style={{fill:"none"}} /></div>}
                </div>
                <div className={styles.em_des_join}>
                  <h4>{`${data.firstName} ${data.lastName}`}</h4>
                  <h4>{data.designation}</h4>
                  <h6>Joined - {dt}</h6>
                </div>
                {data.active == false && data.working == false &&
                  <div className={styles.em_label} >
                    <div>Onboarding</div>
                  </div>
                }
                {data.onBench == true &&
                  <div className={styles.em_label}>
                    <div style={{background:'#fb5607'}}>On Bench</div>
                  </div>
                }
                {data.resigned == true &&
                  <div className={styles.em_label}>
                    <div style={{background:'#ef233c'}}>Resigned</div>
                  </div>
                }
                <div className={styles.em_view_icon}>
                  <TrendingFlat />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        props.length > 0 && !switchTable ? <EmployeeTable employeesData={props} /> : <div style={noStyle}><NoDataFound /></div>
      )}

       {/* employees list end */}
    </>
  );
}

export default Employees;
