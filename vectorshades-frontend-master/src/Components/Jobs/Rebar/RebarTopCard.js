import styles from '../../../../styles/Employee.module.css';
const RebarTopCard = ({ rebarJobData }) => {
    return (
        <div className={styles.emp_details_main} >
            <div className={styles.emp_details} >
                <div>
                    <h3>Name of asigner</h3>
                    <h4>{rebarJobData.jobDetails.assignedSalesBYName}</h4>
                </div>
                <div>
                    <h3>Awarded status</h3>
                    <h4>{rebarJobData.jobDetails.awarded ? "Awarded" : "Not awarded"}</h4>
                </div>
                <div>
                    <h3>client</h3>
                    <h4>{rebarJobData.jobDetails.client}</h4>
                </div>
                <div>
                    <h3>Created at</h3>
                    <h4>{new Date(rebarJobData.jobDetails.createdAt).toLocaleDateString()}</h4>
                </div>
                <div>
                    <h3>Date</h3>
                    <h4>{new Date(rebarJobData.jobDetails.date).toLocaleDateString()}</h4>
                </div>
                <div>
                    <h3>Estimated date</h3>
                    <h4>{new Date(rebarJobData.jobDetails.estimate).toLocaleDateString()}</h4>
                </div>
                <div>
                    <h3>Last updated at</h3>
                    <h4>{new Date(rebarJobData.jobDetails.lastUpdated).toLocaleDateString()}</h4>
                </div>
                <div>
                    <h3>Pending status</h3>
                    <h4>{rebarJobData.jobDetails.pending ? "pending" : "compleated"}</h4>
                </div>
            </div>
        </div>
    )
}

export default RebarTopCard