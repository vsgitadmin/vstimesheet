import React, { useEffect, useState } from 'react'
import Tasks from '../../../../../src/Components/ActiveTasks/Tasks'
import { getSingleProjectController } from '../../../../../src/Controllers/projects'
import Loader from '../../../../../src/Components/Loader/loader'

export default function GeneralTask() {
    const [Loading, setLoading] = useState(true)
    const [project, setproject] = useState(null)

    const fetchProject = async () => {
        getSingleProjectController({ id: '5d518d7a-77eb-4c93-a1db-e2011425a21b' })
            .then(async (data) => {
                setproject(data.data.response.data);
                setLoading(false)
            }).catch((err) => {
                toast.error("error occured while fetching")
            })
    }

    useEffect(() => {
        fetchProject()
    }, [])

    if (Loading) {
        return <Loader />
    } else
        return (
            <Tasks project={project?._id} generalOnly={true} projectDetails={project} />
        )
}
