import { useState, useEffect} from "react"
import Notification from "../../../src/Components/Notification/Notification"
import { getUserNotifications } from '../../../src/Controllers/Communication/index'
import Loader from '../../../src/Components/Loader/loader'
import { toast } from "react-toastify"

const notification = () => {
  const [data, setdata] = useState(null)
  const [Loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications({ page: 0 })
  }, [])

  const getNotifications = async (query) => {
    try {
      const { data } = await getUserNotifications(query)
      setdata(data.response.data);
      setLoading(false)
      return
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (Loading) return <Loader />

  else return (
    <>
      <Notification data={data} />
    </>
  )
}

export default notification