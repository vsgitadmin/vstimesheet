import styles from '../MultiForm/MultiForm.module.css'
import CircularProgress from '@mui/material/CircularProgress';


const ArButtons = ({generateDocument,documentGenerated,downloadUrl, isLoading}) => {

  

  return (
    <>
    <div className={styles.ar_main} >
    <div className={styles.ar_container} >
        <div className={styles.ar_text} >
            <h4>Generate Employee Onboarding Document</h4>
            <p>
              This feature will generate the document with all the employee details dynamically
            </p>
        </div>
        <div className={styles.ar_accept_review_btn} >
           { documentGenerated === false && <button style={{background:"orange"}} onClick={generateDocument} >{isLoading ? <CircularProgress size="23px" /> : "Generate" }</button>}
           {documentGenerated && <a className={styles.generate_doc} target='_blank' href={downloadUrl} download>Download</a>  }
        </div>
    </div>
    </div>
    </>
  )
}

export default ArButtons