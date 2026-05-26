import { useState, useEffect } from 'react';
import { Add, Delete, NavigateBefore, NavigateNext } from '@mui/icons-material';
import styles from '../MultiForm.module.css'
import TopBar from '../TopBar';
import {uploadS3Document} from '../../../Controllers/files/index'
import Router from 'next/router';
import { toast } from 'react-toastify';
import PresignedLink from '../../S3/PresignedLink';

const SixthStep = ({ stepIndex, setStepIndex, setData, Data, submit, readOnly, empId, section }) => {
  const [Step3Data, setStep3Data] = useState([]);
  const [CardData, setCardData] = useState({});
  const [cardDetails, setcardDetails] = useState([]);
  const [Files, setFiles] = useState([])
  const [FileCard, setFileCard] = useState({})

  useEffect(() => {
    if (Data.employement !== undefined) {
      setcardDetails(Data.employement.employement)
      setFiles(Data.employement.files)
    }
  }, [])


  const changeInputValue = (e) => CardData[e.target.name] = e.target.value

  const addEmployement = (e) => {
    e.preventDefault()
    if (JSON.stringify({}) !== JSON.stringify(CardData)) {
      CardData['id'] = crypto.randomUUID()
      setcardDetails((e) => [CardData, ...e])
      setCardData({})
    }

    // clear input fields
    const form = e.target;
    form.elements.name_city_employer.value = "";
    form.elements.from.value = "";
    form.elements.to.value = "";
    form.elements.position.value = "";
    form.elements.gross_package.value = "";
  }

  const addFiles = (e) => {
    e.preventDefault()
    if (JSON.stringify({}) != JSON.stringify(FileCard)) {
      FileCard['id'] = crypto.randomUUID()
      FileCard['file_name'] = FileCard['file'][0].name
      var formData = new FormData();
      formData.append("file", FileCard['file'][0]);
      uploadS3Document(FileCard['file'][0], `${empId}/activation/employement/${FileCard['file'][0].name}`)
        .then((data) => {
          FileCard['location'] = data.Location
          setFiles((e) => [FileCard, ...e])
          setFileCard({})
          toast.success('Employement Files Uploaded')
        })
        .catch(() => toast.error('Employement Files Upload failed'))
    }
    // clear input fields
    const form = e.target;
    form.elements.file_name.value = "";
    form.elements.file.value = "";
  }

  const deleteFile = (id) => {
    const filtered = Files.filter((data) => data.id !== id)
    setFiles(filtered)
  }

  const deleteEmployement = (id) => {
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
        {!section && <div className={styles.mf_cp_btn}>
          <button className={styles.mf_continew_btn} onClick={() => {
            setData({ employement: cardDetails, files: Files }, 'employement')
            setStepIndex(stepIndex - 1)
          }}  >
            <NavigateBefore style={{ fill: "white" }} />
            Previous
          </button>
          {!readOnly && <button style={{ backgroundColor: "green" }} className={styles.mf_continew_btn} onClick={() => {
            setData({ employement: cardDetails, files: Files }, 'employement')
            setStepIndex(stepIndex)
            submit()
          }}  >
            Complete
            <NavigateNext style={{ fill: "white" }} />
          </button>}

        </div>}


        <h2>EMPLOYMENT HISTORY (Start With Your Current - Last 3 Employments)</h2>
        <div className={styles.family_main} >
          <form onSubmit={addEmployement} className={styles.family_input_details_main} >
            <div className={styles.ref_input_group} >
              <label>Name and City of Employer</label>
              <input required placeholder='Name and City of Employer' type="text" name='name_city_employer' onChange={changeInputValue} />
            </div>
            <div className={styles.ref_input_group} >
              <label>From</label>
              <input required placeholder='From' type="date" name='from' onChange={changeInputValue} />
            </div>
            <div className={styles.ref_input_group} >
              <label>To</label>
              <input required placeholder='From' type="date" name='to' onChange={changeInputValue} />
            </div>
            <div className={styles.ref_input_group}  >
              <label>Position Held</label>
              <input required placeholder='Position Held' type="text" name='position' onChange={changeInputValue} />
            </div>
            <div className={styles.ref_input_group}  >
              <label>Gross Annual Salary Package</label>
              <input required placeholder='Gross Annual Salary Package' type="text" name='gross_package' onChange={changeInputValue} />
            </div>
            <button className={styles.familly_details_btn} > <Add style={{ fill: 'white' }} /> ADD</button>
          </form>

          <div className={styles.family_details_container} >
            <table>
              <tr>
                <th>No.</th>
                <th>Name and City of Employer</th>
                <th>From</th>
                <th>To</th>
                <th>Position Held</th>
                <th>Gross Annual Salary Package</th>
                <th></th>
              </tr>
              {cardDetails.map((data, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{data.name_city_employer}</td>
                    <td>{data.from}</td>
                    <td>{data.to}</td>
                    <td>{data.position}</td>
                    <td>{data.gross_package}</td>
                    <td onClick={() => deleteEmployement(data.id)}><Delete style={{ fill: "grey" }} /></td>
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
            <button className={styles.familly_details_btn}> <Add style={{ fill: 'white' }} /> ADD</button>
          </form>

          <div className={styles.documents_input_main} style={{ marginTop: "-10px" }}  >
            <div style={{ width: "60%" }} >
              <div className={styles.family_details_container} >
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
                          <PresignedLink s3Ref={data.attributes?.key || data.location} target="_blank" rel="noreferrer" download>
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
          <h2 className='mt_5' ></h2>

        </div>
      </div>
    </>
  )
}

export default SixthStep