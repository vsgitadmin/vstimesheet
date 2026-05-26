import { useState, useEffect } from 'react'
import { AccessTimeFilled, CachedOutlined, LibraryAddCheck, PercentOutlined } from '@mui/icons-material'
import styles from '../../../styles/SalesDashboard.module.css'
import 'react-circular-progressbar/dist/styles.css';
import ProfileImage from '../ProfileImage/Image';
import { getProjectAdminDashboardController } from '../../Controllers/projects/index'
import Loader from '../Loader/loader'

const SalesDashboard = () => {

    const [SalesDashboardData, setSalesDashboardData] = useState(null)
    const [Loading, setLoading] = useState(false)

    useEffect(() => {
        fetchProjectDashboardData()
    }, [])

    const fetchProjectDashboardData = async () => {
        try {
            const { data } = await getProjectAdminDashboardController()
            setSalesDashboardData(data.response.data)
            setLoading(false)
        } catch {
            toast.error("error occcured while fetching dashboard")
        }
    }

    if (Loading) return <Loader />
    else return (
        <>
            <div className={styles.container} >
                <div className={styles.title} >
                    <h2>Sales Dashbaord</h2>
                </div>

                <div className={styles.box_container} >
                    <div className={styles.box} >
                        <h3><LibraryAddCheck />Compleated projects</h3>
                        <h2>{SalesDashboardData?.completedProjects}</h2>
                        {/* <h5>vs Last Month <span>$220,000</span></h5>*/}

                    </div>
                    {/* <div className={styles.box} >
                        <h3><ArchiveOutlined />Pipeline projects</h3>
                        <h2>{SalesDashboardData?.pipelineProjects}</h2>
                        <h5>vs Last Month <span>$220,000</span></h5>

                    </div> */}

                    <div className={styles.box} >
                        <h3><CachedOutlined />Ongoing projects</h3>
                        <h2>{SalesDashboardData?.ongoingProjects}</h2>
                        {/* <h5>vs Last Month <span>$220,000</span></h5>*/}

                    </div>
                    <div className={styles.box} >
                        <h3><AccessTimeFilled />To be reviewed</h3>
                        <h2>{SalesDashboardData?.toBeReviewedByAccounts}</h2>
                        {/* <h5>vs Last Month <span>$220,000</span></h5>*/}

                    </div>
                    <div className={styles.box} >
                        <h3><PercentOutlined />Used percent</h3>
                        <h2>{SalesDashboardData?.usedPercent}</h2>
                        {/* <h5>vs Last Month <span>$220,000</span></h5>*/}

                    </div>
                </div>

                <div className={styles.deals_container} >


                    <div className={styles.deals_open} style={{width:'100%'}}>
                        <h3>Latest projects</h3>
                        <div className={styles.open_deals_container} >
                            {
                                SalesDashboardData?.latestProjects?.map((project) => {
                                    return (
                                        <div className={styles.open_deals_box} >
                                            <h4>Estimated hours : {project.estimatedHours}</h4>
                                            <h3>{project.projectName}</h3>
                                            <div>
                                                <ProfileImage size={30} />
                                                <h4>{project.admin}</h4>
                                            </div>
                                        </div>
                                    )
                                })

                            }

                        </div>
                    </div>
                </div>

                {/* <div className={styles.sales_pipeline} >
                    <div className={styles.sales_pipeline_top} >
                        <h3>Sales Pipeline</h3>
                        <h1>$1,195,500</h1>
                    </div>
                    <div className={styles.sales_pipeline_chart} >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart width={500} height={400} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0, }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div> */}

            </div>
        </>
    )
}

export default SalesDashboard