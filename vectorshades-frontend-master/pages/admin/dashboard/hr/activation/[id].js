import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getSingleActivationReqController ,approveActivationReqController} from '../../../../../src/Controllers/Hr/index'
import { getEmployeeSingleController } from '../../../../../src/Controllers/Employee/index'
import {sendEmployeeActivationReviewController} from "../../../../../src/Controllers/Employee/index"
import MultiForm from "../../../../../src/Components/MultiForm/MultiForm"
import ArButtons from "../../../../../src/Components/MultiForm/ArButtons"
import { toast } from "react-toastify"
import styles from "../../../../../src/Components/MultiForm/MultiForm.module.css"

function Details() {
    const [EmployeeData, setEmployeeData] = useState(null);
    const [ActivationData, setActivationData] = useState(null)
    const [Loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        getSingleActivationReqController({ _id: router.query.id }).then((response) => {
            setActivationData(response.data.response.request.updatedDetails)
            getEmployeeSingleController(response.data.response.request.empId).then((employee) => {
                setEmployeeData(employee.data.response.emp)
            })
        }).then(() => setLoading(false)).catch((err) => toast.error("unable to process request"))
    }, [router.query.id])

    const approveActivationRequestFunction = () => {
        approveActivationReqController(EmployeeData._id).then((e) => {
            router.push("/admin/dashboard/hr")
            toast.success("Employee Activation Request Approved")
        }).then(() => {
            const body = {
                mail:EmployeeData.personalEmail,
                name:EmployeeData.firstName,
                message:'welcome to the team'
              }
              sendEmployeeActivationReviewController(body).catch((err) => toast.error("error while sending the mail"))

        })
    }

    if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

    else {

        return (
            <>
            <section className={styles.activation_container} >
                <MultiForm key={ActivationData} empId={EmployeeData?.activationId} readOnly={true} dataDefault={ActivationData} submit={null}  />
                {EmployeeData?.onBoarded !== true && <ArButtons approveActivation={approveActivationRequestFunction} emp={EmployeeData}/> } 
            </section>
            </>
        )
    }
}
export default Details