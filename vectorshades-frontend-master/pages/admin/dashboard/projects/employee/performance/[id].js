import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loader from '../../../../../../src/Components/Loader/loader'
import { getEmployeePerformanceController } from '../../../../../../src/Controllers/projects/index'
import EmployeePerformanceComponent from '../../../../../../src/Components/EmployeePerformance/EmployeePerformance';
import { useRouter } from 'next/router';

function EmployeePerformance({ id }) {
    const router = useRouter()
    id = router.query.id
    const [Performance, setPerformance] = useState([]);
    const [Role, setRole] = useState('')
    const [Loading, setLoading] = useState(true);
    const [metricType, setmetricType] = useState('hourly')

    useEffect(() => {
        if(router.query.id) getEmployeePerformance(metricType)
    }, [])

    const getEmployeePerformance = (metric) => {
        getEmployeePerformanceController(id ? { user: id , metric } : null)
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

    function toggleMetric() {
        let newMetric = metricType === 'hourly' ? 'billing' : 'hourly';
        getEmployeePerformance(newMetric)
        setmetricType(newMetric)
    }

    if (Loading) return <Loader />
    else return (
        <>
            <EmployeePerformanceComponent employee={'ff'} metricType={metricType} metricToggle={toggleMetric} adminView={id ? true : false} Performance={Performance} Role={metricType === 'hourly' ? 'EMP' : 'SA'}/>
        </>
    )
}

export default EmployeePerformance