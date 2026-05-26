import { Modal } from '@mui/material';
import styles from './Popup.module.css'
import style from '../../Popups/Hr/Popup.module.css'
import { InsertDriveFileOutlined, Search } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import AsyncLoop from '../../../Helpers/General/AsyncLoop';
import { uploadCloudS3Document } from '../../../Controllers/files';
import { ParentStore } from "../../../../pages/_app";
import { toast } from 'react-toastify';
import UploadBulkOngoingPopup from './BulkUploadOngoingPopup';
import {
    createBulkBatchController,
    createCloudObject,
    forwardCloudObject,
    updateBulkBatchFileController
} from '../../../Controllers/Cloud';
import { getEmployeeBasicDetailsController } from '../../../Controllers/Employee';
import { sendEmail } from '../../../Controllers/Communication';
import companyDocTypes from '../../../Constants/companyDocs';
import { useRouter } from 'next/router';

const UploadBulkPopup = ({ uploadBulkPopup, setUploadBulkPopup, defaultFiles, getAllDocuments }) => {
    const router = useRouter()
    const [filesToUpload, setfilesToUpload] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadedFiles, setuploadedFiles] = useState([])
    const { ParentState } = useContext(ParentStore)
    const [uploadBulkOngoingPopup, setUploadBulkOngoingPopup] = useState(false)
    const [currentFile, setCurrentFile] = useState({ name: 'unknown' })
    const [bulkFileSearch, setbulkFileSearch] = useState('')
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadCompleted, setuploadCompleted] = useState(false)

    const handleFileSelect = (e) => {
        let files = e.target.files
        setfilesToUpload([...files, ...filesToUpload])
    }

    const uploadSubmitHandler = async (e) => {
        e.preventDefault();
        setUploadProgress({});

        const uploadPromises = filesToUpload.map(file =>
            uploadFile(file, setUploadProgress)
        );

        try {
            setUploadBulkOngoingPopup(true)
            setUploading(true)
            const allUploadedFiles = await Promise.all(uploadPromises);
            await createBulkBatchController(({
                "title": e.target[0].value,
                "description": e.target[2].value,
                "type": e.target[3].value,
                "batchId": e.target[1].value,
                "uploadType": e.target[4].value,
                "files": allUploadedFiles
            }))
            setuploadCompleted(true)
        } catch (error) {
            toast.error("One or more files failed to upload", error);
        }
    };

    const uploadFile = (file, progressSetter) => {
        return new Promise((resolve, reject) => {
            const upload = uploadCloudS3Document(file, `cloud/${ParentState.auth._id}/${file.name}`);

            upload.on('httpUploadProgress', (progress) => {
                const percentCompleted = Math.round((progress.loaded / progress.total) * 100);
                progressSetter(prevProgress => ({
                    ...prevProgress,
                    [file.name]: percentCompleted
                }));
            });

            upload.promise()
                .then(async (data) => {
                    const body = {
                        employeeId: ParentState.auth._id,
                        fileName: file.name,
                        location: data.Location,
                        public: false,
                        attributes: {
                            key: `companydocuments/${file.name}`,
                            format: file.type,
                            size: file.size
                        }
                    };
                    let res = await createCloudObject(body);
                    resolve(res.data.response.files);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    useEffect(() => {
        if (defaultFiles) {
            setfilesToUpload(defaultFiles)
        }
    }, [defaultFiles])

    return (<>
        <Modal open={uploadBulkPopup} sx={{ cursor: uploading ? 'progress' : 'pointer' }} onClose={() => {
            !uploading && setUploadBulkPopup(false)
        }}>
            <div className={`${styles.create_notice_popup} ${styles.upload_bulk}`}>
                <div className={styles.cn_title}>
                    <h2>Upload Bulk</h2>
                </div>
                <form onSubmit={uploadSubmitHandler}>
                    <div className={styles.cn_form_group}>
                        <label>Title</label>
                        <input type="text" disabled={uploading} placeholder='Enter Title' />
                    </div>

                    <div className={styles.cn_form_group}>
                        <label>Batch id</label>
                        <input type="text" disabled={uploading} placeholder='Enter batch id' />
                    </div>

                    <div className={styles.cn_form_group}>
                        <label>Description</label>
                        <textarea disabled={uploading} placeholder='Description'
                            style={{ height: "4rem" }}></textarea>
                    </div>

                    <div className={styles.cn_form_group}>
                        <label>Document Type</label>
                        <select disabled={uploading}>
                            <option hidden>Select Type</option>
                            {companyDocTypes.map((e) => {
                                return (
                                    <option value={e}>{e}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className={styles.cn_form_group}>
                        <label>Upload Type</label>
                        <select disabled={uploading}>
                            <option hidden>Select Type</option>
                            <option value={'batch'}>Batch</option>
                            <option value={'intelligent'}>Intelligent</option>
                        </select>
                    </div>

                    <div className={style.ce_file_upload_main}>
                        <label>Upload Documents</label>
                        <div className={style.ce_file_upload}>
                            <div>
                                <input disabled={uploading} multiple onChange={handleFileSelect}
                                    placeholder='Upload Documents' type="file" />
                                <p>Drag and drop files here, or click to select files</p>
                            </div>
                        </div>
                    </div>


                    <div className={`${styles.cn_search} mt_2`}>
                        <input onChange={(e) => {
                            setbulkFileSearch(e.target.value)
                        }} type="text" placeholder='Search file' />
                        <div>
                            <Search />
                        </div>
                    </div>


                    <div style={{
                        marginTop: "10px",
                        border: 'solid 1px lightgrey',
                        borderRadius: '10px',
                        padding: '10px',
                        width: '100%',
                        overflowX: 'auto',
                        display: 'flex'
                    }}>
                        {filesToUpload?.filter((item) => {
                            if (bulkFileSearch === '') {
                                return item
                            } else {
                                return item.name.toLocaleLowerCase().includes(bulkFileSearch.toLocaleLowerCase())
                            }
                        }).map((f) => {
                            return <div style={{
                                marginRight: '10px',
                                display: 'flex',
                                alignContent: 'center',
                                alignItems: 'center',
                                border: 'solid 1px lightgrey',
                                borderRadius: '10px',
                                padding: '5px'
                            }}>
                                <InsertDriveFileOutlined /><span style={{
                                    maxHeight: '20px',
                                    overflow: 'hidden',
                                    width: 'fit-content',
                                    height: '20px',
                                    whiteSpace: 'nowrap'
                                }}>{f.name}</span>
                            </div>
                        })}

                    </div>

                    <div className={styles.cn_form_group}>
                        <button disabled={uploading} style={{ cursor: uploading ? 'progress' : 'pointer' }}
                            type='submit'>UPLOAD
                        </button>
                    </div>
                </form>

                <UploadBulkOngoingPopup close={() => {
                    setUploadBulkPopup(false)
                    if (uploadCompleted === true) {
                        toast.success('Bulk Document Upload Successfull')
                        router.reload()
                    }
                }} currentFile={currentFile} uploadBulkOngoingPopup={uploadBulkOngoingPopup}
                    setUploadBulkOngoingPopup={setUploadBulkOngoingPopup}
                    filesToUpload={filesToUpload} uploadCompleted={uploadCompleted} uploadedFiles={uploadedFiles} progressFiles={uploadProgress}
                    uploading={uploading} />

            </div>
        </Modal>
    </>)
}

export default UploadBulkPopup