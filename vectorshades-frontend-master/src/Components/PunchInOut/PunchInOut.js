import { useEffect, useState } from 'react'
import styles from '../../../styles/PunchInOut.module.css'
import BulletPoints from '../Popups/Hr/BulletPointsPopup'
import { FiberManualRecord } from '@mui/icons-material'
import { getPunchStats } from "../../Controllers/Employee";
import { formatTime } from "../../Helpers/General/Time";
import months from "../../Constants/months"
const PunchInOut = () => {

    const [openBulletPoints, setBulletPoints] = useState(false)
    const [punchData, setPunchData] = useState()
    const [infoLineData, setinfoLineData] = useState({ in: 0, out: 0 })
    const TotalWorkingHrs = 12

    useEffect(() => {
        getPunchStats().then(({ data }) => {
            setPunchData(data.response.data)
            setinfoLineData({
                in: ((data.response.data.day.inTime / (TotalWorkingHrs * 60 * 60 * 1000)) * 100),
                out: 100 - ((data.response.data.day.inTime / (TotalWorkingHrs * 60 * 60 * 1000)) * 100)
            })
        }).catch((err) => {
            console.log(err)
        })
    }, []);

    return (<div className='container'>
        <h2>Punch In Punch Out</h2>
        <p className='mt_1 grey'>Here is you can track your punch ins and punch outs</p>

        <div className={styles.top}>
            <div className={styles.child}>
                <p>Report time this day</p>
                <h3>{formatTime(punchData?.day?.inTime).split(':')[0]}h {formatTime(punchData?.day?.inTime).split(':')[1]}m</h3>
            </div>
            <div className={styles.child}>
                <p>Out time this day</p>
                <h3>{formatTime(punchData?.day?.outTime).split(':')[0]}h {formatTime(punchData?.day?.outTime).split(':')[1]}m</h3>
            </div>

            <div className={styles.child}>
                <p>Report time this month</p>
                <h3>{formatTime(punchData?.month?.inTime).split(':')[0]}h {formatTime(punchData?.month?.inTime).split(':')[1]}m</h3>
            </div>
            <div className={styles.child}>
                <p>Out time this month</p>
                <h3>{formatTime(punchData?.month?.outTime).split(':')[0]}h {formatTime(punchData?.month?.outTime).split(':')[1]}m</h3>
            </div>
        </div>

        <div className={styles.points}>
            <div><FiberManualRecord style={{ fill: "green" }} />In time</div>
            <div><FiberManualRecord style={{ fill: "grey" }} />Balance time</div>
        </div>

        <div className={styles.bar}>
            <div className={styles.bar_item} style={{ width: `${infoLineData.in.toFixed()}%`, background: "green" }}></div>
            {/* <div className={styles.bar_item} style={{width: "60%", background: "#097c69"}}></div> */}
            <div className={styles.bar_item} style={{ width: `${infoLineData.out.toFixed()}%`, background: "grey" }}></div>
            {/* <div className={styles.bar_item} style={{width: "40%", background: "#dfe2e7"}}></div> */}
        </div>

        <div className={`mt_3 ${styles.filter}`}>
            <h3>September 2023</h3>
            <div>
                <select className='year_select_dropdown'>
                    {months.map((month) => {
                        return <option key={month.index} value={month.index}>{month.name}</option>
                    })}
                </select>
                <select className='year_select_dropdown'>
                    <option>2019</option>
                    <option>2020</option>
                    <option>2021</option>
                    <option>2022</option>
                    <option>2023</option>
                    <option>2024</option>
                </select>
            </div>
        </div>

        <div className={styles.calendar}>
            <table>
                <tr>
                    <th>SUN</th>
                    <th>MON</th>
                    <th>TUE</th>
                    <th>WED</th>
                    <th>THU</th>
                    <th>FRI</th>
                    <th>SAT</th>
                </tr>
                <tr>
                    <td>
                        <div onClick={() => setBulletPoints(true)} className={styles.day}>
                            <h3>1</h3>
                            <div className={styles.day_labeles}>
                                <div className={styles.day_label}>
                                    <span>Testrisly Redesign</span>
                                    <span>8h</span>
                                </div>
                                <div className={styles.day_label}>
                                    <span>Redesign</span>
                                    <span>8h</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>2</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>3</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>4</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>5</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>6</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>7</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className={styles.day}>
                            <h3>8</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>9</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>10</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>11</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>12</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>13</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                    <td>
                        <div className={styles.day}>
                            <h3>14</h3>
                            <div className={`${styles.day_label} ${styles.none}`}></div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <BulletPoints openBulletPoints={openBulletPoints} setBulletPoints={setBulletPoints} />
    </div>)
}

export default PunchInOut