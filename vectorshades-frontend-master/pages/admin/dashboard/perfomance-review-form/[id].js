import React, { useContext, useEffect, useState } from 'react'
import ReviewCardPopup from '../../../../src/Components/Popups/General/ReviewCardPopup'
import { getReviewRequestByIdController, createReviewController } from '../../../../src/Controllers/Reviews/index'
import { useRouter } from 'next/router'
import { ParentStore } from '../../../_app'
import { toast } from 'react-toastify'

function index() {
    const router = useRouter()
    const { ParentState } = useContext(ParentStore)
    const [reqDetails, setReqDetails] = useState(null)

    const getReviewRequestDetails = async () => {
        getReviewRequestByIdController({ id: router.query.id })
            .then((response) => {
                setReqDetails(response.data.response.data)
                if (response.data.response.data.requestedTo !== ParentState.auth._id) {
                    toast("Access Revoked")
                    router.push('/admin/dashboard')
                }
            })
            .catch((Err) => toast("unable to process request"))
    }

    const reviewEmployee = async (body) => {
        body = {
            ...body, employeeId: reqDetails.requestedBy,
            requestId:reqDetails._id,
            reviewBy: {
                _id: ParentState.auth._id, firstName: ParentState.auth.firstName, lastName: ParentState.auth.lastName,
                designation: ParentState.auth.designation,
            },
        }
        await createReviewController(body)
            .then((res) => toast("Review Submitted"))
            .then(() => router.push('/admin/dashboard/review-requests'))
            .catch((err) => toast("unable to process request"))
    }

    useEffect(() => {
        if (router.query.id) {
            getReviewRequestDetails()
        }
    }, [router.query.id])

    return (
        <div>
            <ReviewCardPopup reviewEmployee={reviewEmployee} />
        </div>
    )
}

export default index