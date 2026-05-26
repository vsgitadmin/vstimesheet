import React, { useEffect, useState } from 'react'
import { getAllActivationReq, getTotalNumberOfActivationRequestController, filterActivationReqController } from '../../../../src/Controllers/Hr/index'
import ActivationRequest from '../../../../src/Components/Hr/ActivationRequest/ActivationRequest';
import styles from '../../../../styles/Hr.module.css'
import Paging from '../../../../src/Components/Pagination/Index';
import Loader from '../../../../src/Helpers/Loader';
import NoDataFound from '../../../../src/Components/NoDataFound/NoDataFound';
import { Pagination } from '@mui/material';

function HRRequests() {
    const [Actrequest, SetActrequest] = useState([]);
    const [noOfPages, setNoOfPages] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searching, setSearching] = useState(false)

    useEffect(() => {
        getTotalNumberOfActivationRequestController().then((count) => {
            let pageCount = Math.ceil (count.data.response.total / 6)
            setNoOfPages(pageCount)
        }).then(() => setLoading(false))
    }, []);

    const fetchActivationRequests = () =>{
        getAllActivationReq(currentPage)
            .then((result) => { SetActrequest(result.data.response.requests) })
            .catch((error) => { console.log(error.message) })
    }

    useEffect(() => {
        fetchActivationRequests()
    }, [currentPage]);


    const onPageChange = (event, value) => {
        setCurrentPage(value)
    }


    const noStyle = {
        height: '76%',
        display: 'flex',
        alignItems: 'center'
    }


    const filterActivationrequest = async (e) => {
        try {
            if (e.target.value!=='') {
                setSearching(true)
                const filtered = await filterActivationReqController(e.target.value)
                SetActrequest(filtered.data.response.requests)
                return filtered.data.response.requests
            }else {
                setSearching(false)
                fetchActivationRequests()
                return []
            }
        } catch (err) { throw err }
    }

    if (Loading) return <Loader />

    return (
        <>
            <section className={styles.ar_container} >
                <h1>Activation Requests</h1>
                <p className='mt_1 grey' >Efficiently handle all account activation requests in one place</p>
                <ActivationRequest props={Actrequest} onChange={filterActivationrequest} />
                {/*{Actrequest.length > 0 ?: <div style={noStyle}><NoDataFound /></div>}*/}
                <div className='awarded_jobs_pagination' >
                    {!searching&&<Pagination count={noOfPages} className='pagination-center' onChange={onPageChange} />}
                </div>
            </section>
        </>
    )
}
export default HRRequests;