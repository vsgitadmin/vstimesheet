import React, {useContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify';
import {
    createNoticeController,
    deleteNoticeController,
    getNoticeBYEMPController,
    getNoticeBYHRController,
    getTotalNumberOfNoticesByEmp,
    getTotalNumberOfNoticesByHr
} from '../../../../../src/Controllers/Management/index'
import {ParentStore} from '../../../../_app'
import Loader from '../../../../../src/Components/Loader/loader'
import NoticesComponent from '../../../../../src/Components/Notices/Notices';
import {Pagination} from '@mui/material';

function Notices({emp}) {
    const [NoticeData, setNoticeData] = useState([]);
    const [AuthData, setAuthData] = useState(null)
    const {ParentState} = useContext(ParentStore)
    const [noOfPages, setNoOfPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        if (ParentState !== null) checkAndFetch()
    }, [ParentState, currentPage])

    const checkAndFetch = () => {
        if (!emp) {
            if (ParentState?.auth.role === "HR") getDataByHR()
            else if (ParentState?.auth.role === "EMP") getDataByEMP()
        } else getDataByEMP()

    }

    const getDataByHR = () => {
        getTotalNumberOfNoticesByHr()
            .then((response) => {
                let pageCount = Math.ceil(response.data.response.count / 4)
                setNoOfPages(pageCount)
            })
        getNoticeBYHRController({page: currentPage})
            .then((response) => {
                setNoticeData(response.data.response.data);
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                toast.error("error fetching the data")
            })
    }

    const getDataByEMP = () => {
        getTotalNumberOfNoticesByEmp()
            .then((response) => {
                const pageCount = response.data.response.count / 20
                setNoOfPages(pageCount)
            })
        getNoticeBYEMPController({page: currentPage, emp})
            .then((response) => {
                setNoticeData(response.data.response.data);
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                toast.error("error fetching the data")
            })
    }

    const deleteNoticeControllerFunction = (id) => {
        deleteNoticeController({id: id}).then((response) => {
            checkAndFetch()
            toast.success("Notice deleted successfully")
        }).catch((err) => {
            console.log(err);
            toast.error("error deleting the notice")
        })
    }

    const createNotice = (body) => {
        createNoticeController(body).then((response) => {
            checkAndFetch()
            toast.success("Notice created successfully");
        }).catch((err) => {
            toast.error("error while creating the notice")
        })
    }

    const onPageChange = (event, value) => {
        setCurrentPage(value)
    }

    if (Loading) return <Loader/>
    else return (<>
            <NoticesComponent empView={emp ? true : false} data={NoticeData} type={ParentState?.auth.role}
                              createNotice={createNotice} deleteNotice={deleteNoticeControllerFunction}/>
            {/*{noOfPages > 1 && <Pagination count={noOfPages} onChange={onPageChange}/>}*/}
            <div className='awarded_jobs_pagination'>
                <Pagination count={noOfPages} onChange={onPageChange} className='pagination-center'/>
            </div>
        </>)
}

export default Notices