import { useRouter } from 'next/router';
import CreateEmployee from '../../../../../src/Components/Popups/Hr/CreateEmployee'
import { CreateEmployeeController } from '../../../../../src/Controllers/Employee/index';
import { toast } from 'react-toastify';

const CreateEmployeePage = () => {
  const router = useRouter()

  const addEmployee = (data) => {
    CreateEmployeeController(data)
      .then((res) => toast.success("Employee Created Successfully"))
      .then(() => router.push('/admin/dashboard/hr/employees'))
      .catch((err) => { console.log(err.message); toast.error("Employee added Failed") })
  }


  return (
    <div style={{padding:"33.6px",paddingTop:"0"}} >
      <CreateEmployee createEmp={addEmployee} />
    </div>
  )
}

export default CreateEmployeePage