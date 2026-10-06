import styles from '../../../styles/LmsHrPage.module.css'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllTraining, searchTraining, getHrCount } from '../../Controllers/LMS';
import LmsPopup from '../Popups/LMS/LmsPopup';
import HrCard from './LmsHrCard';
import { Pagination } from "@mui/material";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import SearchIcon from '@mui/icons-material/Search'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import InboxIcon from '@mui/icons-material/Inbox'
import { useViewMode } from '../../Hooks/useViewMode'

const LmsHr = () => {

    const [lmsPopup, setLmsPopup] = useState(false)
    const [lmsData, setLmsData] = useState([])
    const [selectedTrainingData, setSelectedTrainingData] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [searching, setSearching] = useState(false)
    const [viewMode, setViewMode] = useViewMode()

    function fetchLmsData(page) {
        page = page ? page : 1
        getAllTraining({ page }).then((res) => {
            setLmsData(res.data.response)
        })
    }

    useEffect(() => {
        fetchLmsData()
        getHrCount().then((res) => {
            // backend's TRAININGS_PER_PAGE is 3 - this used to divide by 4 (the
            // wrong page size) and then add an unconditional +1 on top of that,
            // so the pagination always showed one page more than actually had
            // data, and the last page always rendered empty
            let count = ((res.data.response) / 3)
            setPageCount(Math.ceil(count))
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

    return (
        <div className={styles.page}>
            <LmsPopup data={selectedTrainingData} lmsPopup={lmsPopup} setLmsPopup={setLmsPopup} />

            <div className={styles.headerRow}>
                <div className={styles.titleBlock}>
                    <h1><span className={styles.titleIcon}><SchoolOutlinedIcon /></span>LMS</h1>
                    <p className={styles.subtitle}>Create and manage employee training programs</p>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <SearchIcon />
                    <input placeholder='Search' type="text" onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className={styles.viewToggle}>
                    <button
                        type="button"
                        className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                    >
                        <GridViewRoundedIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                    >
                        <ViewListRoundedIcon />
                    </button>
                </div>
                <Link href="/admin/dashboard/lms/create" className={styles.addBtn}>
                    <AddCircleOutlineIcon />CREATE
                </Link>
            </div>

            {lmsData.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className={styles.cardsGrid}>
                        {lmsData.map((i) => (
                            <HrCard key={i._id} setLmsPopup={setLmsPopup} setselectedTriningData={setSelectedTrainingData} data={i} viewMode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.rowsList}>
                        {lmsData.map((i) => (
                            <HrCard key={i._id} setLmsPopup={setLmsPopup} setselectedTriningData={setSelectedTrainingData} data={i} viewMode={viewMode} />
                        ))}
                    </div>
                )
            ) : (
                <div className={styles.emptyState}>
                    <InboxIcon />
                    <h4>No training programs found</h4>
                </div>
            )}

            {!searching && pageCount > 1 && <div className={styles.paginationWrap}>
                <Pagination shape="rounded" count={pageCount} onChange={handlePageChange} />
            </div>}
        </div>
    )
}

export default LmsHr
