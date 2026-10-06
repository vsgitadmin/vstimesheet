import { useEffect, useState } from 'react'
import styles from '../../../styles/PunchInOut.module.css'
import BulletPoints from '../Popups/Hr/BulletPointsPopup'
import { FiberManualRecord } from '@mui/icons-material'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { getPunchStats } from "../../Controllers/Employee";
import { formatTime } from "../../Helpers/General/Time";
import months from "../../Constants/months"

const PunchInOut = () => {

    const [openBulletPoints, setBulletPoints] = useState(false)
    const [punchData, setPunchData] = useState()
    const [infoLineData, setinfoLineData] = useState({ in: 0, out: 0 })
    const TotalWorkingHrs = 12
    const now = new Date()

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

    return (<div className={styles.page}>
        <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
                <h1><span className={styles.titleIcon}><AccessTimeOutlinedIcon /></span>Punch In Punch Out</h1>
                <p className={styles.subtitle}>Here you can track your punch ins and punch outs</p>
            </div>
        </div>

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

        <div className={styles.barCard}>
            <div className={styles.points}>
                <div><FiberManualRecord style={{ fill: "#2e9e5b" }} />In time</div>
                <div><FiberManualRecord style={{ fill: "#cfcfcf" }} />Balance time</div>
            </div>

            <div className={styles.bar}>
                <div className={styles.bar_item} style={{ width: `${infoLineData.in.toFixed()}%`, background: "#2e9e5b" }}></div>
                <div className={styles.bar_item} style={{ width: `${infoLineData.out.toFixed()}%`, background: "#e9e9e9" }}></div>
            </div>
        </div>

        <div className={styles.filter}>
            <h3>{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div>
                <select className={styles.select} defaultValue={now.getMonth()}>
                    {months.map((month) => {
                        return <option key={month.index} value={month.index}>{month.name}</option>
                    })}
                </select>
                <select className={styles.select} defaultValue={now.getFullYear()}>
                    {Array.from({ length: 8 }, (_, i) => now.getFullYear() - 6 + i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className={styles.calendar}>
            <table>
                <tbody>
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
                </tbody>
            </table>
        </div>

        <BulletPoints openBulletPoints={openBulletPoints} setBulletPoints={setBulletPoints} />
    </div>)
}

export default PunchInOut
