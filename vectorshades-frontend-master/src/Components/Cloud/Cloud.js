import { Tooltip } from '@mui/material'
import { Modal } from '@mui/material'
import styles from '../../../styles/CloudPage.module.css'
import FileInput from '../DraggableFileInput'
import Loader from '../Loader/loader'
import FileIcon from '../FileIcon/FileIcon'
import bytes from 'bytes'
import AddMemberPopup from "../../Components/Popups/General/AddMemberPopup"
import { useEffect, useState } from 'react'
import AsyncLoop from '../../Helpers/General/AsyncLoop'
import { toast } from "react-toastify";
import PresignedLink from "../S3/PresignedLink";
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import SearchIcon from '@mui/icons-material/Search'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import ReplyAllIcon from '@mui/icons-material/ReplyAll'
import InboxIcon from '@mui/icons-material/Inbox'
import { useViewMode } from '../../Hooks/useViewMode'

const Cloud = ({ viewer, data, loading, loadFile, forwardFile, deleteFunc, search, typeOfCloud, pinFunc, isCloud, setCloudSwitch, file, upload, uploading, getCloudObject, currentPage }) => {
  const [showAdminCloudPopup, setShowAdminCloudPopup] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState('')
  const [viewMode, setViewMode] = useViewMode()
  const [timeOutString, setTimeOutString] = useState('10:00')

  useEffect(() => {
    // when SA is viewing someone else's cloud, count down the token expiry
    if (!viewer) return undefined
    const timer = setInterval(() => {
      const remaining_seconds = new Date(viewer.expiresIn).getTime() - new Date().getTime()
      const minutesDiff = Math.floor((remaining_seconds % (1000 * 3600)) / (1000 * 60));
      const secondsDiff = Math.floor((remaining_seconds % (1000 * 60)) / 1000);
      setTimeOutString(`${minutesDiff}:${secondsDiff}`)
      if (remaining_seconds < 0) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [viewer])

  function handleFileSelect(files) {
    AsyncLoop(files, async (f) => {
      await loadFile(f)
    }).then(() => {
      getCloudObject(currentPage)
      toast("Files uploaded")
    }).catch((e) => {
      console.log(e);
      toast("Error uploading files")
    })
  }

  const handleForwardSubmit = (users) => {
    forwardFile({ id: selectedFileId }, users, true)
    setShowAdminCloudPopup(false)
  }

  const openForward = (id) => {
    setSelectedFileId(id)
    setShowAdminCloudPopup(true)
  }

  if (loading) return <Loader />
  else return (
    <>
      <Modal open={showAdminCloudPopup} onClose={() => setShowAdminCloudPopup(false)} ><AddMemberPopup title={"Select users to forward"} subTitle={""} multiSelect={true} submit={handleForwardSubmit} /></Modal>
      <div className={styles.page} >
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            {isCloud && <button type="button" className={styles.backBtn} onClick={() => setCloudSwitch(false)} aria-label="Back"><ArrowBackIosNewIcon style={{ fontSize: '16px' }} /></button>}
            <div className={styles.titleBlock}>
              <h1><span className={styles.titleIcon}><ComputerOutlinedIcon /></span>{!viewer ? "Files And Assets" : `You are viewing ${viewer.firstName} ${viewer.lastName}`}</h1>
              <p className={styles.subtitle}>{!viewer ? "Documents and attachments that have been uploaded as part of your projects" : `Token will expire in ${timeOutString}`}</p>
            </div>
          </div>
          {viewer && <span className={styles.viewerAlert}>Session active</span>}
        </div>

        {!viewer && <FileInput className={styles.dropzone} activeClassName={styles.dropzoneActive} browseClassName={styles.dropzoneBrowse} onFileSelect={handleFileSelect} />}

        {uploading && file &&
          <div className={styles.uploadCard}>
            <div className={styles.uploadTop}>
              <p>{file.name} <span style={{ fontWeight: 400, color: 'grey' }}>({(file.size / (1000 * 1000)).toFixed(2)} Mb)</span></p>
              <p className={styles.uploadPercent}>{upload}%</p>
            </div>
            <div className={styles.progress}>
              <div className={styles.progress_bar} style={{ width: `${upload}%` }}></div>
            </div>
          </div>
        }

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input placeholder='Search' type="text" onChange={search} />
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
        </div>

        {data?.length > 0 ? (
          viewMode === 'grid' ? (
            <div className={styles.cardsGrid}>
              {data.map((item, index) => {
                const fileExtension = item.fileName.split('.').pop()
                return (
                  <div className={styles.card} key={item._id || index}>
                    <div className={styles.cardTop}>
                      <FileIcon fileType={fileExtension} />
                      <div className={styles.fileName}>
                        {item.fileName}
                        {item.forwarded && <div className={styles.tag}>Forwarded by {item.forwardedAttributes.employeeName}</div>}
                        {item.bulk && <div className={styles.tag}>Bulk batch : {item.batch}</div>}
                      </div>
                    </div>
                    <div className={styles.fileMeta}>
                      <span>{bytes(item.attributes.size)}</span>
                      <span>Uploaded {new Date(item.createdAt).toDateString()}</span>
                    </div>
                    <div className={styles.cardFooter}>
                      {typeOfCloud == "projectCloud" &&
                        <Tooltip title={item.pinned ? "Unpin" : "Pin"}>
                          <button type="button" className={`${styles.iconBtn} ${item.pinned ? styles.iconBtnPinned : ''}`} onClick={() => pinFunc(item._id)}><PushPinOutlinedIcon /></button>
                        </Tooltip>
                      }
                      <Tooltip title="Forward">
                        <button type="button" className={styles.iconBtn} onClick={() => openForward(item._id)}><ReplyAllIcon /></button>
                      </Tooltip>
                      <Tooltip title="Download">
                        <PresignedLink s3Ref={item.attributes?.key || item.location} target="_blank" download rel="noreferrer">
                          <span className={styles.iconBtn}><FileDownloadOutlinedIcon /></span>
                        </PresignedLink>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <button type="button" className={styles.iconBtn} onClick={() => deleteFunc(item)}><DeleteOutlineOutlinedIcon /></button>
                      </Tooltip>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>File name</th>
                    <th>File size</th>
                    <th>Date uploaded</th>
                    <th>Last updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const fileExtension = item.fileName.split('.').pop()
                    return (
                      <tr key={item._id || index}>
                        <td>
                          <div className={styles.tableFile}>
                            <FileIcon fileType={fileExtension} />
                            <div>
                              {item.fileName}
                              {item.forwarded && <div className={styles.tag}>Forwarded by {item.forwardedAttributes.employeeName}</div>}
                              {item.bulk && <div className={styles.tag}>Bulk batch : {item.batch}</div>}
                            </div>
                          </div>
                        </td>
                        <td>{bytes(item.attributes.size)}</td>
                        <td>{new Date(item.createdAt).toDateString()}</td>
                        <td>{new Date(item.updatedAt).toDateString()}</td>
                        <td>
                          <div className={styles.tableActions}>
                            {typeOfCloud == "projectCloud" &&
                              <Tooltip title={item.pinned ? "Unpin" : "Pin"}>
                                <button type="button" className={`${styles.iconBtn} ${item.pinned ? styles.iconBtnPinned : ''}`} onClick={() => pinFunc(item._id)}><PushPinOutlinedIcon /></button>
                              </Tooltip>
                            }
                            <Tooltip title="Forward">
                              <button type="button" className={styles.iconBtn} onClick={() => openForward(item._id)}><ReplyAllIcon /></button>
                            </Tooltip>
                            <Tooltip title="Download">
                              <PresignedLink s3Ref={item.attributes?.key || item.location} target="_blank" download rel="noreferrer">
                                <span className={styles.iconBtn}><FileDownloadOutlinedIcon /></span>
                              </PresignedLink>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <button type="button" className={styles.iconBtn} onClick={() => deleteFunc(item)}><DeleteOutlineOutlinedIcon /></button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className={styles.emptyState}>
            <InboxIcon />
            <h4>No files found</h4>
          </div>
        )}
      </div>
    </>
  )
}

export default Cloud
