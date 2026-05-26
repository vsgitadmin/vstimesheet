import React from 'react'
import SalesPerformance from '../../../../../../src/Components/SalesPerformance/SalesPerformance'
import { getSalesPerfomanceController } from '../../../../../../src/Controllers/Jobs/index'
import { toast } from 'react-toastify'


const index = () => {
  const [salesPerfomanceData, setSalesPerfomanceData] = React.useState()

  const getSalesPerfomance = async () => {
    getSalesPerfomanceController()
      .then((response) => setSalesPerfomanceData(response.data.response.data))
      .catch((err) => toast("unable to process request"))
  }

  const generatePerfomanceReport = async () => {
    getSalesPerfomanceController({ report: true })
      .then((response) => toast.success('Report Mailed Successfully'))
      .catch((err) => toast("unable to process request"))
  }



  React.useEffect(() => {
    getSalesPerfomance()
  }, [])

  return (
    <>
      <SalesPerformance createReport={generatePerfomanceReport} perfomance={salesPerfomanceData} />
    </>
  )
}

export default index