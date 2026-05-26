import React, { useEffect, useState } from 'react'
import JobCustomizer from '../../../../src/Components/JobCustomizer/index';
import axios from '../../../../src/Axios/Axios.config'
import { job } from "../../../../src/Constants/API/Endpoints"
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import SelectUserInput from '../../../../src/Components/SelectUserInput/index';
import SelectClientInput from '../../../../src/Components/SelectClientInput/index';
import { useClients } from '../../../../src/Constants/clients';
import SteelTools from '../../../../src/Constants/steelTools';

function Add() {
  const [body] = useState({})
  const router = useRouter();
  const { clients } = useClients();


  const createJob = (e) => {
    e.preventDefault();
    if (!body.assignedSales) {
      toast.error('please assign sales manager')
      return;
    }
    axios.post(job.postjob, body)
      .then((res) => {
        toast.success(`${body.project} job added`);
        router.push('/admin/dashboard/jobs')
      })
      .catch((err) => { toast.error("Unable to create job") })
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

  const handleSecondarySalesSelect = (user) => {
    body.assignedSecondarySales = user._id
    body.assignedSecondarySalesBYName = user.firstName + ' ' + user.lastName
  }

  const handleConnectionEngineerSelect = (user) => {
    body.assignedConnectionEngineer = user._id
    body.assignedConnectionEngineerBYName = user.firstName + ' ' + user.lastName
  }

  const handleThirdSalesSelect = (user) => {
    body.assignedThirdSales = user._id
    body.assignedThirdSalesBYName = user.firstName + ' ' + user.lastName
  }

  const handleThirdSalesDelete = () => {
    delete body.assignedThirdSales
    delete body.assignedThirdSalesBYName
  }

  const handleSecondarySalesDelete = () => {
    delete body.assignedSecondarySales
    delete body.assignedSecondarySalesBYName
  }

  const handleConnectionEngineerDelete = () => {
    delete body.assignedConnectionEngineer
    delete body.assignedConnectionEngineerBYName
  }

  return (
    <div className="add_job">
      <div className="head">
        <h1>Add Steel Job</h1>
        <div className='add_job_form_container' >
          <div className='add_job_input_group' >
            <label htmlFor="project">Project Name</label><br />
            <input required type="text" placeholder='Project Name' onChange={(e) => body.project = e.target.value} />
          </div>
          <div className='add_job_input_group' >
            <label htmlFor="client">Client</label>
            <select onChange={(e) => body.client = e.target.value}>
              <option hidden>Select Client</option>
              {Object.keys(clients).map((name) => {
                return (
                  <option value={name}>{name}</option>
                )
              })}
            </select>
            {/* <input required type="text" placeholder='Client' onChange={(e) => body.client = e.target.value} /> */}
          </div>
          {/* <div className='add_job_input_group' >
            <label htmlFor="eng_fee">Engineering Fee</label><br />
            <input required type="text" placeholder='Engineering Fee' onChange={(e) => body.engineering_fee = e.target.value} />
          </div> */}
          <div className='add_job_input_group' >
            <label htmlFor="job_date">Job Date</label><br />
            <input required type="date" placeholder='date' onChange={(e) => body.date = e.target.value} />
          </div>
          <div className='add_job_input_group' >
            <label htmlFor="job_date">Software</label><br />
            <select multiple onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option => option.value);
              body.software = selected.join(',');
            }}>
              <option hidden>Select Tool</option>
              {SteelTools.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className='add_job_input_group' >
            <label htmlFor="job_date">PO No</label><br />
            <input type="text" placeholder='PO#' onChange={(e) => body.poNumber = e.target.value} />
          </div>
          <div className='add_job_input_group' >
            <label htmlFor="est_date">Est Date</label><br />
            <input required type="date" placeholder='estimated date' onChange={(e) => body.estimate = e.target.value} />
          </div>
          <div className='add_job_input_group' style={{ marginTop: "3.8px" }} >
            <SelectUserInput createJob={true} returnUser={handleSalesSelect} label={'Add Sales'} returnRaw={true} deleteUser={handleSalesDelete} />
          </div>
          <div className='add_job_input_group' style={{ marginTop: "3.8px" }} >
            <SelectUserInput label={'Add Connection Engineer'} createJob={true} returnUser={handleConnectionEngineerSelect} returnRaw={true} deleteUser={handleConnectionEngineerDelete} />
          </div>
          <div className='add_job_input_group' style={{ marginTop: "3.8px" }} >
            <SelectUserInput createJob={true} returnUser={handleSecondarySalesSelect} returnRaw={true} deleteUser={handleSecondarySalesDelete} />
          </div>
          <div className='add_job_input_group' style={{ marginTop: "3.8px" }} >
            <SelectUserInput createJob={true} returnUser={handleThirdSalesSelect} returnRaw={true} deleteUser={handleThirdSalesDelete} />
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="customise_job">
        <JobCustomizer setJobs={setJobsCustomizer} setTotal={setTotalCustomizer} />
      </div>
      <div className='button_box'>
        <button onClick={createJob}>Create Job</button>
      </div>
    </div>
  )
}

export default Add