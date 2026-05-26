import React, { createContext, useEffect, useState } from 'react'
import ActiveTasks from '../../../../src/Components/ActiveTasks/ActiveTasks'
import { useRouter } from 'next/router'
import { getSingleProjectController, getProjectTasksController, getProjectDashboardController } from '../../../../src/Controllers/projects/index'
import Loader from '../../../../src/Components/Loader/loader'
import { toast } from 'react-toastify'


export const sectionContext = createContext(null)
function SectionProvider(props) {
    const [selectedSection, setSelectedSection] = useState('important');

    return (
        <sectionContext.Provider value={{ selectedSection, setSelectedSection }}>
            {props.children}
        </sectionContext.Provider>
    );
}

function ProjectDetail() {
    const router = useRouter()
    const [projectData, setprojectData] = useState({});
    const [dashboardData, setDashboardData] = useState({});
    const [Tasks, setTasks] = useState([])
    const [Loading, setLoading] = useState(true)
    useEffect(() => {
        if (router.query.id) {
            getSingleProjectController({ id: router.query.id })
                .then(async (data) => {
                    setprojectData(data.data.response.data);
                }).catch((err) => {
                    console.log(err);
                    toast.error("error occured while fetching")
                })

            getProjectDashboardController({ project: router.query.id })
                .then(async (data) => {
                    setDashboardData(data.data.response.data);
                    setLoading(false)
                }).catch((err) => {
                    console.log(err);
                    toast.error("error occured while fetching")
                })
        }
    }, [router.query])

    if (Loading) return <Loader />

    else

        return (
            <SectionProvider>
                <section>
                    <ActiveTasks dashboardData={dashboardData} data={projectData} Tasks={Tasks} project={router.query.id} />
                </section>
            </SectionProvider>
        )
}

export default ProjectDetail