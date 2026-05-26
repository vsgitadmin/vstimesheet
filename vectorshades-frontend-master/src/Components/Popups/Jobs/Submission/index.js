import { Modal } from '@mui/material'
import React, { useState } from 'react'

function CreateSubmissionPopup({ closePopup, setData , submit}) {
    const [data, setdata] = useState({})

    const submitSubmission = (e) => {
        e.preventDefault()
        submit(data)
    }

    return (
        <Modal open onClose={closePopup}>
            <form onSubmit={submitSubmission}>
                <div className='award_popup award_popup_container'>
                    <div>
                        <h1>Create Submission</h1>

                        <select
                            required
                            placeholder="Location"
                            onChange={(e) => (data.location = e.target.value)}
                        >
                            <option hidden value="">
                                Location
                            </option>
                            <option value="Kochi">Kochi</option>
                            <option value="Chennai">Chennai</option>
                        </select>

                        {/* <input
                            required
                            type="text"
                            placeholder="Client"
                            onChange={(e) => (data.client = e.target.value)}
                        />

                        <input
                            required
                            type="text"
                            placeholder="Job Number"
                            onChange={(e) => (data.jobNo = e.target.value)}
                        />

                        <input
                            required
                            type="text"
                            placeholder="Project Number"
                            onChange={(e) => (data.projectNo = e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Project"
                            onChange={(e) => (data.Project = e.target.value)}
                        /> */}

                        <textarea
                            required
                            placeholder="Description"
                            onChange={(e) => (data.description = e.target.value)}
                        ></textarea>

                        <input
                            required
                            type="number"
                            placeholder="Aging"
                            onChange={(e) => (data.aging = e.target.value)}
                        />

                        <input
                            required
                            type="number"
                            placeholder="Projected Billing"
                            onChange={(e) => (data.projectedBilling = e.target.value)}
                        />
                        <input
                            required
                            type="number"
                            placeholder="CD"
                            onChange={(e) => (data.cd = e.target.value)}
                        />

                        <input
                            required
                            type="number"
                            placeholder="Billed"
                            onChange={(e) => (data.billed = e.target.value)}
                        />

                        <input
                            required
                            type="number"
                            placeholder="Invoice Number"
                            onChange={(e) => (data.invoiceNo = e.target.value)}
                        />
                        <label htmlFor='transmittal_date'>Transmittal Date</label>

                        <input
                            required
                            type="date"
                            placeholder="Transmittal Date"
                            name='transmittal_date'
                            onChange={(e) => (data.transmittalDate = e.target.value)}
                        />

                        <textarea
                            placeholder="Remarks"
                            onChange={(e) => (data.remarks = e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                        <div style={{ display: "flex", marginTop: "15px" }}>
                            <button type="submit">Create</button>
                            <button onClick={closePopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>

    )
}

export default CreateSubmissionPopup