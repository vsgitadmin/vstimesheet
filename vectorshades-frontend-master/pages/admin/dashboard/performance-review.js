import { toast } from 'react-toastify'
import PerformanceReview from '../../../src/Components/PerformanceReview/PerformanceReview'
import { getEmployeeAnalyticsOfSpecificYearController,getAllReviewsOfEmployeeController } from '../../../src/Controllers/Reviews'
import { useContext, useEffect ,useState} from 'react'

function PerformanceReviewMain({emp}) {
  const [employeeYearlyAnalytics,setemployeeYearlyAnalytics] = useState()
  const [reviews,setReviews] = useState([])

  const getEmployeeAnalyticsOfSpecificYear = async () => {
    await getEmployeeAnalyticsOfSpecificYearController({year:new Date().getFullYear(),emp})
    .then((response)=>setemployeeYearlyAnalytics(response.data.response.data))
    .catch((err)=>toast("unable to process request"))
  }

  const getAllReviewsOfEmployee = async() =>{
    await getAllReviewsOfEmployeeController({emp})
    .then((response)=>setReviews(response.data.response.data))
    .catch((err)=> toast.error('error occured '))
  }

  useEffect(()=>{
      getEmployeeAnalyticsOfSpecificYear()
      getAllReviewsOfEmployee()
  },[])

  return (
    <div>
     <PerformanceReview emp={emp} reviews={reviews} employeeYearlyAnalytics={employeeYearlyAnalytics} />
    </div>
  )
}

export default PerformanceReviewMain