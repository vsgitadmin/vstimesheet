import { useState, useEffect } from "react";
import {
    DeleteOutline,
    Refresh,
} from "@mui/icons-material";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import { useViewMode } from '../../Hooks/useViewMode'
import { toast } from "react-toastify";
import styles from "../../../styles/ReportsPage.module.css";
import {
    getAllReportsController,
    deleteReportsController,
    createReportsController,
    getAllReportsKeysController,
    refreshReportsController,
    getTotalNumberOfReports
} from "../../Controllers/Reports/index";
import Loader from "../Loader/loader";
import CreateReportPopup from "../Popups/General/CreateReportPopup";
import PresetsPopup from "../Popups/General/PresetReportsPopup";
import { Pagination } from "@mui/material";
import { fetchCSVData } from "../../Helpers/Functions/Api Functions/readFileData";
import AnchorReportView from "../General/AnchorReportView";

const Reports = () => {
    const [ReportsData, setReportsData] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [createReportPopup, setCreateReportPopup] = useState(false);
    const [pageCount, setPageCount] = useState(1)
    const [Keys, setKeys] = useState(null);
    const [ReportData, setReportData] = useState(null)
    const [link, setlink] = useState()
    const [openPresetsPopup, setOpenPresetsPopup] = useState(false);
    const [viewMode, setViewMode] = useViewMode()

    useEffect(() => {
        getNumberOfReports()
        getAllReportsKeysController()
            .then(({ data }) => {
                setKeys(data.response.keys)
                fetchReports(1);
            })
            .catch((err) => toast.error("unable to process request"));
    }, []);

    const fetchAndLoadTableView = async (url) => {
        const data = await fetchCSVData(url)
        setReportData(data)
        setlink(url)
    }

    const createReportFunction = async (body) => {
        try {
            body.download = true
            let { data } = await createReportsController(body);
            toast.success("Report created successfully")
            setCreateReportPopup(false)
            await refreshReports(data.response.data._id,true)
            fetchReports(1);
        } catch (error) {
            console.log(error);
            toast.error("Report could not be created");
        }
    };

    const refreshReports = async (id,log) => {
        try {
            let req = refreshReportsController({ id });
            if(!log) toast.promise(req, { success: "Report refreshed successfully", pending: "refreshing", error: "Report refresh failed" })
        } catch (error) {
            console.log(error);
            toast.error("Report could not be created");
        }
    }

    const fetchReports = async (page, log) => {
        try {
            const data = await getAllReportsController({ page });
            if (log) toast.success("Reports fetched successfully");
            setReportsData(data.data.response.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch reports");
        }
    };

    const deleteReports = async (id) => {
        try {
            let req = deleteReportsController({ id });
            toast.promise(req, { success: "Reports deleted successfully", pending: "Deleting report", error: "error deleting report" }).then(() => {
                fetchReports(1, false);
            }).catch((err) => {
                console.log(err)
            })

        } catch (err) {
            toast.error("Failed to delete reports");
        }
    };

    const getNumberOfReports = () => {
        getTotalNumberOfReports().then((response) => {
            const pageCount = response.data.response.count / 9
            setPageCount(Math.ceil(pageCount))
        })
    }

    const onPageChange = (event, value) => {
        fetchReports(value)
    }

    const formatDate = (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }

    if (Loading) return <Loader />;
    else
        return (
            <>
                <div className={styles.page}>
                    <CreateReportPopup
                        createReportPopup={createReportPopup}
                        setCreateReportPopup={setCreateReportPopup}
                        createReport={createReportFunction}
                        Keys={Keys}
                    />
                    <PresetsPopup
                        open={openPresetsPopup}
                        setOpen={setOpenPresetsPopup}
                        clientList={["Client 1", "Client 2", "Client 3"]}
                    />

                    <div className={styles.headerRow}>
                        <div className={styles.titleBlock}>
                            <h1><span className={styles.titleIcon}><DescriptionOutlinedIcon /></span>Reports</h1>
                            <p className={styles.subtitle}>Effortlessly create comprehensive reports and download them with ease</p>
                        </div>
                    </div>

                    <div className={styles.toolbar}>
                        <button type="button" className={styles.actionBtn} onClick={() => setCreateReportPopup(true)}>
                            <AddCircleOutlineIcon />CREATE
                        </button>
                        <button type="button" className={`${styles.actionBtn} ${styles.actionBtnOutline}`} onClick={() => setOpenPresetsPopup(true)}>
                            <BookmarkAddOutlinedIcon />PRESETS
                        </button>
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
                    </div>

                    {ReportsData.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className={styles.cardsGrid}>
                                {ReportsData.map((data) => (
                                    <div className={styles.card} key={data._id}>
                                        <div className={styles.cardActions}>
                                            <button type="button" className={styles.iconBtn} onClick={() => refreshReports(data._id)} aria-label="Refresh report">
                                                <Refresh />
                                            </button>
                                            <button type="button" className={styles.iconBtn} onClick={() => deleteReports(data._id)} aria-label="Delete report">
                                                <DeleteOutline />
                                            </button>
                                        </div>
                                        <div className={styles.fileIconWrap}>
                                            <InsertDriveFileOutlinedIcon />
                                        </div>
                                        <div className={styles.fileInfo}>
                                            <h3>{data.file}</h3>
                                            <h4>{data.type} &middot; {formatDate(data.createdAt)}</h4>
                                        </div>
                                        <div className={styles.cardFooter}>
                                            <span className={styles.viewLink} onClick={() => fetchAndLoadTableView(data.url)}>
                                                <VisibilityOutlinedIcon />View Report
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.rowsList}>
                                {ReportsData.map((data) => (
                                    <div className={styles.row} key={data._id}>
                                        <div className={styles.fileIconWrap}>
                                            <InsertDriveFileOutlinedIcon />
                                        </div>
                                        <div className={styles.rowInfo}>
                                            <h3>{data.file}</h3>
                                            <h4>{data.type} &middot; {formatDate(data.createdAt)}</h4>
                                        </div>
                                        <div className={styles.rowActions}>
                                            <span className={styles.viewLink} onClick={() => fetchAndLoadTableView(data.url)}>
                                                <VisibilityOutlinedIcon />View
                                            </span>
                                            <button type="button" className={styles.iconBtn} onClick={() => refreshReports(data._id)} aria-label="Refresh report">
                                                <Refresh />
                                            </button>
                                            <button type="button" className={styles.iconBtn} onClick={() => deleteReports(data._id)} aria-label="Delete report">
                                                <DeleteOutline />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className={styles.emptyState}>
                            <InsertDriveFileOutlinedIcon />
                            <h4>No reports found</h4>
                        </div>
                    )}

                    {ReportData && <AnchorReportView data={ReportData} link={link} close={() => setReportData(null)}/>}
                    {pageCount > 1 && <div className={styles.paginationWrap} > <Pagination shape="rounded" count={pageCount} onChange={onPageChange} /> </div>}
                </div>
            </>
        );
};

export default Reports;
