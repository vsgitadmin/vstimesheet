import { useEffect, useState, createContext, useContext } from 'react'
import { uploadCloudS3Document, deleteS3Document } from '../../Controllers/files/index'
import { createProjectCloud, getAllProjectCloud, deleteProjectCloudController, getProjectCloudAnalytics, getPinnedProjectCloudsController, searchProjectCloudController, toogleProjectCloudPinController } from '../../Controllers/projects/index'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import styles from '../../../styles/Cloud.module.css'
import { AvatarGroup } from '@mui/material'
import ProfileImage from '../ProfileImage/Image'
import { Add, Folder } from '@mui/icons-material'
import Cloud from '../Cloud/Cloud'
import { sectionContext } from '../../../pages/admin/dashboard/projects/[id]'
import { DeleteDocument } from '../../Controllers/files/index'
import bytes from 'bytes'
import PushPinIcon from '@mui/icons-material/PushPin';
import projectSections from '../../Constants/projectSections'
import PresignedLink from '../S3/PresignedLink'

// hoisted out of ProjectCloud (was previously declared inside its render
// body, which meant it got a brand-new function identity - and so a full
// unmount/remount, losing all its state mid-upload - every time ProjectCloud
// itself re-rendered, e.g. from uploadFile's own progress state updates)
const RenderCloud = ({ projectId, setCloudSwitch, uploadFile }) => {
    const { selectedSection, setSelectedSection } = useContext(sectionContext)
    const [analytics, setAnalytics] = useState(Object.fromEntries(projectSections.map(key => [key, null])))
    const [pinnedProjects, setPinnedProjects] = useState()
    const [searchObjects, setSearchObjects] = useState([])
    // drag-and-drop straight onto a folder card, so a file can be
    // uploaded into that section without opening the folder first
    const [dragOverSection, setDragOverSection] = useState(null)
    const [uploadingSections, setUploadingSections] = useState({})

    useEffect(() => {
        fetchProjectCloudAnalytics()
        getPinnedFiles()
    }, [])

    const handleFolderDragOver = (e, section) => {
        e.preventDefault()
        e.stopPropagation()
        if (dragOverSection !== section) setDragOverSection(section)
    }

    const handleFolderDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOverSection(null)
    }

    const handleFolderDrop = async (e, section) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOverSection(null)
        const files = Array.from(e.dataTransfer?.files || [])
        if (files.length === 0) return
        setUploadingSections((prev) => ({ ...prev, [section]: true }))
        try {
            for (const file of files) {
                await uploadFile(file, section)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setUploadingSections((prev) => ({ ...prev, [section]: false }))
            fetchProjectCloudAnalytics()
        }
    }

    const fetchProjectCloudAnalytics = () => {
        getProjectCloudAnalytics({ id: projectId })
            .then((response) => {
                const analytics = Object.fromEntries(projectSections.map(key => [key, null]))
                response.data.response.data.map((details, index) => {
                    analytics[details._id] = details
                })
                setAnalytics(analytics)
            }).catch((err) => toast.error('error fetching the project clouds'))
    }

    const getPinnedFiles = () => {
        getPinnedProjectCloudsController({ id: projectId })
            .then((response) => setPinnedProjects(response.data.response.data))
            .catch((err) => toast.error('error fetching the pinned files'))
    }
    const pinFiles = (id) => {
        toogleProjectCloudPinController({ id: id })
            .then((response) => getPinnedFiles(1))
            .catch((err) => toast.error('error occured'))
    }

    return (
        <div className={styles.pr_cloud} >
            <div style={{ paddingBottom: "10px" }} >
                <h2>Cloud</h2>
            </div>
            <div className={styles.pr_cloud_top_folders} >
                {projectSections.map((value, index) =>
                    <div
                        key={value}
                        className={`${styles.pr_cloud_top_folder} ${dragOverSection === value ? styles.pr_cloud_top_folder_dragover : ''}`}
                        onClick={() => { setCloudSwitch(true); setSelectedSection(value) }}
                        onDragOver={(e) => handleFolderDragOver(e, value)}
                        onDragLeave={handleFolderDragLeave}
                        onDrop={(e) => handleFolderDrop(e, value)}
                    >
                        {uploadingSections[value] && <span className={styles.pr_cloud_top_folder_uploading_badge}>Uploading...</span>}
                        <div className={styles.pr_cloud_top_folder_top} >
                            {analytics[value] ? analytics[value].users.map((user) =>
                                <ProfileImage id={user} />
                            ) : <div className={styles.pr_cloud_top_folder_top} > </div>}
                        </div>
                        <div className={styles.pr_cloud_top_folder_name} >
                            <h2><Folder /> {value}</h2>
                        </div>
                        <div className={styles.pr_cloud_top_folder_bottom} >
                            {analytics[value] ? <span>{bytes(analytics[value].totalSize)}</span> : <span>0 MB </span>}
                            {analytics[value] ? <span>{analytics[value].noOfFiles} files</span> : <span> 0 files</span>}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.pinned_files} >
                <h2>Pinned Files</h2>
            </div>

            <div className={styles.pr_cloud_small_folders} >
                {
                    pinnedProjects && pinnedProjects.map((file) =>
                        <div className={styles.pr_cloud_small_folder} >
                            <span style={{ marginLeft: 'auto' }} onClick={(e) => pinFiles(file._id)}> <PushPinIcon /> </span>
                            <span><Folder /> </span>
                            <PresignedLink target="_blank" rel="noreferrer" s3Ref={file.attributes?.key || file.location}>
                                <div className={styles.pr_cloud_small_folder_bottom} >
                                    <h3>{file.fileName}</h3>
                                    <div>
                                        <span>{bytes(file.attributes.size)}</span>
                                        <span>{file.section}</span>
                                    </div>
                                </div>
                            </PresignedLink>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

function ProjectCloud() {
    const router = useRouter()
    const [cloudSwitch, setCloudSwitch] = useState(false)
    const [cloudData, setCloudData] = useState([])
    const [loader, setLoader] = useState(true)
    const { selectedSection } = useContext(sectionContext)
    const [uploadPercent, setuploadPercent] = useState(0)
    const [Uploading, setUploading] = useState(false)
    const [UploadedFile, setUploadedFile] = useState(null)

    // `sectionOverride` lets a caller upload straight into a specific
    // section without first switching the active tab (e.g. dropping a file
    // onto a folder card while looking at the whole folder grid) - returns
    // the upload promise so callers can await/refresh after it completes
    const uploadFile = (file, sectionOverride) => {
        const section = sectionOverride || selectedSection
        var formData = new FormData();
        formData.append("file", file);
        const file_upload = { name: file.name, size: file.size }
        setUploadedFile(file_upload)
        setUploading(true)
        setuploadPercent(0)
        const upload = uploadCloudS3Document(file, `/projectcloud/${router.query.id}/${section}/${file.name}`)

        upload.on('httpUploadProgress', (progress) => {
            const percentCompleted = Math.round((progress.loaded / progress.total) * 100);
            setuploadPercent(percentCompleted)
        });

        return upload.promise().then(async (data) => {
            const body = {
                fileName: file.name,
                location: data.Location,
                section: section,
                projectId: router.query.id,
                attributes: {
                    key: `/projectcloud/${router.query.id}/${section}/${file.name}`,
                    format: file.type,
                    size: file.size
                }
            }
            await createProjectCloud(body)
            if (section === selectedSection) await fetchProjectClouds(1)
            toast.success("File uploaded successfully")
        })
        .catch((err) => {
            console.log(err)
            toast.error("unable to process request")
            throw err
        })
    }

    const deleteProjectCloud = async (data) => {
        try {
            await deleteS3Document(data.attributes.key)
            await deleteProjectCloudController({ id: data._id })
            setTimeout(async () => {
                await fetchProjectClouds(1)
            }, 500)
        } catch (err) {
            toast.err("unable to process request")
        }
    }

    const fetchProjectClouds = async (page) => {
        getAllProjectCloud({ id: router.query.id, page: page, section: selectedSection })
            .then((response) => { setLoader(false); setCloudData(response.data.response.files) })
    }

    const searchFiles = (e) => {
        searchProjectCloudController({ id: router.query.id, section: selectedSection, search: e.target.value })
            .then((response) => setCloudData(response.data.response.data))
    }

    const pinFiles = (id) => {
        toogleProjectCloudPinController({ id: id })
            .then((response) => fetchProjectClouds(1))
            .catch((err) => toast.error('error occured'))
    }

    useEffect(() => {
        fetchProjectClouds(1)
    }, [selectedSection])

    return (
        <>
            {!cloudSwitch
                ? <RenderCloud projectId={router.query.id} setCloudSwitch={setCloudSwitch} uploadFile={uploadFile} />
                : <Cloud loading={loader} data={cloudData} loadFile={uploadFile} upload={uploadPercent} file={UploadedFile} uploading={Uploading} typeOfCloud={'projectCloud'} section={selectedSection} deleteFunc={deleteProjectCloud} search={searchFiles} pinFunc={pinFiles} isCloud={true} setCloudSwitch={setCloudSwitch} />}
        </>
    )

}

export default ProjectCloud

