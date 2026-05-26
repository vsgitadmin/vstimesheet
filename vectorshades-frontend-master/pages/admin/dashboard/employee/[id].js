import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { getEmployeeTimeSheetController, getEmployeeController } from '../../../../src/Controllers/Employee/index'
import Employee from "../../../../src/Components/Hr/EmployeeProfile/Employee"

function Details() {
    const router = useRouter()
    const [employee, setEmployee] = useState(null)

    useEffect(() => {
        getEmployeeController(router.query.id).then((employeeInfo) => {
            getEmployeeTimeSheetController(router.query.id).then((employeeData) => {
                setEmployee({ employee: employeeInfo.data.response.emp, timeSheet: employeeData.data.response.log })
            })
        })

    }, [router.query.id])

   return (
    <section style={{width:'100%'}}>
        <Employee/>
    </section>
   )

}
export default Details