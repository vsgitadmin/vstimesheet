import ProfileImage from '../ProfileImage/Image'
import styles from '../../../styles/Employee.module.css'
import style from '../../../styles/Hr.module.css';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';

const SalesPerformance = ({ perfomance, createReport }) => {
    return (
        <div className={styles.sp_container} >
            <section className='jobs' style={{padding:0 , margin:0}}>
                <div style={{ fontSize: "25px" }} className="head">
                    <h1 >Job Admins</h1>
                </div>
            </section>
            <p className='mt_1 grey' >Track job Admins for effective management and growth.</p>

            <div className={style.ar_search_filter} >
                <input placeholder='Search' type="text" />
                <div style={{ cursor: 'pointer' }} onClick={() => createReport()}><CloudDownloadOutlinedIcon /></div>
            </div>

            <div className={styles.sales_cards_container} >

                {perfomance && perfomance.map((obj) =>
                    <div className={styles.sales_card} >
                        <div className={styles.sales_person} >
                            <ProfileImage id={obj.employeeId} />
                            <div>
                                <h4>{`${obj.employeeDetails.firstName}  ${obj.employeeDetails.lastName}`}</h4>
                                <h5>{obj.employeeDetails.email}</h5>
                            </div>
                        </div>

                        <div className={styles.sales_details} >
                            <span>{obj.jobCount} Jobs</span>
                            <span>{obj.completedProjectCount} Completed Project</span>
                            <span>{obj.notCompletedProjectCount} Not Completed Projects</span>
                            <h4>${obj.totalCost} Total Cost</h4>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default SalesPerformance