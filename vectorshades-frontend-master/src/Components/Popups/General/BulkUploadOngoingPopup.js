import { Modal } from '@mui/material';
import { CheckCircle, FolderCopyOutlined } from '@mui/icons-material';
import styles from './Popup.module.css'
import ProfileImage from '../../ProfileImage/Image';
import styl from '../../../../styles/Cloud.module.css'
import { FileIcon } from 'react-file-icon';
import { useEffect, useState } from 'react';

const UploadBulkOngoingPopup = ({ uploadBulkOngoingPopup, uploadCompleted, setUploadBulkOngoingPopup, close, filesToUpload, progressFiles, uploadedFiles, uploading, currentFile }) => {
  const [progressWidth, setProgressWidth] = useState(80);

  useEffect(() => {
    if (Object.keys(progressFiles).filter((e) => progressFiles[e] < 100).length === 0 && uploadCompleted === false) {
      // This function will create the pulsing effect
      const minWidth = 80; // The minimum width for the pulse
      const maxWidth = 95; // The maximum width for the pulse
      const speed = 700;   // The speed of one full pulse cycle in milliseconds

      const amplitude = (maxWidth - minWidth) / 2;
      const midpoint = minWidth + amplitude;

      // The interval will update the width continuously
      const interval = setInterval(() => {
        // We use a sine wave for a smooth back-and-forth motion
        const sineValue = Math.sin(Date.now() / speed);
        const newWidth = midpoint + (amplitude * sineValue);
        setProgressWidth(newWidth);
      }, 50); // Update every 50ms for a smooth visual

      return () => clearInterval(interval);
    } else if (uploadCompleted === true) {
      setProgressWidth(100)
    }
  }, [progressFiles]);

  return (
    <>
      <Modal sx={{ cursor: !uploadCompleted ? 'progress' : 'default' }} open={uploadBulkOngoingPopup} onClose={() => !uploading && setUploadBulkOngoingPopup(false)} >
        <div className={`${styles.create_notice_popup} ${styles.upload_bulk_ongoing}`} >

          <div className={styles.ongoing_title} >
            <h2>Bulk uploading in progress...</h2>
            <p className='mt_1' >Your files are uploading in progress. do not close/refresh this page while uploading</p>
          </div>

          {/* success message */}
          {uploadCompleted && <div className={styles.cn_success_message} >
            <h3>Bulk Document Uploaded Successfully</h3>
            <CheckCircle />
          </div>}

          <div className={styles.ongoing_details} >
            <div className={styles.bulk_d} >
              <p>{filesToUpload.length} files uploading</p>
            </div>
          </div>

          {Object.keys(progressFiles).map((e) => {
            return (
              <div className={styles.ongoing_emp_details} >

                <div className={styles.ongoing_emp_card} >
                  <div className={styles.ongoing_emp_profile} >
                    <div style={{ padding: '10px', backgroundColor: '#f1f1f1', borderRadius: '100%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FolderCopyOutlined size /></div>
                  </div>
                  <div className={styles.ongoing_emp_name_pro} >
                    <div>
                      <h4>{e}</h4>
                      <h4>{progressFiles[e]}%</h4>
                    </div>

                    <div className={styl.progress}  >
                      <div className={styl.progress_bar} style={{ width: `${progressFiles[e]}%` }}></div>
                    </div>
                  </div>
                </div>

              </div>
            )
          })}
          <br />
          <br />
          {Object.keys(progressFiles).filter((e) => progressFiles[e] < 100).length === 0 &&
            <>
              <div className={styles.ongoing_details} >
                <div className={styles.bulk_d} >
                  <p>Forwarding And Notifying Employees</p>
                </div>
              </div>
              <div className={styl.progress}  >
                <div className={styl.progress_bar} style={{ width: `${uploadCompleted ? 100 : progressWidth}%` }}></div>
              </div>
            </>
          }
          <br/>
          <br/>
          {uploadCompleted && <div className={styles.cn_form_group}>
            <button onClick={close}
              type='button'>CLOSE
            </button>
          </div>}


        </div>
      </Modal>
    </>
  )
}

export default UploadBulkOngoingPopup