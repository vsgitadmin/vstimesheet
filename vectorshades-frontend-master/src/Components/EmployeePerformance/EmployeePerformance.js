import { AccessTime, BarChart, Domain, FiberManualRecord, People, Person, Schedule, Timeline } from '@mui/icons-material'
import { AvatarGroup } from '@mui/material'
import Router from 'next/router'
import { Cell, PieChart, Pie } from 'recharts'
import styles from '../../../styles/Employee.module.css'
import style from '../../../styles/Project.module.css'
import ProfileImage from '../ProfileImage/Image'
import LaunchIcon from '@mui/icons-material/Launch';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { createReportsController } from '../../Controllers/Reports'
import { toast } from 'react-toastify'
import { useRef } from 'react'
import ReportView from '../General/ReportView'

const EmployeePerformance = ({ employee,Performance, Role, adminView, metricToggle, metricType }) => {
    const reportViewRef = useRef()

    const COLORS = ['#00C49F', '#FFBB28'];

    const createReportFunction = async (body) => {
        try {
            reportViewRef.current.openView(createReportsController, body)
        } catch (error) {
            console.log(error);
            toast.error("Report could not be created");
        }
    };

    const generateReport = async (project) => {
        const data = { "type": "EmployeeProjectPersonal", 
            "name": "EmployeeProjectPersonal", "file": "DanLogs", "queryObject": { 
                employee,
                project
         }, "keys": [], "download": true }
         await createReportFunction(data)

    }

    return (
        <div className={styles.ep_container}>
                    <ReportView ref={reportViewRef} />
            
            <div className={styles.ep_title} style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>{adminView ? 'Employee Performance' : 'Your Performance'}</h2>
                    <p className='mt_1 grey' >Track your performance analytics here</p>
                </div>
                <div>
                    {metricToggle && <button onClick={metricToggle} className='button'>{metricType === 'hourly' ? 'SHOW FINANCIALS' : 'SHOW HOURS'}</button>}
                </div>
            </div>
            {Performance.map((performance_data) => {

                const chartDataB = Role === "EMP" ? performance_data.completedHoursPercentage : performance_data.profitability
                const chartDataA = Role === "EMP" ? performance_data.remainingHoursPercentage : performance_data.efficiency

                return (
                    <>
                        <div className={styles.pro_details} >
                            <div className={`${style.pro_card} ${styles.pro_card}`} style={{ width: "100%" }}>
                                <div className={style.pro_name} >
                                    <h2>{performance_data.project.projectName}</h2>
                                    <div style={{gap:'20px',display:'flex'}}>
                                    <span onClick={() => Router.push('/admin/dashboard/projects/' + performance_data.project._id)}>< LaunchIcon /></span>
                                    <span onClick={() => generateReport(performance_data.project._id)}>< SummarizeOutlinedIcon /></span>
                                    </div>
                                  
                                </div>
                                <div className={style.pro_items} style={{ display: 'flex', flexWrap: 'inherit' }}>
                                    <div className={style.pro_item} >
                                        <h5><Domain style={{ fill: "grey" }} />Client</h5>
                                        <h5>{performance_data.project.client}</h5>
                                    </div>
                                    <div className={style.pro_item} >
                                        <h5><AccessTime style={{ fill: "grey" }} />Hours</h5>
                                        <h5>{performance_data.project.hours} Hours</h5>
                                    </div>
                                    <div className={style.pro_item} >
                                        <h5><Timeline style={{ fill: "grey" }} />Est Hours</h5>
                                        <h5>{performance_data.project.estimatedHours} Hours</h5>
                                    </div>
                                    <div className={style.pro_item} >
                                        <h5><Person style={{ fill: "grey" }} />Created By</h5>
                                        <h5>{performance_data.project.createdBy}</h5>
                                    </div>
                                    <div className={style.pro_item} >
                                        <h5><Schedule style={{ fill: "grey" }} />Created At</h5>
                                        <h5>{new Date(performance_data.project.createdAt).toDateString()}</h5>
                                    </div>
                                    <div className={style.pro_item} style={{ width: "100%", marginTop: "13px" }} >
                                        <h5><People style={{ fill: "grey" }} />Members</h5>
                                        <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 15 }, }}>
                                            {performance_data.project.members.map((e) => {
                                                return (
                                                    <ProfileImage size={30} id={e} />
                                                )
                                            })}
                                        </AvatarGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.ep_static_main} >
                            <div className={styles.ps_statics_main} >
                                <div className={styles.ps_members_profile} >
                                    <h4>Work Analytics</h4>
                                </div>
                                <div className={styles.ps_statics_right_chart} >
                                    {performance_data.analytics.map((analytics) => {
                                        const progressValue = (Role === "EMP" ? analytics.totalCompletedHours : analytics.usedCost) / (Role === "EMP" ? analytics.totalAllocatedHours : analytics.allocatedCost) * 100;
                                        const progressLabel = `${progressValue.toFixed(2)}%`;

                                        return (
                                            <div className={styles.acq_item}>
                                                <div className={styles.acq_item_top}>
                                                    <FiberManualRecord style={{ fill: "#4CAF50" }} />
                                                    {analytics.assignedTo}
                                                    {Role === "EMP" ? (
                                                        <h5>Allocated Hours: {analytics.totalAllocatedHours}</h5>
                                                    ) : (
                                                        <h5>Allocated Cost: {analytics.allocatedCost}</h5>
                                                    )}
                                                    {Role === "EMP" ? (
                                                        <h5>Remaining Hours: {analytics.remainingHours}</h5>
                                                    ) : (
                                                        <h5>Remaining Cost: {analytics.remainingCost}</h5>
                                                    )}
                                                    {Role === "EMP" ? (
                                                        <h5>Used Hours: {analytics.totalCompletedHours}</h5>
                                                    ) : (
                                                        <h5>Used Cost: {analytics.usedCost}</h5>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={styles.progress_bar}>
                                                        {Role === "EMP" ? (
                                                            <div style={{ width: `${progressValue}%`, background: "#4CAF50" }}></div>
                                                        ) : (
                                                            <div style={{ width: `${progressValue}%`, background: "#4CAF50" }}></div>
                                                        )}
                                                    </div>
                                                    <span>{progressLabel}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={styles.ps_statics_left} >
                                <div className={styles.ps_statics_left_chart} >
                                    <div className={styles.ps_chart} >
                                        <PieChart width={210} height={170} >
                                            <Pie data={[{ name: 'Group A', value: chartDataA }, { name: 'Group B', value: 100 - chartDataA }]} cx={100} cy={80} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                                {[{ name: 'Group A', value: chartDataA }, { name: 'Group B', value: 100 - chartDataA }].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <text x={105} y={80} textAnchor="middle" fontSize={13} >{Role === 'EMP' ? 'Remaining Hours' : 'Profit Score'} </text>
                                            <text x={105} y={100} textAnchor="middle" fontSize={13} style={{ fontWeight: "bolder" }} >{Math.ceil(chartDataA)}%</text>
                                        </PieChart>
                                    </div>
                                    <div className={styles.ps_chart} >
                                        <PieChart width={210} height={170} >
                                            <Pie data={[{ name: 'Group A', value: chartDataB }, { name: 'Group B', value: 100 - chartDataB }]} cx={100} cy={80} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                                {[{ name: 'Group A', value: chartDataB }, { name: 'Group B', value: 100 - chartDataB }].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <text x={105} y={80} textAnchor="middle" fontSize={13} >{Role === 'EMP' ? 'Used Hours' : 'Efficiency Score'}</text>
                                            <text x={105} y={100} textAnchor="middle" fontSize={13} style={{ fontWeight: "bolder" }} >{Math.ceil(chartDataB)}%</text>
                                        </PieChart>
                                    </div>
                                </div>
                                <div className={styles.ps_static_left_chart_det} >
                                    <div>
                                        <FiberManualRecord style={{ fill: "#FFBB28" }} />
                                        <h4>{Role === 'EMP' ? 'Used Hours' : 'Profitability'}</h4>
                                    </div>
                                    <div>
                                        <FiberManualRecord style={{ fill: "#00C49F" }} />
                                        <h4>{Role === 'EMP' ? 'Remaining Hours' : 'Efficiency'}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            })}


        </div>
    )
}

export default EmployeePerformance