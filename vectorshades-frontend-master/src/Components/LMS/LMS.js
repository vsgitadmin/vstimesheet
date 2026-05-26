import { AccessTimeFilled, Bookmark, CheckCircle, FiberManualRecord } from '@mui/icons-material'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import styles from '../../../styles/LMS.module.css'
import style from '../../../styles/Hr.module.css';
import { useEffect, useState } from 'react'
import LmsPopup from '../Popups/LMS/LmsPopup'
import { getAllTraining } from "../../Controllers/LMS/index"
import ProfileImage from '../ProfileImage/Image'
import { Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import NoDataFound from "../NoDataFound/NoDataFound"

const LMS = () => {

    const [lmsPopup, setLmsPopup] = useState(false)
    const [lmsData, setLmsData] = useState()
    const [selectedTriningData, setselectedTriningData] = useState()

    const router = useRouter()

    const [data, setData] = useState([])
    const [chartData, setChartData] = useState({ completed: 0, ongoing: 0, active: 0, total: 0 })


    const COLORS = ['#22af79', '#096ac2', '#fc9d00'];

    useEffect(() => {
        getAllTraining({ page: 1 }).then((res) => {
            let body = res.data.response
            setLmsData(body)
            let completed = body.filter((d) => { return d.completed }).length
            let ongoing = body.filter((d) => { return !d.completed }).length
            let active = body.filter((d) => { return !d.active }).length

            setChartData({ completed, active, ongoing, total: body.length })
        })
    }, [])

    useEffect(() => {

        setData([
            { name: 'Completed', value: lmsData?.filter((d) => { return d.completed }).length },
            { name: 'Ongoing', value: lmsData?.filter((d) => { return !d.completed }).length },
            { name: 'Active', value: lmsData?.filter((d) => { return !d.active }).length },
        ])
    }, [lmsData])


    const percentageCalculator = (o) => {
        let percentage = (o.timeSpent / (o.duration * 60 * 60)) * 100
        return percentage > 100 ? 100 : percentage
    }

    return (
        <div className="container" >
            <div className={styles.lms_title} >
                <h2>LMS</h2>
            </div>

            <p className='mt_1 grey' >Learning management system that fosters continuous learning and development for all.</p>

            <br />
            <div className={styles.lms_container} >
                <div className={styles.left_side} >
                    <div className={styles.cards_container} >
                        <div className={styles.card} >
                            <div><AccessTimeFilled /></div>
                            <div>
                                <h4>Ongoing</h4>
                                <h3>{chartData.ongoing} Course</h3>
                            </div>
                        </div>
                        <div className={styles.card} >
                            <div><CheckCircle /></div>
                            <div>
                                <h4>Complete</h4>
                                <h3>{chartData.completed} Course</h3>
                            </div>
                        </div>
                        <div className={styles.card} >
                            <div><Bookmark /></div>
                            <div>
                                <h4>Active</h4>
                                <h3>{chartData.active} Course</h3>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3>On Going</h3>
                    </div>

                    <div className={styles.ongoing_container} >
                        {lmsData?.map((d, i) => {
                            return <div key={i} className={styles.on_card} onClick={() => { setselectedTriningData(d); setLmsPopup(true); }} >
                                <div>
                                    <p>{d.name}</p>
                                    {/* <span>{d.description.slice(0, 200)}{d.description.length > 200 && '...'}</span> */}
                                </div>
                                <div className={styles.lms_users} >
                                    {
                                        d.assignedTo.map((u) => {
                                            return <ProfileImage size={30} id={u} />
                                        })
                                    }

                                </div>
                                <div>
                                    <h5>{d.assignedTo.length} users</h5>
                                </div>
                                <div className={styles.progress} >
                                    {!d.completed && <span style={{ color: d.active ? 'darkgreen' : 'red' }} variant='button'>{d.active ? 'Active' : 'Inactive'}</span>}
                                    {d.completed && <span className='relaxed' style={{ fontSize: "12px", borderRadius: "50px", paddingLeft: "6px", paddingRight: "6px", padding: "3px" }} >Completed</span>}
                                </div>
                            </div>

                        })}
                        {(!lmsData || lmsData?.length == 0) && <NoDataFound />}
                    </div>
                </div>

                <div className={styles.right_side} >
                    <div className={styles.top} >
                        <h3>Course Topic</h3>
                    </div>
                    <div className={styles.mid} >
                        <div className={styles.graph} >
                            <PieChart width={210} height={170} >
                                <Pie data={data} cx={100} cy={80} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                    <div className={styles.bottom} >
                        <div>
                            <FiberManualRecord style={{ fill: COLORS[0] }} />
                            <p>Completed {chartData.completed}</p>
                        </div>
                        <div>
                            <FiberManualRecord style={{ fill: COLORS[1] }} />
                            <p>Ongoing {chartData.ongoing}</p>
                        </div>
                        <div>
                            <FiberManualRecord style={{ fill: COLORS[2] }} />
                            <p>Active {chartData.active} </p>
                        </div>
                    </div>
                </div>
            </div>

            <LmsPopup data={selectedTriningData} lmsPopup={lmsPopup} setLmsPopup={setLmsPopup} />
        </div>
    )
}

export default LMS