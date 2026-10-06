import React, { useState } from 'react'
import JobCustomizer from '../../../../src/Components/JobCustomizer/index'
import axios from '../../../../src/Axios/Axios.config'
import { job } from '../../../../src/Constants/API/Endpoints'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import SelectUserInput from '../../../../src/Components/SelectUserInput/index'
import { useClients } from '../../../../src/Constants/clients'
import SteelTools from '../../../../src/Constants/steelTools'
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined'
import styles from '../../../../styles/AddJob.module.css'

function Add() {
  const [body] = useState({})
  const router = useRouter()
  const { clients } = useClients()

  const createJob = (e) => {
    e.preventDefault()
    if (!body.assignedSales) {
      toast.error('please assign sales manager')
      return
    }
    axios.post(job.postjob, body)
      .then((res) => {
        toast.success(`${body.project} job added`)
        router.push('/admin/dashboard/jobs')
      })
      .catch((err) => { toast.error('Unable to create job') })
  }

  const setJobsCustomizer = (data) => body['sub_items'] = data
  const setTotalCustomizer = (data) => body['total_breakpoints'] = data

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
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><PostAddOutlinedIcon /></span>Add Steel Job</h1>
          <p className={styles.subtitle}>Fill in the job details and line items to create a new job</p>
        </div>
      </div>

      <div>
        <div className={styles.formCard}>
          <div className={styles.sectionLabel}>Job Details</div>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="project">Project Name</label>
              <input id="project" required type="text" placeholder='Project Name' onChange={(e) => body.project = e.target.value} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="client">Client</label>
              <select id="client" onChange={(e) => body.client = e.target.value}>
                <option hidden>Select Client</option>
                {Object.keys(clients).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="job_date">Job Date</label>
              <input id="job_date" required type="date" onChange={(e) => body.date = e.target.value} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="software">Software</label>
              <select id="software" multiple onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(option => option.value)
                body.software = selected.join(',')
              }}>
                <option hidden>Select Tool</option>
                {SteelTools.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="po_no">PO No</label>
              <input id="po_no" type="text" placeholder='PO#' onChange={(e) => body.poNumber = e.target.value} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="est_date">Est Date</label>
              <input id="est_date" required type="date" onChange={(e) => body.estimate = e.target.value} />
            </div>
            <div className={styles.inputGroup}>
              <label>Add Sales</label>
              <SelectUserInput createJob={true} returnUser={handleSalesSelect} label={'Add Sales'} returnRaw={true} deleteUser={handleSalesDelete} />
            </div>
            <div className={styles.inputGroup}>
              <label>Add Connection Engineer</label>
              <SelectUserInput label={'Add Connection Engineer'} createJob={true} returnUser={handleConnectionEngineerSelect} returnRaw={true} deleteUser={handleConnectionEngineerDelete} />
            </div>
            <div className={styles.inputGroup}>
              <label>Secondary Sales</label>
              <SelectUserInput createJob={true} returnUser={handleSecondarySalesSelect} returnRaw={true} deleteUser={handleSecondarySalesDelete} />
            </div>
            <div className={styles.inputGroup}>
              <label>Third Sales</label>
              <SelectUserInput createJob={true} returnUser={handleThirdSalesSelect} returnRaw={true} deleteUser={handleThirdSalesDelete} />
            </div>
          </div>
        </div>

        <div className={styles.customizerCard}>
          <div className={styles.sectionLabel}>Line Items</div>
          <JobCustomizer setJobs={setJobsCustomizer} setTotal={setTotalCustomizer} />
        </div>

        <div className={styles.submitRow}>
          <button type="button" onClick={createJob} className={styles.submitBtn}>Create Job</button>
        </div>
      </div>
    </div>
  )
}

export default Add
