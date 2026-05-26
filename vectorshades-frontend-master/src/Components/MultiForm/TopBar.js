import {Check} from '@mui/icons-material'
import styles from './MultiForm.module.css'

const TopBar = ({stepIndex}) => {
    //<Check fontSize='small' style={{fill:"white"}} />
    return (<>
            <div className={styles.mf_top_bar}>

                {/* step 1 circle start */}
                {stepIndex === 1 && <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
                    1
                </div>}
                {stepIndex > 1 && <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
                    <Check fontSize='small' style={{fill: "white"}}/>
                </div>}
                {/* step 1 circle end */}

                {/* step 1 line start */}
                {stepIndex === 1 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex > 1 && <div className={styles.mf_complted_line}>
                    <hr/>
                </div>}
                {/* step 1 line end */}

                {/* step 2 circle start */}
                {stepIndex === 1 && <div className={`${styles.mf_step} ${styles.mf_step_not_completed}`}>
                    2
                </div>}
                {stepIndex === 2 && <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
                    2
                </div>}
                {stepIndex > 2 && <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
                    <Check fontSize='small' style={{fill: "white"}}/>
                </div>}
                {/* step 2 circle end */}

                {/* step 2 line start */}
                {stepIndex === 1 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 2 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 3 && <div className={styles.mf_complted_line}>
                    <hr/>
                </div>}
                {stepIndex > 3 && <div className={styles.mf_complted_line}>
                    <hr/>
                </div>}
                {/* step 2 line end */}

                {/* step 3 circle start */}
                {stepIndex === 3 && <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
                    3
                </div>}
                {stepIndex < 3 && <div className={`${styles.mf_step} ${styles.mf_step_not_completed}`}>
                    3
                </div>}
                {stepIndex > 3 && <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
                    <Check fontSize='small' style={{fill: "white"}}/>
                </div>}
                {/* step 3 circle end */}

                {/* step 3 line start */}
                {stepIndex === 1 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 2 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 3 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex > 3 && <div className={styles.mf_complted_line}>
                    <hr/>
                </div>}
                {/* step 3 line end */}

                {/* step 4 circle start */}
                {stepIndex < 4 && <div className={`${styles.mf_step} ${styles.mf_step_not_completed}`}>
                    4
                </div>}
                {stepIndex === 4 && <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
                    4
                </div>}
                {stepIndex > 4 && <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
                    <Check fontSize='small' style={{fill: "white"}}/>
                </div>}
                {/* step 4 circle end */}

                {/* step 4 line start */}
                {stepIndex === 1 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 2 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 3 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 4 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex > 4 && <div className={styles.mf_complted_line}>
                    <hr/>
                </div>}
                {/* step 4 line end */}

                {/* step 5 circle start */}
                {stepIndex < 5 && <div className={`${styles.mf_step} ${styles.mf_step_not_completed}`}>
                    5
                </div>}
                {stepIndex === 5 && <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
                    5
                </div>}
                {stepIndex > 5 && <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
                    <Check fontSize='small' style={{fill: "white"}}/>
                </div>}
                {/* step 5 circle end */}

                {/* step 5 line start */}
                {stepIndex === 1 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 2 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 3 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 4 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex === 5 && <div className={styles.mf_not_complted_line}>
                    <hr/>
                </div>}
                {stepIndex > 5 && <div className={styles.mf_complted_line}>
                    <hr/>
                </div>}
                {/* step 5 line end */}

                {/* step 6 circle start */}
                {stepIndex < 6 && <div className={`${styles.mf_step} ${styles.mf_step_not_completed}`}>
                    6
                </div>}
                {stepIndex === 6 && <div className={`${styles.mf_step} ${styles.mf_on_step}`}>
                    6
                </div>}
                {stepIndex > 6 && <div className={`${styles.mf_step} ${styles.mf_step_completed}`}>
                    <Check fontSize='small' style={{fill: "white"}}/>
                </div>}
                {/* step 6 circle end */}

            </div>
        </>)
}

export default TopBar