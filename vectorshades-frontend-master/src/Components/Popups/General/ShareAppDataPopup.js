import { Modal } from '@mui/material';
import styles from './Popup.module.css'
import { Article, Computer, DateRange, Description } from '@mui/icons-material';

const ShareAppDataPopup = ({shareAppDataPopup, setShareAppDataPopup }) => {

    const hanldleClose = () => setShareAppDataPopup(false)

  return (
    <>
      <Modal open={shareAppDataPopup} onClose={hanldleClose} >
        <div className={styles.share_app_data} >
          <div className={styles.cg_title} >
            <h2>Share App Data</h2>
          </div>
          <div className={styles.sad_list} >

            <div className={styles.sad_list_item}  >
                {/* class for active item => sad_list_item_active */}
                <div className={styles.sad_list_item_active} >
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>

            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>

            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>

            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>

            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>

            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>

            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>

            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>
            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>
            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>
            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>
            <div className={styles.sad_list_item}  >
                <div>
                 <DateRange/>
                </div>
                <h4>TimeSheet</h4>
            </div>
           
          </div>

          <div className={styles.ca_btn} >
            <button>Share</button>
          </div>

        </div>
      </Modal>
    </>
  )
}

export default ShareAppDataPopup