import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import ProjectList from '../../../../src/Components/Project/ProjectList'
import { getProjectListByAdminController, searchProjectController } from '../../../../src/Controllers/projects/index'
import Loader from '../../../../src/Components/Loader/loader'

function AdminProjects() {
  const [projectData, setprojectData] = useState(null);
  const [Loading, setLoading] = useState(false)
  const [maxPages, setMaxPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchProjectAdminProjects()
  }, [currentPage])

  const searchProjectsFunction = async (e) => {
    try {
      const { data } = await getProjectListByAdminController({ search: e.target.value })
      setprojectData(data.response.data)
    } catch (err) {
      toast.error("Project search failed")
    }
  }

  const fetchProjectAdminProjects = async () => {
    try {
      const { data } = await getProjectListByAdminController({ page: currentPage })
      setprojectData(data.response.data)
      setMaxPages(data.response.data.page.maxPages)
      setLoading(false)
    } catch (err) {
      toast.error('error while fetcshing projects')
    }
  }

  if (Loading) return <Loader />
  else return (
    <ProjectList setCurrentPage={setCurrentPage} maxPages={maxPages} projects={projectData?.projects} searchProjectsFunction={searchProjectsFunction} analytics={projectData?.analytics} />
  )
}

export default AdminProjects