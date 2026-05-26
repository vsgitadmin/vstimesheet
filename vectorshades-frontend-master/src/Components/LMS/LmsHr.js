import styles from '../../../styles/LMS.module.css'
import style from '../../../styles/Hr.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllTraining, searchTraining, getHrCount } from '../../Controllers/LMS';
import LmsPopup from '../Popups/LMS/LmsPopup';
import HrCard from './LmsHrCard';
import { Pagination } from "@mui/material";
import NoDataFound from "../NoDataFound/NoDataFound"

const LmsHr = () => {

    const [lmsPopup, setLmsPopup] = useState(false)
    const [lmsData, setLmsData] = useState([])
    const [selectedTrainingData, setSelectedTrainingData] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [searching, setSearching] = useState(false)

    function fetchLmsData(page) {
        page = page ? page : 1
        getAllTraining({ page }).then((res) => {
            setLmsData(res.data.response)
        })
    }

    useEffect(() => {
        fetchLmsData()
        getHrCount().then((res) => {
            let count = ((res.data.response) / 4)
            setPageCount(Math.ceil(count) + 1)
        })
    }, [])

    useEffect(() => {
        fetchLmsData(currentPage)
    }, [currentPage]);

    const handleSearch = (query) => {
        if (query !== '') {
            setSearching(true)
            searchTraining({ query }).then((res) => {
                setLmsData(res.data.response);
            })
        } else {
            fetchLmsData(currentPage)
            setSearching(false)
        }

    }

    function handlePageChange(e, value) {
        setCurrentPage(value)
    }

    return (<div className="container">
        <LmsPopup data={selectedTrainingData} lmsPopup={lmsPopup} setLmsPopup={setLmsPopup} />
        <div>
            <h2>LMS</h2>
            {/* <p className='mt_1' >Lorem Ipsum is simply dummy text of the printing and typesetting industry</p> */}
        </div>

        <div className={style.em_search_filter_main}>
            <div className={style.ar_search_filter}>
                <input placeholder='Search' type="text" onChange={(e) => handleSearch(e.target.value)} />
                {/* <div><Tune style={{ fill: 'white' }} /></div> */}
            </div>
            <div className={style.create_button}>
                <Link href="/admin/dashboard/lms/create">
                    <button>CREATE</button>
                </Link>
            </div>
        </div>


        <div className={styles.lms_container}>
            <div className={styles.ongoing_container} style={{ width: "100%" }}>
                {lmsData?.map((i) => {
                    return <HrCard setLmsPopup={setLmsPopup} setselectedTriningData={setSelectedTrainingData}
                        data={i} />
                })}
            </div>
        </div>
        <div style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30px'
        }}>
            {!searching && <Pagination count={pageCount} onChange={handlePageChange} />}
        </div>
        {lmsData.length===0&&<NoDataFound/>}

    </div>)
}

export default LmsHr