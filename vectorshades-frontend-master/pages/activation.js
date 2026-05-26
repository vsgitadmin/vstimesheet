import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { getSingleActivationReqController, ActivationReqController, UpdateSingleActivationReqController } from '../src/Controllers/Hr/index'
import { getEmployeeByActivationIdController } from '../src/Controllers/Employee/index'
import { toast } from 'react-toastify';
import MultiForm from '../src/Components/MultiForm/MultiForm'
import ConfirmationSent from '../src/Components/ConfirmationSent/ConfirmationSent';
import { ParentStore } from "./_app"
import Router from 'next/router';

function activation() {
    const [EmployeeData, setEmployeeData] = useState(null);
    const [ActivationData, setActivationData] = useState(null)
    const [Submitted, setSubmitted] = useState(false)
    const [Loading, setLoading] = useState(true)
    const router = useRouter();
    const { ParentState, setParentState } = useContext(ParentStore)

    useEffect(() => {
        if (router.asPath.split('id=').length > 1) {
            getEmployeeByActivationIdController(router.asPath.split('id=')[1]).then((response) => {
                setEmployeeData(response.data.response.employee)
                getSingleActivationReqController({ empId: response.data.response.employee.emp._id })
                    .then((data) => {
                        setActivationData(data.data.response.request?.updatedDetails);
                    })
            }).then(() => setLoading(false))
                .catch((err) => toast.error("Please verify the url or contact HR"))
        }
    }, [])


    const submitActivationRequest = async (formData) => {
        const data = {
            activationId: EmployeeData.emp.activationId,
            updatedDetails: formData
        }
        try {
            if (EmployeeData.activation) await UpdateSingleActivationReqController(EmployeeData.activation._id, data)
            else await ActivationReqController(data)
            setSubmitted(true)
            toast.success("activation requested")
        } catch (err) { toast.error("unable to process request") }
    }

    if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

    else {
        if (EmployeeData && !Submitted)
            return (
                <>
                    <MultiForm key={ActivationData} empId={Router.query.id} dataDefault={ActivationData} submit={submitActivationRequest} />
                </>
            )
        else if (Submitted) {
            return (
                <ConfirmationSent />
            )
        }
        else {
            return (
                <h1>Invalid URL or activation ID</h1>
            )
        }
    }

}

export default activation