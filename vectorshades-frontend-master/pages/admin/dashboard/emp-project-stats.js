import EmployeeListProjectStatus from "../../../src/Components/EmployeeListPojectStatus/EmployeeListProjectStatus"
import {useEffect, useState} from "react";
import {getProjectStatsController} from "../../../src/Controllers/projects/index"
import {toast} from "react-toastify";


const Index = () => {

  const [projectStats, setProjectStats] = useState([])

  useEffect(() => {
    getProjectStatsController().then((res)=>{
      setProjectStats(res.data.response.data)
    }).catch((err)=>{
      toast.error(err.message)
      throw err
    })
  }, []);

  return (
    <EmployeeListProjectStatus projectStats={projectStats}/>
  )
}

export default Index