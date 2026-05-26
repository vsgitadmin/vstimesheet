import { Add, Delete } from '@mui/icons-material'
import { useContext, useRef, useState } from 'react'
import { Box, Dialog, IconButton, LinearProgress, Modal, Tooltip } from '@mui/material'
import ProfileImage from '../ProfileImage/Image'
import AddMemberPopup from '../Popups/General/AddMemberPopup'
import styles from '../../Components/Popups/Hr/Popup.module.css'
import style from '../../../styles/Cloud.module.css'
import { createLms } from '../../Controllers/LMS'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { uploadCloudS3Document, deleteS3Document } from "../../Controllers/files/index"
import { ParentStore } from "../../../pages/_app";


const LmsCreate = () => {

  const [addMemberPopup, setAddMemberPopup] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [selectedEmployeesName, setSelectedEmployeesName] = useState([])
  const [uploadingInProgress, setUploadingInProgress] = useState(false)
  const [uploadedPercentage, setUploadedPercentage] = useState(0)
  const [uploadedFile, setUploadedFile] = useState([])
  const router = useRouter()
  const { ParentState } = useContext(ParentStore)


  const handleFormSubmit = (e) => {
    e.preventDefault()
    let target = e.target
    let obj = {
      name: target[0].value,
      description: target[1].value,
      assignedTo: selectedEmployees,
      assignToName: selectedEmployeesName,
      duration: target[4].value,
      dueDate: target[5].value,
      type: target[2].value,
      files: uploadedFile
    }

    createLms(obj).then(() => {
      toast.success('Ctreated LMS')
      router.push('/admin/dashboard/lms/hr')
    }).catch((e) => toast.error(e.message))
  }

  const handleFileChange = (input) => {
    let file = input.target.files[0]
    if (file) {

      const upload = uploadCloudS3Document(file, `lms/${ParentState.auth._id}/${file.name}`);
      setUploadingInProgress(true)

      upload.on('httpUploadProgress', (progress) => {
        const percentCompleted = Math.round((progress.loaded / progress.total) * 100);
        setUploadedPercentage(percentCompleted)
      });

      upload.promise()
        .then(async (data) => {
          const body = {
            fileName: file.name,
            location: data.Location,
            attributes: {
              key: `lms/${ParentState.auth._id}/${file.name}`,
              format: file.type,
              size: file.size
            }
          }
          uploadedFile.push(body)
          setUploadedFile(uploadedFile)
          toast.success("File uploaded successfully")
        })
        .catch((err) => {
          console.log(err)
          toast.error("unable to process request")
        }).finally(() => {
          setUploadingInProgress(false)
          setUploadedPercentage(0)
        })
    }
  }

  const deleteFile = async (data) => {
    try {
      await deleteS3Document(data.attributes.key)
      setUploadedFile(uploadedFile.filter((f) => { return f != data }))
      toast.success("File deleted successfully")
    } catch (error) {
      toast.error("unable to process request")
    }
  }

  const resources = [
    "Document / Reading Material",
    "Video / Webinar Recording",
    "Presentation / Slide Deck",
    "Interactive E-Learning Module",
    "Quiz / Assessment",
    "Audio / Podcast",
    "Case Study",
    "Assignment / Practical Task",
    "Checklist / Template",
    "External Resource / Link"
  ]

  return (
    <>
      <div className={styles.ce_popup} >
        <div className={styles.ce_popup_title}>
          <h2>Create Training Material</h2>
        </div>
        <form id='form' onSubmit={handleFormSubmit} className={styles.ce_form_container} >

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Title</label>
              <input name='title' required placeholder='Title' type="text" />
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_textarea} ${styles.ce_label}`}>
              <label>Description</label>
              <textarea name='desc' placeholder='Description' ></textarea>
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Type</label>
              <select name='type'>
                <select hidden>Select Training Type</select>
                {resources.map((e) => {
                  return (
                    <option>{e}</option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Add Employee</label>
              <div className={styles.ce_form_add} >
                <div onClick={() => setAddMemberPopup(true)} >
                  <Add />
                </div>
                {
                  selectedEmployees.map((e) => {
                    return <div>
                      <ProfileImage id={e} size={30} />
                    </div>
                  })
                }
              </div>
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Allocated hours</label>
              <input name='a-hours' type='number' placeholder='Allocatted hours' ></input>
            </div>
          </div>

          <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>Due Date</label>
              <input name='s-date' required placeholder='Due Date' type="date" />
            </div>
          </div>


          {/* <div className={styles.ce_form_group_main} >
            <div className={`${styles.ce_form_group} ${styles.ce_label}`}>
              <label>End Date</label>
              <input name='e-date' required placeholder='End Date' type="date" />
            </div>
          </div> */}

          <div className={styles.ce_file_upload_main} >
            <label>Upload Documents</label>
            <div className={styles.ce_file_upload}  >
              <div>
                <input required placeholder='Upload Documents' type="file" onChange={handleFileChange} />
                <p>Drag and drop files here, or click to select files</p>
              </div>
            </div>
          </div>

          {/* upload progress start */}

          {uploadingInProgress &&
            <div className={style.cloud_uploading}>
              <div className={style.top}>
                <div>
                  <div>
                    <p>emp.jpeg</p>
                    {/* <p>2Mb</p> */}
                  </div>
                </div>
                <div>{uploadedPercentage}%</div>
              </div>

              <div className={style.bottom}>
                <div className={style.progress}  >
                  <div className={style.progress_bar} style={{ width: `${uploadedPercentage}%` }}></div>
                </div>
              </div>

            </div>}
          {/* upload progress end */}

          <table className={style.table} >
            <tr>
              <th>SL NO</th>
              <th>File name</th>
              <th>Delete</th>
            </tr>

            {
              uploadedFile.map((file, i) => {
                return <tr>
                  <td>{i}</td>
                  <td>
                    <div>
                      <div>
                        <p>{file.fileName}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Tooltip title="Delete" >
                      <IconButton onClick={() => { deleteFile(file) }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              })
            }

          </table>

          <div className={styles.ce_form_group}>
            <input value="CREATE" type="submit" />
          </div>
        </form>
      </div>

      <Modal open={addMemberPopup} onClose={() => setAddMemberPopup(false)}>
        <AddMemberPopup multiSelect={true} submit={(emps) => {
          emps.forEach(emp => {
            if (!selectedEmployees.includes(emp._id)) {
              selectedEmployees.push(emp._id)
              setSelectedEmployees(selectedEmployees)

              selectedEmployeesName.push(emp.firstName + ' ' + emp.lastName)
              setSelectedEmployeesName(selectedEmployeesName)
            }
          });
          setAddMemberPopup(false)
        }} title="Select user to add" />
      </Modal>

    </>
  )
}

export default LmsCreate