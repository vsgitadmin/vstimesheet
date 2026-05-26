import React, { useEffect, useState } from 'react'
import axios from '../../../../src/Axios/Axios.config'
import { rebarJob } from "../../../../src/Constants/API/Endpoints"
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import SelectUserInput from '../../../../src/Components/SelectUserInput/index';
import RebarJobCustomizer from '../../../../src/Components/RebarJobCustomizer';
import { useRebarClients } from '../../../../src/Constants/rebarClients'
import RebarTools from '../../../../src/Constants/rebarTools'

function Add() {
  const [body] = useState({})
  const router = useRouter();
  const [jobType, setjobType] = useState(null)
  const [linkJob, setlinkJob] = useState(false)
  const { clients: RebarClients } = useRebarClients();

  useEffect(() => {
    if (router.query.link) setlinkJob(true)
  }, [])


  const createJob = (e) => {
    e.preventDefault();
    if (!linkJob && !body.assignedSales) {
      toast.error('please assign sales manager')
      return;
    }
    if (linkJob) {
      body.linked = true
      body.linkedId = router.query.link
    }
    body.total_breakpoints = { ...body.total_breakpoints, totalHours: 0, tonsDetailed: 0, amountBilled: 0, resourceCount: 0 }

    axios.post(rebarJob.postjob, body)
      .then((res) => {
        if (!linkJob) toast.success(`${body.project} rebarJob added`);
        else toast.success(`Job Linked`);
        router.push('/admin/dashboard/rebar')
      })
      .catch((err) => { toast.error("Unable to create rebarJob") })
  }

  const setJobsCustomizer = (data) => body['sub_items'] = data;
  const setTotalCustomizer = (data) => body['total_breakpoints'] = data;

  const handleSalesSelect = (user) => {
    body.assignedSales = user._id
    body.assignedSalesBYName = user.firstName + ' ' + user.lastName
  }

  const handleSalesDelete = () => {
    delete body.assignedSales
    delete body.assignedSalesBYName
  }

  return (
    <div className="add_rebar_job_container">
      <div>
        <h1>Add Rebar Job</h1>
        {!linkJob ?
          <div className='add_rebar_job_form_container' >
            <div className='add_reabar_job_input_group' >
              <label htmlFor="project">Project Name</label><br />
              <input required type="text" placeholder='Project Name' onChange={(e) => body.project = e.target.value} />
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="client">Client</label><br />
              <select onChange={(e) => body.client = e.target.value}>
                <option hidden>Select Client</option>
                {Object.keys(RebarClients).map((name) => {
                  return (
                    <option value={name}>{name}</option>
                  )
                })}
              </select>
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="job_date">Job Date</label><br />
              <input required type="date" placeholder='date' onChange={(e) => body.date = e.target.value} />
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="est_date">Est Date</label><br />
              <input required type="date" placeholder='estimated date' onChange={(e) => body.estimate = e.target.value} />
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="est_date">Rebar Type</label><br />
              <select onChange={(e) => { body.rebarType = e.target.value; setjobType(e.target.value) }}>
                <option hidden>Select</option>
                <option value={'Detailing'}>Detailing</option>
                <option value={'Estimation'}>Estimation</option>
                <option value={'Dimensional Drawing'}>Dimensional Drawing</option>
              </select>
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="job_date">Per Hour</label><br />
              <input required type="number" placeholder='$PH' onChange={(e) => body.perHour = e.target.value} />
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="job_date">Software</label><br />
              <select multiple onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                body.software = selected.join(',');
              }}>
                <option hidden>Select Tool</option>
                {RebarTools.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="job_date">Per Ton</label><br />
              <input required type="number" placeholder='$PT' onChange={(e) => body.perTon = e.target.value} />
            </div>
            <div className='add_reabar_job_input_group' >
              <SelectUserInput createJob={true} returnUser={handleSalesSelect} returnRaw={true} deleteUser={handleSalesDelete} />
            </div>
          </div> : <div className='add_job_form_container'>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="est_date">Rebar Type</label><br />
              <select onChange={(e) => { body.rebarType = e.target.value; setjobType(e.target.value) }}>
                <option hidden>Select</option>
                <option value={'Detailing'}>Detailing</option>
                <option value={'Estimation'}>Estimation</option>
                <option value={'Dimensional Drawing'}>Dimensional Drawing</option>
              </select>
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="job_date">Per Hour</label><br />
              <input required type="number" placeholder='$PH' onChange={(e) => body.perHour = e.target.value} />
            </div>
            <div className='add_reabar_job_input_group' >
              <label htmlFor="job_date">Per Ton</label><br />
              <input required type="number" placeholder='$PT' onChange={(e) => body.perHour = e.target.value} />
            </div>
          </div>}

      </div>
      <br />
      <br />
      <div className="customise_job">
        {jobType && <RebarJobCustomizer key={jobType} type={jobType} setJobs={setJobsCustomizer} setTotal={setTotalCustomizer} />}
      </div>

                  <div className='add_reabar_job_input_group' >
              <button onClick={createJob}>Create Job</button>
            </div>
    </div>
  )
}

export default Add