import React, { useState, useEffect, useRef } from 'react'
import Table from '../../../../../src/Components/Jobs/Submission/index'
import { toast } from 'react-toastify'
import { getSubmissionsController, createSubmissionController, generateSubmissionReport } from '../../../../../src/Controllers/Jobs/index'
import CreateSubmissionPopup from '../../../../../src/Components/Popups/Jobs/Submission'
import SubmissionsFilter from '../../../../../src/Components/Filters/SubmissionsFilter'
import { Tune } from '@mui/icons-material'
import SearchIcon from '@mui/icons-material/Search'
import PaymentsIcon from '@mui/icons-material/Payments'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DownloadIcon from '@mui/icons-material/Download'
import InboxIcon from '@mui/icons-material/Inbox'
import { Pagination, Tooltip } from '@mui/material'
import ReportView from '../../../../../src/Components/General/ReportView'
import styles from '../../../../../styles/AwardedJobs.module.css'

function Submissions({ project }) {
    const [Loading, setLoading] = useState(true)
    const [submissions, setsubmissions] = useState([])
    const [create, setCreate] = useState(false)
    const [filterToggled, setFilterToggled] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState({})
    const [sortKey, setSortKey] = useState()
    const [search, setSearch] = useState()
    const reportViewRef = useRef(null)

    useEffect(() => {
        getSubmission(currentPage, sortKey?.name, sortKey?.direction, search, filters)
    }, [currentPage, sortKey, search, filters])

    const generateSubmissionReportFunction = async () => {
        reportViewRef.current.openView(generateSubmissionReport, {})
    }

    const getSubmission = async (page = 1, sortKey, sortOrder, search, filter) => {
        try {
            const { data: { response: { data: { data, page: { totalPages } } } } } = await getSubmissionsController(project ? { id: project.job, page, sortKey, search, sortOrder, ...filter } : { page, sortKey, sortOrder, search, ...filter })
            setsubmissions(data)
            setTotalPages(totalPages)
            setLoading(false)
        } catch (err) {
            toast.error('unable to fetch submissions')
        }
    }

    const createSubmission = async (data) => {
        try {
            data.jobId = project.job
            await createSubmissionController(data)
            await getSubmission()
            toast.success('submission created successfully')
            setCreate(false)
        } catch (err) {
            toast.error('unable to create submission')
        }
    }

    const clearAllFilters = () => {
        setFilters({})
        setFilterToggled(false)
    }

    if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

    return (
        <section className={styles.page}>
            <div className={styles.headerRow}>
                <div className={styles.titleBlock}>
                    <h1><span className={styles.titleIcon}><PaymentsIcon /></span>Submissions</h1>
                    <p className={styles.subtitle}>Track and manage job billing submissions</p>
                </div>
            </div>

            {create && <CreateSubmissionPopup submit={createSubmission} closePopup={() => setCreate(false)} />}

            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    {!filterToggled ? <>
                        <div className={styles.searchBox}>
                            <SearchIcon />
                            <input type="text" placeholder='Search location, project, client...' onChange={(e) => setSearch(e.target.value === '' ? undefined : e.target.value)} />
                        </div>
                        <div className={styles.filterWrap}>
                            <Tooltip title="Filters">
                                <button type="button" className={styles.iconBtn} onClick={() => setIsFilterOpen(!isFilterOpen)} aria-label="Open filters">
                                    <Tune />
                                </button>
                            </Tooltip>
                            {isFilterOpen && <SubmissionsFilter
                                render={(f) => { setIsFilterOpen(false); setFilters(f); setFilterToggled(true) }}
                                setIsFilterOpen={setIsFilterOpen}
                                onChange={() => { }}
                            />}
                        </div>
                    </> : <button className={styles.clearBtn} onClick={clearAllFilters}>Clear filters</button>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {project && <button className={styles.addBtn} onClick={() => setCreate(true)}><AddCircleOutlineIcon />Create</button>}
                    <Tooltip title="Generate Report">
                        <button type="button" className={styles.reportBtn} onClick={() => generateSubmissionReportFunction()}><DownloadIcon /></button>
                    </Tooltip>
                </div>
            </div>

            {submissions.length > 0 ? (
                <div className={styles.tableWrap}>
                    <Table onSortChange={(s) => setSortKey(s)} sortingHead={sortKey} data={submissions} projectView={project ? true : false} />
                </div>
            ) : (
                <div className={styles.emptyMonth}><InboxIcon /><h4>No submissions found</h4><p>Try adjusting your search or filters</p></div>
            )}

            {totalPages > 1 && <div className={styles.paginationWrap}>
                <Pagination count={totalPages} shape="rounded" onChange={(e, n) => setCurrentPage(n)} />
            </div>}

            <ReportView ref={reportViewRef} />
        </section>
    )
}

export default Submissions
