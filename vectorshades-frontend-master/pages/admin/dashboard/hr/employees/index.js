import React, { useEffect, useState } from 'react'
import Employees from '../../../../../src/Components/Hr/Employees/EmployeesList';
import styles from '../../../../../styles/EmployeesList.module.css';
import { getAllemployeesController, getTotalNumberOfEmployeeController, filterEmployeeController, CreateEmployeeController, deleteEmployeeController } from '../../../../../src/Controllers/Employee/index';
import { toast } from 'react-toastify'
import EmployeeProfile from '../../../../../src/Components/Popups/Hr/EmployeeProfile'
import Loader from '../../../../../src/Helpers/Loader';
import { Pagination } from '@mui/material';
import { filterEmployeesController } from '../../../../../src/Controllers/Filters/index'
import { useViewMode } from '../../../../../src/Hooks/useViewMode'

function Index() {

  //create employee popup
  const [ListEmployees, SetListEmployees] = useState([]);
  const [OnFilters, setOnFilters] = useState(null)
  const [noOfPages, setNoOfPages] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState({})
  const [Loading, setLoading] = useState(true)
  const [Page, setPage] = useState(1)
  const [viewMode, setViewMode] = useViewMode()

  useEffect(() => {
    InitialHydration()
  }, []);

  const InitialHydration = () => {
    getTotalNumberOfEmployeeController().then((count) => {
      let pageCount = Math.ceil(count.data.response.total / 15)
      setNoOfPages(pageCount)
      getAllemployeesController().then((result) => { SetListEmployees(result.data) })
        .catch((error) => { console.log(error.message) })
    })
      .then(() => setLoading(false))
  }

  const onPageChange = async (event, value) => {
    setPage(value)
    setLoading(true)
    if (OnFilters) {
      await filterEmployeeFunction({ ...OnFilters, page: value })
      setLoading(false)
    }
    else getAllemployeesController(value).then((response) => {
      SetListEmployees(response.data)
    }).then(() => {
      setLoading(false)
    })
      .catch((err) => toast.error('error occured'))
  }

  const filterEmployees = async (e) => {
    try {
      const filtered = await filterEmployeeController(e.target.value)
      SetListEmployees(filtered.data.response.data)
      return filtered.data.response.data
    } catch (err) { throw err }
  }

  const addEmployee = (data) => {
    let fixobj = { "pwd": '123' };
    data = Object.assign(data, fixobj);
    CreateEmployeeController(data)
      .then((res) => {
        toast.success("Employee Created Successfully");
      })
      .then(() => InitialHydration())
      .catch((err) => { console.log(err.message); toast.error("Employee added Failed") })
  }

  const deleteEmp = () => {
    return deleteEmployeeController(selectedProfile._id)
      .then(() => {
        setProfileOpen(false)
        toast.success("Employee Deleted Successfully")
        InitialHydration()
      })
      .catch((err) => toast.error(err?.response?.data?.message || "Employee Deletion Failed"))
  }

  const selectEmployee = (id) => {
    const data = ListEmployees.filter(({ _id }) => _id === id)
    setSelectedProfile(data[0])
  }

  const filterEmployeeFunction = async (query) => {
    filterEmployeesController(query).then(({ data }) => {
      setNoOfPages(1)
      SetListEmployees(data.response)
    })
      .then(() => setLoading(false))
  }

  const renderEmployeesFilter = (filter) => {
    setOnFilters(filter)
    setLoading(true)
    filterEmployeeFunction({ page: 1, ...filter })
  }

  if (Loading) return <Loader />

  return (
    <>
      <section className={styles.page} >
        <Employees setOnFilters={setOnFilters} InitialHydration={InitialHydration} onFilter={OnFilters} render={renderEmployeesFilter} props={ListEmployees} onChange={filterEmployees} setProfileOpen={setProfileOpen} selectEmployee={selectEmployee} viewMode={viewMode} setViewMode={setViewMode} />
        {noOfPages > 1 &&
          <div className={styles.paginationWrap} >
            <Pagination page={Page} count={noOfPages} shape="rounded" onChange={onPageChange} />
          </div>}
      </section>
      <EmployeeProfile profileOpen={profileOpen} setProfileOpen={setProfileOpen} deleteEmp={deleteEmp} selectedEmp={selectedProfile} />
    </>
  )
}

export default Index