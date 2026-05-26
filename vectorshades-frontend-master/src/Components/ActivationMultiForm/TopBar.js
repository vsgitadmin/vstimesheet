import { Check } from '@mui/icons-material'
import styles from './ActivationMultiForm.module.css'
import { motion } from 'framer-motion';

const TopBar = ({ stepIndex }) => {

  //<Check fontSize='small' style={{fill:"white"}} />


  return (
    <>
      <motion.div
        className={styles.mf_top_bar}
        transition={{ delay: 0, x: { duration: 0.7 }, default: { ease: "linear" } }}
        animate={{ x: [1000, 0] }}>

        {/* step 1 circle start */}
        {stepIndex === 1 &&
          <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
            1
          </div>
        }
        {stepIndex > 1 &&
          <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
            <Check fontSize='small' style={{ fill: "white" }} />
          </div>
        }
        {/* step 1 circle end */}

        {/* step 1 line start */}
        {stepIndex === 1 && <div className={styles.mf_not_complted_line}><hr /></div>}
        {stepIndex > 1 && <div className={styles.mf_complted_line}><hr /></div>}
        {/* step 1 line end */}

        {/* step 2 circle start */}
        {stepIndex === 1 &&
          <div className={`${styles.mf_step} ${styles.mf_step_not_completed}`}>
            2
          </div>
        }
        {stepIndex === 2 &&
          <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
            2
          </div>
        }
        {stepIndex > 2 &&
          <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
            <Check fontSize='small' style={{ fill: "white" }} />
          </div>
        }
        {/* step 2 circle end */}

        {/* step 2 line start */}
        {stepIndex === 1 && <div className={styles.mf_not_complted_line}><hr /></div>}
        {stepIndex === 2 && <div className={styles.mf_not_complted_line}><hr /></div>}
        {stepIndex === 3 && <div className={styles.mf_complted_line}><hr /></div>}
        {stepIndex > 3 && <div className={styles.mf_complted_line}><hr /></div>}
        {/* step 2 line end */}

        {/* step 3 circle start */}
        {stepIndex === 3 &&
          <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
            3
          </div>
        }
        {stepIndex < 3 &&
          <div className={`${styles.mf_step} ${styles.mf_step_not_completed}`}>
            3
          </div>
        }
        {stepIndex > 3 &&
          <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
            <Check fontSize='small' style={{ fill: "white" }} />
          </div>
        }
        {/* step 3 circle end */}

        {/* step 3 line start */}
        {stepIndex === 1 && <div className={styles.mf_not_complted_line}><hr /></div>}
        {stepIndex === 2 && <div className={styles.mf_not_complted_line}><hr /></div>}
        {stepIndex === 3 && <div className={styles.mf_not_complted_line}><hr /></div>}
        {stepIndex > 3 && <div className={styles.mf_complted_line}><hr /></div>}
        {/* step 3 line end */}

        {/* step 4 circle start */}
        {stepIndex < 4 &&
          <div className={`${styles.mf_step} ${styles.mf_step_not_completed}`}>
            4
          </div>
        }
        {stepIndex === 4 &&
          <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
            4
          </div>
        }
        {stepIndex > 4 &&
          <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
            <Check fontSize='small' style={{ fill: "white" }} />
          </div>
        }
        {/* step 4 circle end */}

      </motion.div>
    </>
  )
}

export default TopBar