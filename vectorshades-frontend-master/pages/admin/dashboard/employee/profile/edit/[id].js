import {useState,useEffect} from 'react'
import EditEmployee from '../../../../../../src/Components/Popups/Hr/editEmployee'
import { getEmployeeBasicDetailsController,updateEmployeeWithBasicDataController } from '../../../../../../src/Controllers/Employee/index'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'


function index() {
    const [employeeData, setEmployeeData] = useState()
    const [employeePersonalDetails, setEmployeePersonalDetails] = useState()
    const router = useRouter()

    const getEmployeeDetails = async () => {
        if (!router.isReady) return
        getEmployeeBasicDetailsController({ user: router.query.id })
            .then((response) => {
                setEmployeePersonalDetails(response.data.response.data.details)
                setEmployeeData(response.data.response.data.emp)
            })
            .catch((err) => toast("unable to process request"))
    }

    const handleEmployeeUpdate = (data) =>{
        updateEmployeeWithBasicDataController(data,{id:router.query.id})
        .then((response)=>{
            toast.success("Updating Employee Details")
            router.push('/admin/dashboard/hr/employees')
        })
        .catch((err)=>toast("unable to process request"))
    }

    useEffect(() => {
        getEmployeeDetails()
    }, [router.isReady,])

    return (
        <div>
            <EditEmployee employeeData={employeeData} setBasicData={setEmployeePersonalDetails} basicData={employeePersonalDetails} onFormSubmitAction={handleEmployeeUpdate} />
        </div>
    )
}

export default index