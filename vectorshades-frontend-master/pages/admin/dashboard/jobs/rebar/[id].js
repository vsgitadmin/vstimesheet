import React, { useEffect, useState } from 'react'
import RebarTable from '../../../../../src/Components/Jobs/Rebar/RebarTable'
import RebarTopCard from '../../../../../src/Components/Jobs/Rebar/RebarTopCard'
import { getRebarJobDetails } from '../../../../../src/Controllers/Jobs/index'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Loader from '../../../../../src/Components/Loader/loader'

const index = () => {
  const router = useRouter()
  const [rebarJobData, setRebarJobData] = useState(null)
  const [Loading, setLoading] = useState(true)

  const getRebarJobData = async (id) => {
    setLoading(true)
    getRebarJobDetails({ id })
      .then((response) => setRebarJobData(response.data.response.data))
      .then(() => setLoading(false))
      .catch((err) => toast("unable to process request"))
  }

  useEffect(() => {
    if(router.query.id){
      getRebarJobData(router.query.id)
    }
  }, [router.query.id])

  if(Loading) return <Loader/>
  return (
    <div style={{ padding: "33.6px", paddingTop: "0" }} >
      <h2>Rebar</h2>
      <RebarTopCard rebarJobData={rebarJobData} />
      <RebarTable />
    </div>
  )
}

export default index