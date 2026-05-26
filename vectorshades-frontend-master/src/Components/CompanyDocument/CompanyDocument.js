import { useEffect, useState, useContext } from 'react'
import styles from '../../../styles/Cloud.module.css'
import style from '../../../styles/Hr.module.css'
import { toast } from 'react-toastify'
import { CloudUpload, NoteAddOutlined } from '@mui/icons-material'
import { ParentStore } from '../../../pages/_app';
import { useRouter } from 'next/router'
import { Grow, MenuItem } from '@mui/material'
import { uploadCloudS3Document } from '../../../src/Controllers/files/index'
import { createCloudObject, getAllPublicCloudCOntroller } from '../../../src/Controllers/Cloud/index'
import UploadBulkPopup from '../Popups/General/UploadBulkPopup'
import PresignedLink from '../S3/PresignedLink'
import companyDocTypes from '../../Constants/companyDocs'

const CompanyDocument = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("files")
  const { ParentState } = useContext(ParentStore);
  const [docs, setDocs] = useState([])
  const [uploadPercent, setuploadPercent] = useState(0)
  const [Uploading, setUploading] = useState(false)
  const [UploadedFile, setUploadedFile] = useState(null)
  const [uploadBulkPopup, setUploadBulkPopup] = useState(false)

  useEffect(() => {
    getAllDocuments()
  }, [])

  const getAllDocuments = () => {
    getAllPublicCloudCOntroller()
      .then((r) => setDocs(r.data.response.files))
      .catch((err) => toast("unable to process request"))
  }

  const handleDocClick = (doc) => { }


  const uploadFile = (event) => {
    return new Promise((r) => {
      const file = event.target ? event.target.files[0] : event;
      var formData = new FormData();
      formData.append("file", file);
      const file_upload = { name: file.name, size: file.size }
      setUploadedFile(file_upload)
      setUploading(true)
      const upload = uploadCloudS3Document(file, `companydocuments/${file.name}`);

      upload.on('httpUploadProgress', (progress) => {
        const percentCompleted = Math.round((progress.loaded / progress.total) * 100);
        setuploadPercent(percentCompleted)
      });

      upload.promise()
        .then(async (data) => {
          const body = {
            employeeId: ParentState.auth._id,
            fileName: file.name,
            location: data.Location,
            public: true,
            attributes: {
              key: `companydocuments/${file.name}`,
              format: file.type,
              size: file.size
            }
          }
          await createCloudObject(body)
          getAllDocuments()
          if (event.target !== null) {
            toast.success("File uploaded successfully")
          }
        })
        .catch((err) => {
          toast.error("unable to process request")
        }).finally(() => r())
    })
  };

  return (
    <div className={styles.cloud_container} >
      <h2>Company Document</h2>
      <div className={`${styles.cloud_top} ${styles.company_doc_btn}`} >
        <p className='mt_1 grey' >Manage and share company documents with the convenience of upload options</p>
        <div className={styles.company_doc_btns} >
          {ParentState?.auth.role === 'HR' && <label htmlFor="file-input">
            <span style={{ display: "flex", gap: "10px" }} >
              <NoteAddOutlined />
              Upload Document
            </span>
            <input type="file" id="file-input" accept="image/png,image/jpeg" onChange={uploadFile} style={{ display: 'none' }} />
          </label>}

          {ParentState?.auth.role === 'HR' && <label onClick={() => setUploadBulkPopup(true)}>
            <span style={{ display: "flex", gap: "10px" }}>
              <CloudUpload />
              Upload Bulk
            </span>
          </label>}
        </div>
      </div>

      <div className={style.activity_bar}>
        <ul>
          {companyDocTypes.map((docName) => (
            <li
              key={docName}
              onClick={() => setActiveMenu(docName)}
              className={activeMenu === docName ? style.active : ''}
            >
              {docName}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.cod_recent_files} >
        <h3>Recent files</h3>

        <div className={styles.cod_recent_files_list} >
          {docs.map((doc) => {
            return <Grow in>
              <div onClick={() => handleDocClick(doc)} key={doc._id} className={styles.cod_recent_file_box} >
                <PresignedLink download s3Ref={doc.attributes?.key || doc.location} rel="noreferrer">
                  <div>
                    <img src="https://cdn-icons-png.flaticon.com/64/607/607674.png" />
                  </div>
                  <div>
                    <p>{doc.fileName}</p>
                  </div>
                </PresignedLink>
              </div>
            </Grow>
          })}
        </div>
      </div>

      <UploadBulkPopup getAllDocuments={getAllDocuments} companyDocuments={true} uploadBulkPopup={uploadBulkPopup} setUploadBulkPopup={setUploadBulkPopup} uploadFile={uploadFile} />
    </div>
  )
}

export default CompanyDocument