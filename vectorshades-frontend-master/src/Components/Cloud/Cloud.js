import { Add, ArrowBackIos, ArrowForwardIos, Delete, Download, FiberManualRecord, InsertDriveFile, IosShare, PushPin, ReplyAll, Search, Upload } from '@mui/icons-material'
import { Avatar, Modal, Pagination, Tooltip } from '@mui/material'
import styles from '../../../styles/Cloud.module.css'
import FileInput from '../DraggableFileInput'
import Loader from '../Loader/loader'
import FileIcon from '../FileIcon/FileIcon'
import bytes from 'bytes'
import AddMemberPopup from "../../Components/Popups/General/AddMemberPopup"
import { useEffect, useState } from 'react'
import AsyncLoop from '../../Helpers/General/AsyncLoop'
import { toast } from "react-toastify";
import PresignedLink from "../S3/PresignedLink";

const Cloud = ({ viewer, data, loading, loadFile, forwardFile, deleteFunc, search, typeOfCloud, pinFunc, isCloud, setCloudSwitch, file, upload, uploading, getCloudObject, currentPage }) => {
  const [showAdminCloudPopup, setShowAdminCloudPopup] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState('')
  const [timeOutString, setTimeOutString] = useState('10:00')

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

  const timerHandler = () => {
    // when SA is viewing other's cloud, the token expiry time out is handled here
    let timer = setInterval(() => {
      let remaining_seconds = new Date(viewer.expiresIn).getTime() - new Date().getTime()
      var minutesDiff = Math.floor((remaining_seconds % (1000 * 3600)) / (1000 * 60));
      var secondsDiff = Math.floor((remaining_seconds % (1000 * 60)) / 1000);
      setTimeOutString(`${minutesDiff}:${secondsDiff}`)
      remaining_seconds < 0 && clearTimeout(timer)
    }, 1000)
  }

  if (loading) return <Loader />
  else return (
    <>
      {viewer && timerHandler()}
      {<Modal open={showAdminCloudPopup} onClose={() => setShowAdminCloudPopup(false)} ><AddMemberPopup title={"Select users to forward"} subTitle={""} multiSelect={true} submit={handleForwardSubmit} /></Modal>}
      <div className={`${styles.cloud_container}`} >
        {isCloud && <div onClick={() => setCloudSwitch(false)} className={styles.cloud_back} >
          <ArrowBackIos />
        </div>}
        {<div className={`${styles.cloud_top}  ${viewer && styles.cloud_alert}`}>
          <div className={styles.left}>
            <h2>{!viewer ? "Files And Assets" : `You are viewing ${viewer.firstName} ${viewer.lastName}`}</h2>
            <p>{!viewer ? "Documents and attachements that have been uploaded as part of your projects" : `Token will expire in ${timeOutString}`}</p>
          </div>
        </div>}
        {!viewer && <FileInput onFileSelect={handleFileSelect} />}
        {/* <div className={styles.cloud_uploading}>
          <div className={styles.top}>
            <img src='https://cdn-icons-png.flaticon.com/512/5968/5968517.png' />
            <div>
              <p>Dashboard prototype requirements.pdf</p>
              <p>1.6 MB</p>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.progress}  >
              <div className={styles.progress_bar} style={{ width: "30%" }}></div>
            </div>
          </div>
        </div> */}

        {!viewer && <div className={styles.attached_files} >
          <div className={styles.title} >
            <h3>Attached files</h3>
            <p>Files and assets that have been attached to this project</p>
          </div>
        </div>}

        {uploading &&
          <div className={styles.cloud_uploading}>
            <div className={styles.top}>
              <div>
                <div>
                  <p>{file.name}</p>
                  <p>{(file.size / (1000 * 1000)).toFixed(2)} Mb</p>
                </div>
              </div>
              <div>
                {upload}%
              </div>
            </div>

            <div className={styles.bottom}>
              <div className={styles.progress}  >
                <div className={styles.progress_bar} style={{ width: `${upload}%` }}></div>
              </div>
            </div>
          </div>
        }

        <div className={styles.menu_search} >
          <div className={styles.right}>
            <Search />
            <input placeholder='Search' type="text" onChange={search} />
          </div>
        </div>
        <table className={styles.table} >
          <tr>
            <th><div>SL NO</div></th>
            <th>File name</th>
            <th>File size</th>
            <th>Date uploaded</th>
            <th>Last updated</th>
            <th></th>
            <th></th>
            <th></th>
            {typeOfCloud == "projectCloud" && <th></th>}
          </tr>
          {data?.map((item, index) => {
            const fileExtension = item.fileName.split('.').pop()
            return (
              <tr>
                <td><div>{index + 1}</div></td>
                <td>
                  <div>
                    <FileIcon fileType={fileExtension} />
                    {/* <FileIcon extension={} {...defaultStyles.docx}   alt="" /> */}
                    <div>
                      <p>{item.fileName} {item.forwarded && <div className='relaxed' >Forwarded by {item.forwardedAttributes.employeeName}</div>} {item.bulk && <div className='relaxed' >Bulk batch : {item.batch}</div>} </p>
                      {/* <p>{item.attributes.size}</p> */}
                    </div>
                  </div>
                </td>
                <td>{bytes(item.attributes.size)}</td>
                <td>{new Date(item.createdAt).toDateString()}</td>
                <td>{new Date(item.updatedAt).toDateString()}</td>
                <td>
                  <Tooltip title="Delete" >
                    <Delete onClick={() => deleteFunc(item)} />
                  </Tooltip>
                </td>
                {typeOfCloud == "projectCloud" &&
                  <td>
                    <Tooltip title={item.pinned ? "Unpin" : "Pin"}  >
                      <PushPin onClick={() => pinFunc(item._id)} />
                    </Tooltip>
                  </td>
                }
                <td>
                  <PresignedLink s3Ref={item.attributes?.key || item.location} target="_blank" download rel="noreferrer">
                    <Tooltip title="Download" >
                      <Download />
                    </Tooltip>
                  </PresignedLink>
                </td>
                <td onClick={() => {
                  setSelectedFileId(item._id)
                  setShowAdminCloudPopup(true)
                }}>
                  <ReplyAll />
                </td>
              </tr>
            )
          })}
        </table>

        {/*<div className='awarded_jobs_pagination'>*/}
        {/*  <Pagination count={5} className='pagination-center'/>*/}
        {/*</div>*/}
      </div>
    </>
  )
}

export default Cloud