import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loader from '../../../../../src/Components/Loader/loader'
import { getEmployeePerformanceController } from '../../../../../src/Controllers/projects/index'
import EmployeePerformanceComponent from '../../../../../src/Components/EmployeePerformance/EmployeePerformance';
import { ParentStore } from '../../../../_app';

function EmployeePerformance({ id }) {
    const { ParentState } = useContext(ParentStore)
    const [Performance, setPerformance] = useState([]);
    const [Role, setRole] = useState('')
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        getEmployeePerformance()
    }, [])

    const getEmployeePerformance = () => {
        getEmployeePerformanceController(id ? { user: id } : null)
            .then(({ data }) => {
                setPerformance(data.response.data);
                setRole(data.response.role)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                toast.error("error fetching the data")
            })
    }


    if (Loading) return <Loader />
    else return (
        <>
            <EmployeePerformanceComponent employee={id ? id : ParentState?.auth?._id} adminView={id ? true : false} Performance={Performance} Role={Role}/>
        </>
    )
}

export default EmployeePerformance