import React, { useState, useEffect, useContext } from 'react'
import Router, { useRouter } from 'next/router'
import { getEmployeeSingleController, updateEmployeeController } from "../../../../../src/Controllers/Employee/index"
import { generateActivationDocument, presignGetUrl } from '../../../../../src/Controllers/files/index'
import MultiForm from '../../../../../src/Components/MultiForm/MultiForm'
import { toast } from 'react-toastify'
import { ParentStore } from "../../../../_app"
import styles from "../../../../../src/Components/MultiForm/MultiForm.module.css"
import ArButtons from '../../../../../src/Components/ArButtons/ArButtons'
import { BACKEND_URL } from "../../../../../src/Constants/Servers/index"

function EmployeeDetailsForm({ routerObj, section }) {
    const [EmployeeData, setEmployeeData] = useState(null)
    const [Loading, setLoading] = useState(true)
    const router = routerObj ? routerObj : useRouter();
    const { ParentState } = useContext(ParentStore);
    const [documentGenerated, setDocumentGenerated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState("")

    useEffect(() => {
        if (router.query.id) {
            getEmployeeSingleController(router.query.id)
                .then((response) => {
                    setEmployeeData(response.data.response.emp)
                })
                .then(() => setLoading(false))
                .catch((err) => toast.error("unable to process request"))
        }
    }, [router.query.id])

    const editEmployeeDetails = (details) => {
        updateEmployeeController({ id: EmployeeData._id, data: details })
            .then((e) => {
                toast.success("Employee Details Updated")
            })
            .catch((err) => toast.error("unable to process request"))
    }

    const generateDocument = () => {
        setIsLoading(true)
        generateActivationDocument(EmployeeData._id)
            .then(async (resposne) => {
                // Keep the existing UX delay, but generate a short-lived S3 presigned URL
                setTimeout(async () => {
                    try {
                        toast.success("Employee Activation Form Generated")
                        const pathOrUrl = resposne?.data?.path || resposne?.data?.url;
                        if (!pathOrUrl) throw new Error("Missing document path/url");
                        const signedUrl = await presignGetUrl(pathOrUrl);
                        setDownloadUrl(signedUrl)
                        setDocumentGenerated(true)
                    } catch (e) {
                        toast.error("Unable to create download link")
                    } finally {
                        setIsLoading(false)
                    }
                }, 3000);
            }).catch((err) => {
                setIsLoading(false)
                toast.error("error occured while generating the document")
            })
    }

    if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
    else
        return (
            <>
                <section className={styles.activation_container} >
                    <MultiForm key={EmployeeData} section={section} empId={EmployeeData?._id} readOnly={EmployeeData._id !== ParentState?.auth?._id} dataDefault={EmployeeData.publicDetails} submit={editEmployeeDetails} />
                    <ArButtons generateDocument={generateDocument} documentGenerated={documentGenerated} downloadUrl={downloadUrl} isLoading={isLoading} />
                </section>
            </>
        )
}

export default EmployeeDetailsForm