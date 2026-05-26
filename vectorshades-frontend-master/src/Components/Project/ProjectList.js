import { AccessTime, Domain, Timeline, Info, SupervisorAccount, Person, People, Schedule, Update, LibraryAddCheck, CachedOutlined, LayersClearOutlined, FunctionsOutlined } from '@mui/icons-material'
import { AvatarGroup } from '@mui/material'
import { useState, useEffect } from 'react'
import styles from '../../../styles/Project.module.css'
import CreateProjectPopup from '../Popups/Project/CreateProjectPopup.js'
import { createProjectController } from '../../Controllers/projects/index'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import ProfileImage from '../ProfileImage/Image'
import { Pagination } from '@mui/material'
import { getTotalNumberOfUserProjects } from '../../../src/Controllers/projects/index'
import BarChartIcon from '@mui/icons-material/BarChart';
import { searchProjectController } from '../../Controllers/projects/index'
const ProjectList = ({ projects, analytics, searchProjectsFunction, setCurrentPage, maxPages }) => {
    const [createProjectPopupEnabled, setcreateProjectPopupEnabled] = useState(false);
    const router = useRouter()

    const createProjectFunction = (data) => {
        createProjectController(data).then(() => {
            toast.success("project created successfully")
            setcreateProjectPopupEnabled(false)
            InitialHydration()
        })
            .catch((err) => {
                console.log(err);
                toast.error("error occured while creating project")
            })
    }

    const onPageChange = (event, value) => {
        InitialHydration(null, value)
    }



    const projectMap = projects?.map((data) => {
        const { createdAt, updatedAt } = data;
        const formatDate = date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(',', '');
        const created_at = formatDate(createdAt);
        const updated_at = formatDate(updatedAt);
        return (

            <div onClick={() => router.push(`/admin/dashboard/projects/${data._id}`)} className={`${styles.pro_card} ${styles.list_card}`}>
                <div className={styles.pro_name} >
                    <h2>{data.projectName}</h2>
                    <span onClick={(e) => { e.stopPropagation(); router.push(`/admin/dashboard/projects/summary/${data._id}`) }}> <BarChartIcon /></span>
                </div>
                <div className={styles.pro_items} >
                    <div className={styles.pro_item} >
                        <h5><Domain style={{ fill: "grey" }} />Client</h5>
                        <h5>{data.client}</h5>
                    </div>
                    <div className={styles.pro_item} >
                        <h5><AccessTime style={{ fill: "grey" }} />Hours</h5>
                        <h5>{data.hours} Hours</h5>
                    </div>
                    <div className={styles.pro_item} >
                        <h5><Timeline style={{ fill: "grey" }} />Est Hours</h5>
                        <h5>{data.estimatedHours} Hours</h5>
                    </div>
                    <div className={styles.pro_item} >
                        <h5><Info style={{ fill: "grey" }} />Status</h5>
                        <h5>{data.status}</h5>
                    </div>
                    <div className={styles.pro_item} >
                        <h5><SupervisorAccount style={{ fill: "grey" }} />Admin</h5>
                        <h5>{data.admin}</h5>
                    </div>
                    <div className={styles.pro_item} >
                        <h5><Person style={{ fill: "grey" }} />Created By</h5>
                        <h5>{data.createdBy}</h5>
                    </div>
                    <div className={styles.pro_item} >
                        <h5><Schedule style={{ fill: "grey" }} />Created At</h5>
                        <h5>{created_at}</h5>
                    </div>
                    <div className={styles.pro_item} >
                        <h5><Update style={{ fill: "grey" }} />Project Type</h5>
                        <h5>{data.rebar ? 'REBAR' : 'STEEL'}</h5>
                    </div>
                    <div className={styles.pro_item} style={{ width: "100%", marginTop: "13px" }} >
                        <h5><People style={{ fill: "grey" }} />Members</h5>
                        <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 15 }, }}>
                            {data.membersByName.map((i) => {
                                return <ProfileImage id={i._id} />
                            })}
                        </AvatarGroup>
                    </div>

                    <div className={styles.pro_item} style={{ width: "100%", marginTop: "13px" }} onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/dashboard/projects/summary/${data._id}`)
                    }} >
                    </div>

                    <div className={styles.labels} >
                        {data.completed === true && <span style={{ background: "green" }} >Completed</span>}
                        {data.active === false && <span style={{ background: "red" }} >Not Active</span>}
                    </div>
                </div>
                {/* <div className={styles.pro_desc} >
                    <h4><Description /> Description</h4>
                    <p>{data.description}</p>
                </div> */}
            </div>

        )
    })


    return (
        <>
            <CreateProjectPopup proPopup={createProjectPopupEnabled} setProPopup={setcreateProjectPopupEnabled} submit={createProjectFunction} />
            <div className={styles.pro_container} >

                <div className={`${styles.pro_left} ${styles.list_left}`}>
                    <div className={styles.pro_top}>
                        <h2>Projects</h2>
                    </div>
                    <div className={styles.pro_filter}>
                        <div className={styles.pro_filter_search} >
                            <input type="text" placeholder='Search' onChange={searchProjectsFunction} />
                        </div>
                        <div className={styles.pro_other_filter}>
                            <h5>Sort</h5>
                            <select onChange={(e) => InitialHydration({ [e.target.value]: -1 })}>
                                <option value={'createdAt'}>By Latest Created</option>
                                <option value={'updatedAt'}>By Latest Activity</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.box_container} >
                        <div className={styles.box} >
                            <h3><LibraryAddCheck />Compleated</h3>
                            <h2>{analytics?.completedProjects}</h2>
                            {/*<h5>vs Last Month <span>$220,000</span></h5>*/}
                        </div>
                        <div className={styles.box} >
                            <h3><CachedOutlined />Ongoing</h3>
                            <h2>{analytics?.ongoingProjects}</h2>
                            {/*<h5>vs Last Month <span>$220,000</span></h5>*/}
                        </div>
                        <div className={styles.box} >
                            <h3><LayersClearOutlined />Pipeline projects</h3>
                            <h2>{analytics?.pipelineProjects}</h2>
                            {/*<h5>vs Last Month <span>$220,000</span></h5>*/}
                        </div>
                        <div className={styles.box} >
                            <h3><FunctionsOutlined />To be reviewed</h3>
                            <h2>{analytics?.toBeReviewedByAccounts}</h2>
                            {/*<h5>vs Last Month <span>$220,000</span></h5>*/}
                        </div>
                    </div>

                    <>
                        <div className={`${styles.pro_cards} ${styles.list_cards}`}  >
                            {projectMap}
                        </div>
                        {2 > 1 &&
                            <div className='project_pagination' >
                                <Pagination count={maxPages} onChange={(e, i) => setCurrentPage(i)} />
                            </div>
                        }
                    </>
                </div>

            </div>
        </>
    )
}

export default ProjectList