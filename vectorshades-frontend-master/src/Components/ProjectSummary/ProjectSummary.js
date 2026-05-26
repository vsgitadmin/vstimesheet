import { Add, Description, FiberManualRecord, LocationOnOutlined, NotificationsOutlined, Search } from '@mui/icons-material'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ProfileImage from '../ProfileImage/Image'
import styles from '../../../styles/ProjectSummary.module.css'
import projectSections from '../../Constants/projectSections';


const ProjectSummary = ({ data ,projectData}) => {
  return (
    <>
      <div className={styles.ps_container} >
        <div className={styles.ps_left} >
          <div className={styles.ps_title_search} >
            <h1>Project Summary</h1>
          </div>
          <div className={styles.ps_summary_cards}>
            <div className={styles.ps_summary_card}>
              <h4>Remaining Budget</h4>
              <h1>{data.remainingBudget}</h1>
            </div>
            <div className={styles.ps_summary_card}>
              <h4>Remaining Hours</h4>
              <h1>{data.remainingHours}</h1>
            </div>
            <div className={styles.ps_summary_card}>
              <h4>Completed Hours</h4>
              <h1>{data.completedHours}</h1>
            </div>
            <div className={styles.ps_summary_card}>
              <h4>Cost</h4>
              <h1>{data.cost}</h1>
            </div>
            <div className={styles.ps_summary_card}>
              <h4>Cost Used</h4>
              <h1>{data.costUsed}</h1>
            </div>
          </div>
          <div className={styles.ps_statics} >
            <div className={styles.ps_statics_right} >
              <h4>Section Analytics</h4>
              <div className={styles.ps_statics_right_chart} >
                {projectSections.map((section, idx) => {
                  const filtered = data?.groupedSectionAnalytics.filter((data) => data.section === section)
                  return (
                    <div className={styles.acq_item} key={idx} >
                      <div className={styles.acq_item_top} >
                        <div>
                          <FiberManualRecord style={{ fill: "#4CAF50" }} />
                          {section}
                        </div>
                        {filtered.length > 0 && <>
                          <div>
                            <h5>Allocated Cost: {filtered[0].allocatedCost}</h5>
                          </div>
                          <div>
                            <h5>Remaining Cost: {filtered[0].remainingCost}</h5>
                          </div>
                          <div>
                            <h5>Used Cost: {filtered[0].usedCost}</h5>
                          </div>
                        </>}

                      </div>
                      <div>
                        <div className={styles.progress_bar} ><div style={{ width: filtered.length > 0 ? `${(filtered[0].usedCost / filtered[0].allocatedCost) * 100}%` : `0%`, background: "#4CAF50" }} ></div></div>
                        <span>{filtered.length > 0 ? `${((filtered[0].usedCost / filtered[0].allocatedCost) * 100).toFixed(2)}%` : `0.00%`}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {/* *********************************************** Members Section  ****************************************************** */}
          <h2 style={{marginTop:"1rem",marginBottom:"1rem"}} >Members</h2>

          <div className={styles.ps_members} >
          {data?.memberAnalytics.map(({ user, analytics }, index) => {
            let availFields = []
            const allSections = ["Group", "Detailing", "Design", "Rework"]
            return (
                <div className={styles.ps_members_static} >
                  <div className={styles.ps_members_profile} >
                  <ProfileImage id={user?._id} key={user?._id}/>
                  <h4>{user?.firstName}{' '}{user?.lastName}</h4>
                  </div>
                  <div className={styles.ps_statics_right_chart} >
                    {
                      analytics.map((obj, idx) => {
                        availFields.push(obj.section)
                        return (
                          <>
                            <div className={styles.acq_item} key={idx} >
                              <div className={styles.acq_item_top} >
                                <div>
                                  <FiberManualRecord style={{ fill: "#4CAF50" }} />
                                </div>
                                {obj && <>
                                  <div>
                                    <h5>Allocated Cost: {obj.allocatedCost}</h5>
                                  </div>
                                  <div>
                                    <h5>Remaining Cost: {obj.remainingCOst}</h5>
                                  </div>
                                  <div>
                                    <h5>Used Cost: {obj.usedCost}</h5>
                                  </div>
                                </>}
                              </div>
                              <div>
                                {obj.assignedTo}
                                <div className={styles.progress_bar} ><div style={{ width: obj ? `${(obj.usedCost / obj.allocatedCost) * 100}%` : `0%`, background: "#4CAF50" }} ></div></div>
                                <span>{obj ? `${((obj.usedCost / obj.allocatedCost) * 100).toFixed(2)}%` : `0.00%`}</span>
                              </div>
                            </div>
                          </>
                        )
                      })}
                    {
                      allSections.map((section, idx) => {
                        if (!availFields.includes(section)) {
                          return (
                            <>
                              <div className={styles.acq_item} key={idx} >
                                <div className={styles.acq_item_top} >
                                  <div>
                                    <FiberManualRecord style={{ fill: "#4CAF50" }} />
                                  </div>
                                  {section && <>
                                    <div>
                                      <h5>Allocated Cost:0</h5>
                                    </div>
                                    <div>
                                      <h5>Remaining Cost: 0</h5>
                                    </div>
                                    <div>
                                      <h5>Used Cost:0</h5>
                                    </div>
                                  </>}
                                </div>
                                <div>
                                  {section}
                                  <div className={styles.progress_bar} ><div style={{ width: `0%`, background: "#4CAF50" }} ></div></div>
                                  <span>{`0.00%`}</span>
                                </div>
                              </div>
                            </>
                          )
                        }
                      })
                    }
                  </div>
              </div>
            )
          })}
          </div>
          {/* *********************************************** Members Section End  ****************************************************** */}
        </div>
        <div className={styles.ps_right} >
          <div className={styles.ps_profile_box} >
            <ProfileImage id={projectData.createdById} size="8rem" />
            <h3>{projectData.createdBy}</h3>
            <h4>The Owner Of The Project</h4>
          </div>
          <div className={styles.jobs_posted} >
            <div className={styles.jobs_posted_add}>
                <h4>Administration</h4>
            </div>
            {projectData.membersByName && projectData.membersByName.map((member, index) => {
              if (member.role == "AD") {
                return(
                  <div className={styles.jobs_boxes}>
                  <div className={styles.jobs_box} >
                    <div className={styles.jobs_count} >
                    <ProfileImage id={member._id} />
                    </div>
                    <div className={styles.job_det} >
                      <h3>{member.firstName}</h3>
                      <h4>{member.designation}</h4>
                    </div>
                </div>
                </div>
                )
              }
            })}
            <div className={styles.reminders} >
              <div className={styles.reminders_title}>
                <h4>Employees</h4>

              </div>
              <div className={styles.reminders_boxes} >
                {projectData.membersByName && projectData.membersByName.map((member, index) =>
                  <div className={styles.reminders_box}>
                    <ProfileImage id={member._id} />
                    <div>
                      <p>{member.firstName}</p>
                    </div>
                    <div>
                      {/* 6.30 PM */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectSummary