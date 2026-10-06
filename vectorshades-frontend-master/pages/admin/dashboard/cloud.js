import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Cloud from "../../../src/Components/Cloud/Cloud";
import { getAllCloudObject, createCloudObject, deleteCloudObject, searchCloudObject, forwardCloudObject,getCloudCount } from '../../../src/Controllers/Cloud/index'
import { uploadCloudS3Document, deleteS3Document } from '../../../src/Controllers/files/index'
import { ParentStore } from "../../_app";
import { useRouter } from "next/router";
import { validateToken } from "../../../src/Helpers/General/JwtToken"
import {Pagination} from "@mui/material";
import styles from "../../../styles/CloudPage.module.css"


function CloudPage() {
  const [Objects, setObjects] = useState([])
  const [Loading, setLoading] = useState(true)
  const { ParentState } = useContext(ParentStore)
  const [uploadPercent, setuploadPercent] = useState(0)
  const [Uploading, setUploading] = useState(false)
  const [UploadedFile, setUploadedFile] = useState(null)
  const router = useRouter()
  const [viewer, setViewer] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    router.isReady && getCloudObject(currentPage)
    router.isReady && fetchCloudCount()
  }, [router.isReady])

  useEffect(() => {
    getCloudObject(currentPage)
  }, [currentPage]);

  const fetchCloudCount =async () =>{
    let token = router.query.token
    let count = 0
    if (!token && viewer == null) {
      count = await getCloudCount()
    } else {
      const validate = validateToken(token)
      if (validate) {
        count = await getCloudCount({id:validate._id})
      } else {
        count= await getCloudCount()
      }
    }

    count = count.data.response.count
    count = count/10
    count = Math.ceil(count)

    setPageCount(count)
  }

  const getCloudObject = async (page) => {
    try {
      let token = router.query.token
      if (!token && viewer == null) {
        const data = await getAllCloudObject({ page })
        setObjects(data.data.response.files)
      } else {
        const validate = validateToken(token)
        if (validate) {
          setViewer(validate)
          const data = await getAllCloudObject({ id: validate._id })
          setObjects(data.data.response.files)
        } else {
          const data = await getAllCloudObject({ page })
          setObjects(data.data.response.files)
        }
      }
      setLoading(false)
    } catch (error) {
      toast.error('error getting cloud object')
    }
  }

  const uploadFile = (file) => {
    return new Promise((r, j) => {
      var formData = new FormData();
      formData.append("file", file);
      const file_upload = { name: file.name, size: file.size }
      setUploadedFile(file_upload)
      setUploading(true)
      const upload = uploadCloudS3Document(file, `cloud/${ParentState.auth._id}/${file.name}`);

      upload.on('httpUploadProgress', (progress) => {
        const percentCompleted = Math.round((progress.loaded / progress.total) * 100);
        setuploadPercent(percentCompleted)
      });

      upload.promise()
        .then(async (data) => {
          const body = {
            fileName: file.name,
            location: data.Location,
            attributes: {
              key: `cloud/${ParentState.auth._id}/${file.name}`,
              format: file.type,
              size: file.size
            },
            size: file.size,
            employeeId: ParentState.auth._id,
            bulk: file.bulk != null,
            batch: file.bulk
          }
          let res = await createCloudObject(body)
          r(res)
        })
        .catch((err) => {
          j(err)
          console.log(err)
          toast.error("unable to process request")
        }).finally(() => {
          setUploading(false)
        })
    })
  };

  const deleteFile = async (data) => {
    try {
      await deleteS3Document(data.attributes.key)
      await deleteCloudObject({ id: data._id })
      setTimeout(async () => {
        await getCloudObject(1)
      }, 500);

      toast.success("File deleted successfully")
    } catch (error) {
      toast.error("unable to process request")
    }
  }

  const searchObjects = (e) => {
    searchCloudObject({ search: e.target.value }).then((data) => {
      setObjects(data.data.response.files)
    }).catch((error) => {
      toast.error('error getting cloud object')
    })
  }

  const forwardFile = async (query, forwardTo, requireToast) => {
    try {
      let body = { forwardedAttributes: { employeeId: ParentState.auth._id, employeeName: ParentState.auth.firstName + " " + ParentState.auth.lastName }, forwardTo: forwardTo }      
      await forwardCloudObject(query, body)
      requireToast && toast.success('File Forwarded')
    } catch (err) {
      requireToast && toast.error('error occured while forwarding')
      console.log(err);
    }
  }

  function handleCountChange(e, value) {
    setCurrentPage(value)
  }

  return (
    <>
      <Cloud getCloudObject={getCloudObject} currentPage={currentPage} viewer={viewer} data={Objects} forwardFile={forwardFile} loading={Loading} loadFile={uploadFile} deleteFunc={deleteFile} upload={uploadPercent} file={UploadedFile} uploading={Uploading} search={searchObjects} />
      {pageCount > 1 && <div className={styles.paginationWrap}>
        <Pagination shape="rounded" count={pageCount} onChange={handleCountChange}/>
      </div>}
    </>
  )
}

export default CloudPage