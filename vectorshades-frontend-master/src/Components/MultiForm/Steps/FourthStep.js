import { useState, useEffect } from 'react';
import { Add, Delete, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { uploadS3Document , deleteS3Document} from '../../../Controllers/files/index'
import styles from '../MultiForm.module.css'
import TopBar from '../TopBar';
import PresignedLink from '../../S3/PresignedLink';
import Router from 'next/router';
import { toast } from 'react-toastify';

const FourthStep = ({ stepIndex, setStepIndex, setData, Data ,empId,section}) => {
  const [CardData, setCardData] = useState({});
  const [cardDetails, setcardDetails] = useState([]);
  const [Certificates, setCertificates] = useState([])
  const [CertificateCard, setCertificateCard] = useState({})
  const [Files, setFiles] = useState([])
  const [FileCard, setFileCard] = useState({})

  useEffect(() => {
    if (Data.reference !== undefined) {
      setcardDetails(Data.reference.reference)
      setCertificates(Data.reference.certificate)
    }
  }, [])


  const changeInputValue = (e) => CardData[e.target.name] = e.target.value
  const changeInputValueCertificate = (e) => CertificateCard[e.target.name] = e.target.value


  const addReference = (e) => {
    e.preventDefault()
    if (JSON.stringify({}) != JSON.stringify(CardData)) {
      CardData['id'] = crypto.randomUUID()
      setcardDetails((e) => [CardData, ...e])
      setCardData({})
    }
    const form = e.target;
    form.elements.name.value = "";
    form.elements.address.value = "";
    form.elements.position_or_title.value = "";
    form.elements.telephone.value = "";
    form.elements.email.value = "";
  }

  const addCertification = (e) => {
    e.preventDefault()
    if (JSON.stringify({}) != JSON.stringify(CertificateCard)) {
      CertificateCard['id'] = crypto.randomUUID()
      CertificateCard['file_name'] = CertificateCard['file'][0].name

      var formData = new FormData();
      formData.append("file", CertificateCard['file'][0]);
      uploadS3Document(CertificateCard['file'][0],`${empId}/activation/certificate/${CertificateCard['file'][0].name}`)
      .then((data) => {
        CertificateCard['location'] = data.Location
        setCertificates((e) => [CertificateCard, ...e])
        setCertificateCard({})
        toast.success('Certificate Uploaded')
      })
      .catch(() => toast.error('certification upload failed'))
    }
    // clear input fields
    const form = e.target;
    form.elements.certification_details.value = "";
    form.elements.from.value = "";
    form.elements.to.value = "";
    form.elements.file_name.value = "";
  }

  const deleteReference = (id) => {
    const filtered = cardDetails.filter((data) => data.id !== id)
    setcardDetails(filtered)
  }


  const deleteCertificate = (id) => {
    const filtered = Certificates.filter((data) => data.id !== id)
    setCertificates(filtered)
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
            setStepIndex(stepIndex - 1)
            setData({reference:cardDetails,certificate:Certificates},'reference');
            }}  >
            <NavigateBefore style={{ fill: "white" }} />
            Previous
          </button>
          <button className={styles.mf_continew_btn} onClick={() => {
            setStepIndex(stepIndex + 1)
            setData({reference:cardDetails,certificate:Certificates},'reference')
            }}  >
            Continue
            <NavigateNext style={{ fill: "white" }} />
          </button>
        </div>}
        
        <h2>REFERENCES & CERTIFICATIONS</h2>
        <div className={styles.family_main} >
          <form className={styles.family_input_details_main} onSubmit={addReference}>
            <div className={styles.ref_input_group} >
              <label>Name</label>
              <input required placeholder='Name' name='name' type="text" onChange={changeInputValue} />
            </div>
            <div className={styles.ref_input_group} >
              <label>Address</label>
              <input required placeholder='Address' name='address' type="text" onChange={changeInputValue} />
            </div>
            <div className={styles.ref_input_group} >
              <label>Position or Title</label>
              <input required placeholder='Position or Title' name='position_or_title' type="text" onChange={changeInputValue} />
            </div>
            <div style={{ width: "15rem" }} className={styles.ref_input_group} >
              <label>Telephone</label>
              <input required placeholder='Telephone' name='telephone' type="number" onChange={changeInputValue} />
            </div>
            <div className={styles.ref_input_group} >
              <label>Email</label>
              <input required placeholder='Email' name='email' type="email" onChange={changeInputValue} />
            </div>
             <button className={styles.familly_details_btn} ><Add style={{ fill: 'white' }} /> ADD</button>
          </form>

          <div className={styles.family_details_container} >
            <table>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Address</th>
                <th>Position or Title</th>
                <th>Telephone</th>
                <th>Email</th>
                <th></th>
              </tr>
              {
                cardDetails.map((data, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data.name}</td>
                      <td>{data.address}</td>
                      <td>{data.position_or_title}</td>
                      <td>{data.telephone}</td>
                      <td>{data.email}</td>
                      <td><Delete style={{ fill: "grey" }} onClick={() => deleteReference(data.id)} /></td>
                    </tr>
                  )
                })
              }
            </table>
          </div>

          <h3 className='mt_5' >CERTIFICATIONS</h3>

          <form className={styles.documents_input_main} onSubmit={addCertification}>
            <div className={styles.document_input_group} >
              <label>Certification details</label>
              <input required placeholder='Certification details' name="certification_details" type="text" onChange={changeInputValueCertificate}></input>
            </div>
            <div className={styles.document_input_group} >
              <label>From</label>
              <input required placeholder='From' name='from' type="date" onChange={changeInputValueCertificate}></input>
            </div>
            <div className={styles.document_input_group} >
              <label>To</label>
              <input required placeholder='To' name='to' type="date" onChange={changeInputValueCertificate}></input>
            </div>
            <div className={styles.document_input_group} >
              <label>Upload</label>
              <input required type="file" name='file_name' onChange={(e) => CertificateCard['file'] = e.target.files}></input>
            </div>
            <button className={styles.familly_details_btn} > <Add style={{ fill: 'white' }} /> ADD</button>
          </form>

              <div className={styles.family_details_container} >
                <table>
                  <tr>
                    <th>Certification details</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Upload</th>
                    <th></th>
                  </tr>
                  {Certificates.map((data, index) => {
                    const startDate = new Date(data.from).toDateString()
                    const endDate = new Date(data.to).toDateString()
                    return (
                      <tr>
                        <td>{data.certification_details}</td>
                        <td>{startDate}</td>
                        <td>{endDate}</td>
                        <td className={styles.text_decor} >
                          <PresignedLink s3Ref={data.attributes?.key || data.location} target="_blank" rel="noreferrer" download>
                            View
                          </PresignedLink>
                        </td>
                        <td><Delete style={{ fill: "grey" }} onClick={() => deleteCertificate(data.id)} /></td>
                      </tr>
                    )
                  })}
                </table>
              </div>
              <h3 className='mt_5' ></h3>
        </div>
      </div>
    </>
  )
}

export default FourthStep