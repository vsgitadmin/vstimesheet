import React, { useState, useEffect, useContext, useRef } from 'react'
import Table from '../../../../../src/Components/Jobs/Submission/index'
import { toast } from 'react-toastify'
import { getSubmissionsController, createSubmissionController, generateSubmissionReport } from '../../../../../src/Controllers/Jobs/index'
import CreateSubmissionPopup from '../../../../../src/Components/Popups/Jobs/Submission'
import SubmissionsFilter from '../../../../../src/Components/Filters/SubmissionsFilter'
import { Close, Tune } from '@mui/icons-material'
import { Box, Modal, Pagination } from '@mui/material'
import ReportView from '../../../../../src/Components/General/ReportView'

function Submissions({ project }) {
    const [Loading, setLoading] = useState(true)
    const [submissions, setsubmissions] = useState([])
    const [create, setCreate] = useState(false)
    const [filterToggled, setFilterToggled] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [openReportDownloadPopup, setOpenReportDownloadPopup] = useState(false)
    const [downloadData, setDownloadData] = useState([])
    const [downloadUrl, setDownloadUrl] = useState('')
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


    if (Loading) return <div className='loader_center_parent'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>

    else

        return (
            <section className='jobs'>
                <div className="head">
                    <h1>Submissions</h1>
                </div>
                <p className='mt_1' >Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                {create && <CreateSubmissionPopup submit={createSubmission} closePopup={() => setCreate(false)} />}
                <div className='crud'>
                    <div style={{ display: "flex", alignItems: "center" }} >
                        {!filterToggled ? <>
                            <input type="text" placeholder='search submissions (location, project, client)' onChange={(e) => { if (e.target.value == '') { setSearch(undefined) } else { setSearch(e.target.value) } }} />
                            <div style={{ backgroundColor: '#E64848', cursor: 'pointer', padding: '5px', borderRadius: '5px', width: "3rem", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => setIsFilterOpen(!isFilterOpen)}><Tune style={{ fill: 'white' }} /></div></> :
                            <div className='clear_filter' >
                                <button onClick={() => { setFilters({}); setFilterToggled(false) }}>Clear filters</button>
                                {!filterToggled && <button onClick={() => animateScroll.scrollToBottom(0)} >View Analytics</button>}
                            </div>
                        }
                    </div>
                    {project &&
                        <div className='crud'>
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <button onClick={() => setCreate(true)}>CREATE</button>
                            </div>
                        </div>
                    }
                    <div className='crud'>
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <button onClick={() => generateSubmissionReportFunction()}>GENERATE REPORT</button>
                        </div>
                    </div>
                </div>
                <div className='flt_main' >
                    {isFilterOpen && <SubmissionsFilter render={(f) => { setIsFilterOpen(false); setFilters(f); setFilterToggled(true) }} setIsFilterOpen={setIsFilterOpen}
                        onChange={() => { }}
                    />}
                </div>


                <Table onSortChange={(s) => setSortKey(s)} sortingHead={sortKey} data={submissions} projectView={project ? true : false} />
                <div style={{ width: "100%", display: "flex", marginTop: '15px', justifyContent: "center" }}>
                    <Pagination count={totalPages} shape="circular" onChange={(e, n) => setCurrentPage(n)} />
                </div>
                <ReportView ref={reportViewRef}/>
            </section>
        )
}

export default Submissions
