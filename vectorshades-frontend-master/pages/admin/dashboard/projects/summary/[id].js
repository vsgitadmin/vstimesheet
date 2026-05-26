import React, { useState, useEffect } from 'react'
import { getProjectSummaryController,getSingleProjectController } from '../../../../../src/Controllers/projects/index'
import Loader from '../../../../../src/Components/Loader/loader'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import ProjectsSummary from '../../../../../src/Components/ProjectSummary/ProjectSummary'

function ProjectSummary() {
  const [SummaryData, setSummaryData] = useState({});
  const [ProjectData, setProjectData] = useState({})
  const [Loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      getProjectSummaryController({ project: router.query.id })
        .then(async (projectSummary) => {
          const {data} = await getSingleProjectController({id:router.query.id})
          setProjectData(data.response.data)
          setSummaryData(projectSummary.data.response.data)
          setLoading(false)
        })
        .catch((err) => {
          toast.error("error while fetching project summary");
          console.log(err)
        })
    }
  }, [router.query])


  if (Loading) return <Loader />
  else return (
    <>
      <ProjectsSummary data={SummaryData} projectData={ProjectData} />
    </>
  )
}

export default ProjectSummary