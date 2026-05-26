import { useState ,useEffect} from 'react';
import { Add, Delete, NavigateBefore, NavigateNext } from '@mui/icons-material';
import styles from '../MultiForm.module.css'
import TopBar from '../TopBar';
import { uploadS3Document, deleteS3Document } from '../../../Controllers/files/index'
import Router from 'next/router';
import { toast } from 'react-toastify';
import PresignedLink from '../../S3/PresignedLink';

const ThirdStep = ({ stepIndex, setStepIndex, setData, Data,empId , section}) => {
  const [Step3Data, setStep3Data] = useState([]);
  const [CardData, setCardData] = useState({});
  const [cardDetails, setcardDetails] = useState([]);
  const [Files, setFiles] = useState([])
  const [FileCard, setFileCard] = useState({})

  useEffect(() => {
    if(Data.qualification !== undefined){
      setcardDetails(Data.qualification.qualification)
      setFiles(Data.qualification.files)
    }
  }, [])
  

  const changeInputValue = (e) => CardData[e.target.name] = e.target.value

  const addQualification = (e) => {
    e.preventDefault()
    if (JSON.stringify({}) != JSON.stringify(CardData)) {
      CardData['id'] = crypto.randomUUID()
      setcardDetails((e) => [CardData, ...e])
      setCardData({})
    }
    // clear input fields
    const form = e.target;
    form.elements.type.selectedIndex = -1;
    form.elements.institute.value = "";
    form.elements.from.value = "";
    form.elements.to.value = "";
  }

  const addFiles = (e) => {
    e.preventDefault()
    if (JSON.stringify({}) != JSON.stringify(FileCard)) {
      FileCard['id'] = crypto.randomUUID()
      FileCard['file_name'] = FileCard['file'][0].name
      var formData = new FormData();
      formData.append("file", FileCard['file'][0]);
      uploadS3Document(FileCard['file'][0],`${empId}/activation/education/${FileCard['file'][0].name}`)
      .then((data) => {
        FileCard.location = data.Location
        setFiles((e) => [FileCard, ...e])
        setFileCard({})
        toast.success('Education Files Uploaded')
      })
      .catch(() => toast.error('Education Files Upload failed'))
    }
    // clear input fields
    const form = e.target;
    form.elements.file_name.value = "";
    form.elements.file.value = "";
  }

  const deleteFile = (id) => {
    const filtered = FileCard.filter((data) => data.id !== id)
    setcardDetails(filtered)
  }

  const deleteQualification = (id) => {
    const filtered = cardDetails.filter((data) => data.id !== id)
    setcardDetails(filtered)
  }

  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
  }

  return (
    <>
      <TopBar stepIndex={stepIndex} />
      <div className={styles.mf_step_container}>
          {!section &&  <div className={styles.mf_cp_btn}>
          <button className={styles.mf_continew_btn} onClick={() => {
            setData({qualification:cardDetails,files:Files},'qualification')
            setStepIndex(stepIndex - 1);
            }}>
            <NavigateBefore style={{ fill: "white" }} />
            Previous
          </button>
          <button className={styles.mf_continew_btn} onClick={() => {
            setData({qualification:cardDetails,files:Files},'qualification')
            setStepIndex(stepIndex + 1);
            }}>
            Continue
            <NavigateNext style={{ fill: "white" }} />
          </button>
        </div>}
       

        <h2>EDUCATION QUALIFICATION</h2>
        <div className={styles.family_main} >
          <form onSubmit={addQualification} className={styles.family_input_details_main} >
            <div className={styles.family_input_group} >
              <label>Qualification</label>
              <select name='type' onChange={changeInputValue} >
                <option value="" hidden >Type</option>
                <option value="SSLC">SSLC</option>
                <option value="PLUS TWO">PLUS TWO</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
            <div className={styles.family_input_group} >
              <label>College/ University</label>
              <input required placeholder='College/ University' type="text" name='institute' onChange={changeInputValue} />
            </div>
            <div className={styles.family_input_group} >
              <label>From</label>
              <input required placeholder='From' type="date" name='from' onChange={changeInputValue} />
            </div>
            <div className={styles.family_input_group} >
              <label>To</label>
              <input required placeholder='From' type="date" name='to' onChange={changeInputValue} />
            </div>
            <button className={styles.familly_details_btn} > <Add style={{ fill: 'white' }} /> ADD</button>
          </form>

          <div className={styles.family_details_container} >
            <table>
              <tr>
                <th>No.</th>
                <th>Qualification</th>
                <th>College/ University</th>
                <th>From</th>
                <th>To</th>
                <th></th>
              </tr>
              {cardDetails.map((data, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{data.type}</td>
                    <td>{data.institute}</td>
                    <td>{data.from}</td>
                    <td>{data.to}</td>
                    <td style={{ cursor: "pointer" }} onClick={() => deleteQualification(data.id)}><Delete style={{ fill: "grey" }} /></td>
                  </tr>
                )
              })}
            </table>
          </div>

          <h2 className='mt_4' >ADD DOCUMENTS</h2>

          <form onSubmit={addFiles} className={styles.documents_input_main}  >
            <div className={styles.document_input_group} >
              <label>Document Name</label>
              <input required placeholder='Document Name' type="text" name="file_name" onChange={(e) => FileCard['name'] = e.target.value}></input>
            </div>
            <div className={styles.document_input_group} >
              <label>Upload</label>
              <input required placeholder='Document Name' type="file" name="file" onChange={(e) => FileCard['file'] = e.target.files}></input>
            </div>
            <button className={styles.familly_details_btn} > <Add style={{ fill: 'white' }} /> ADD</button>
          </form>

          <div className={styles.documents_input_main} style={{ marginTop: "-10px" }}  >
            <div style={{ width: "60%" }} >
              <div className={styles.family_details_container} style={{paddingBottom:"3rem"}} >
                <table>
                  <tr>
                    <th>Document Name</th>
                    <th>File</th>
                    <th></th>
                  </tr>
                  {Files.map((data, index) => {
                    return (
                      <tr>
                        <td>{data.name}</td>
                        <td className={styles.text_decor} >
                          <PresignedLink s3Ref={data?.attributes?.key || data?.location} target="_blank" rel="noreferrer" download>
                            View
                          </PresignedLink>
                        </td>
                        <td onClick={() => deleteFile(data.id)}><Delete style={{ fill: "grey" }} /></td>
                      </tr>
                    )
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ThirdStep