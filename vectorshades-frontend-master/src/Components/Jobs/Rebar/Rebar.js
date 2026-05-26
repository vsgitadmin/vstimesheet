import style from '../../../../styles/Hr.module.css';
import { EditOutlined, Tune } from '@mui/icons-material'
import { useRouter } from 'next/router'
import JobCard from '../../JobCard/job_comp_card';
import RebarCard from './RebarCard';
import { getAllRebarJobsController } from '../../../../src/Controllers/Jobs/index'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Rebar = () => {
  const router = useRouter()
  const [rebarJobs, setRebarJobs] = useState(null)

  const fetchRebarJobs = () => {
    getAllRebarJobsController()
      .then((response) => setRebarJobs(response.data.response.data))
      .catch((err) => toast("unable to process request"))
  }

  useEffect(() => {
    fetchRebarJobs()
  }, [])

  return (
    <div className='jobs' >
      <div>
        <h1>Rebar</h1>
      </div>
      <p className='mt_1' >Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>

      <div className={style.ar_search_filter} >
        <input placeholder='Search' type="text" />
        <div><Tune style={{ fill: 'white' }} /></div>
      </div>


      <div className='job_list_main' style={{ marginTop: "40px" }} >
        <div className="list">
          {
            rebarJobs && rebarJobs.map((jobData) => <RebarCard jobData={jobData} />)
          }
        </div>
      </div>

    </div>
  )
}

export default Rebar
