import React from 'react'
import SalesPerformance from '../../../../../../src/Components/SalesPerformance/SalesPerformance'
import { getSalesPerfomanceController } from '../../../../../../src/Controllers/Rebar/index'
import { toast } from 'react-toastify'


const index = () => {
  const [salesPerfomanceData, setSalesPerfomanceData] = React.useState()

  const getSalesPerfomance = async () => {
    getSalesPerfomanceController()
      .then((response) => setSalesPerfomanceData(response.data.response.data))
      .catch((err) => toast("unable to process request"))
  }

  React.useEffect(() => {
    getSalesPerfomance()
  }, [])

  return (
    <>
      <SalesPerformance perfomance={salesPerfomanceData} />
    </>
  )
}

export default index