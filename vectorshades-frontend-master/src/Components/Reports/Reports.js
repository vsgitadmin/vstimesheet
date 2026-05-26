import { useState, useEffect } from "react";
import {
    ArrowDropDown,
    DeleteOutline,
    MoreVert,
    Refresh,
    ViewAgenda,
    Window,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import styles from "../../../styles/Reports.module.css";
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
import { BACKEND_URL } from "../../Constants/Servers";
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

    if (Loading) return <Loader />;
    else
        return (
            <>
                <div className={styles.rp_container}>
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
                    <div className={styles.rp_bottom}>
                        <div className={styles.rp_title}>
                            <h2>Reports</h2>
                        </div>
                        <p className='mt_1 grey' >Effortlessly create comprehensive reports and download them with ease</p>
                        <div className={styles.rp_filter}>
                            <div>
                                {/* <span>Sort by:</span> Type <ArrowDropDown /> */}
                            </div>
                            <div className={styles.rp_create_btn}>
                                <button onClick={() => setCreateReportPopup(true)}>
                                    CREATE
                                </button>
                                <button onClick={() => setOpenPresetsPopup(true)}>
                                    PRESETS
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.rp_boxes}>
                        {ReportsData.map((data) => {
                            const date = new Date(data.createdAt);
                            const options = {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            };
                            const formattedDate = date.toLocaleDateString("en-US", options);
                            return (
                                <div className={styles.rp_box}>
                                    <div className={styles.more_icon}>
                                        <div onClick={() => deleteReports(data._id)}>
                                            <DeleteOutline style={{ fill: "grey", fontSize: "35px", cursor: "pointer" }} />
                                        </div>
                                        <div onClick={() => refreshReports(data._id)}>
                                            <Refresh style={{ fill: "grey", fontSize: "35px" }} />
                                        </div>

                                    </div>
                                    <div className={styles.rp_box_img}>
                                        <img
                                            src="https://www.svgrepo.com/show/532166/document-layout-left.svg"
                                            alt="img"
                                        />
                                    </div>
                                    <div className={styles.rp_box_name}>
                                        <h3>{data.file}</h3>
                                        <h4>{data.type}</h4>
                                        <h4>{formattedDate}</h4>
                                    </div>
                                    <div className={styles.rp_box_bottom}>
                                        <a onClick={() => fetchAndLoadTableView(data.url)} download>
                                            Download
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {ReportData && <AnchorReportView data={ReportData} link={link} close={() => setReportData(null)}/>}  
                    {pageCount > 1 && <div className="mt_4 project_pagination" > <Pagination className="pagination-center" count={pageCount} onChange={onPageChange} /> </div>}
                </div>
            </>
        );
};

export default Reports;