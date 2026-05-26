import { useEffect, useState } from 'react'
import Leaves from '../../../src/Components/Hr/Leaves/Leaves'
import { ApproveLeavesByHRController, getLeaveCountController, updateLeaveController ,rejectLeaveController} from "../../../src/Controllers/Employee/index"
import { getAllForwardedLeaves } from '../../../src/Controllers/Hr/index'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import styles from '../../../styles/Hr.module.css'


function leaves() {
    const router = useRouter()
    const [leaveData, setleaveData] = useState([])

    useEffect(() => {
        getAllForwardedLeavesController()
    }, [])

    const getAllForwardedLeavesController = () => {
        getAllForwardedLeaves()
            .then((response) => setleaveData(response.data.response.data))
            .catch((err) => toast("unable to process request"))
    }

    const approveLeaveController = (id) => {
        ApproveLeavesByHRController(id)
            .then((response) => toast("Leave Updated"))
            .then(() => getAllForwardedLeavesController())
            .catch((err) => toast("unable to process request"))
    }

    const rejectLeave= (id,message) =>{
        rejectLeaveController({id},message)
        .then(() => getAllForwardedLeavesController())
        .then(() => toast.success("Leave Rejected Successfully"))
        .catch((err) =>toast.error("unable to process request"))
    }

    return (
        <div>
            <>
                <section className={styles.lv_container} >
                    <h1>Forwarded Leaves</h1>
                    <p className='mt_1 grey' >Manage forwarded leave requests, take actions easily</p>
                    <Leaves rejectLeave={rejectLeave} approveLeave={(id) => approveLeaveController(id)} data={leaveData} />
                </section>
            </>
        </div>
    )
}

export default leaves