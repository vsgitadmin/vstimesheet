import React, { useState } from 'react';
import { StyledTable, Container } from './Table.Styled';
import Image from 'next/image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { general } from '../../../../Helpers/index';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Switch, ToggleButton } from '@mui/material';

function RebarDashboardTable({ data, enableEditPopup, completed, hideEditIcon, update, ToggleLinkOnly, linkOnly }) {
    const { DateToMonthYear } = general;
    const [tableEdit, setTableEdit] = useState({ jobId: '' });
    const [editingID, seteditingID] = useState([])
    const [editableFields, setEditableFields] = useState({});
    const [updatedData, setupdatedData] = useState([])
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = (jobId) => {
        setTableEdit({ jobId });
        setIsEditing(true);
    };

    const handleCancel = (tableId) => {
        setEditableFields({});
        setIsEditing(false);
        seteditingID(editingID.filter((id) => id !== tableId))
    };

    const handleSubmit = (tableId, data) => {
        update(data)
        seteditingID(editingID.filter((id) => id !== tableId))
    };

    return (
        <Container>
            <StyledTable>
                <thead>
                    <tr>
                        {!hideEditIcon && <th> {/* Checkbox column */}</th>}
                        <th>S.NO</th>
                        {linkOnly && <th>Type</th>}
                        {!linkOnly && <>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Client Name</th>
                            <th>Project Name</th>
                        </>}
                        {linkOnly && <>
                            <th>Tons</th>
                            <th>Tons Detailed</th>
                            {/* <th>Ready To Bill</th> */}
                            {/* <th>Timesheet Detailed</th> */}
                            {/* <th>Tons Billable</th> */}
                            <th>Tons Billed</th>
                            <th>Ton P/H</th>
                            <th>Pending Tons</th>
                        </>}

                        <th>Billing Pending</th>
                        <th>Billing Backlog</th>
                        {linkOnly && <th>In Progress</th>}
                        <th>RTR</th>
                        {!linkOnly && <th>Job Links</th>}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((data, index) => {
                        const awardData = data.awardedProjectData;
                        const jobData = awardData.jobData;
                        const jobAlert = data.toBeReviewedByAccounts;
                        const isCurrentEditing = tableEdit.jobId === data.jobId;
                        const updatedData = data

                        return (
                            <tr key={index} className={jobAlert && !data.completedStatus ? 'blinking' : ''}>
                                {!hideEditIcon && (
                                    <td style={{ cursor: 'pointer' }}>
                                        {editingID.includes(data._id) ? (
                                            <>
                                                <CheckIcon onClick={() => handleSubmit(data._id, updatedData)} style={{ cursor: 'pointer' }} />
                                                <CloseIcon onClick={() => handleCancel(data._id)} style={{ cursor: 'pointer' }} />
                                            </>
                                        ) : (
                                            <EditOutlinedIcon onClick={() => !completed && seteditingID((e) => [...e, data._id])} />
                                        )}
                                    </td>
                                )}
                                <td>{index + 1}</td>
                                {linkOnly && <th>{jobData.rebarType}</th>}
                                {!linkOnly && <>
                                    <td>{DateToMonthYear(awardData.date)}</td>
                                    <td>{awardData.location}</td>
                                    <td>{jobData.client}</td>
                                    <td>{jobData.project}</td>
                                </>}
                                {linkOnly && <>
                                    {editingID.includes(data._id) ? (
                                        <td className="edit_project_input">
                                            <input
                                                autoFocus
                                                defaultValue={data.tons}
                                                type="text"
                                                onChange={(e) =>
                                                    updatedData['tons'] = parseInt(e.target.value)
                                                }
                                            />
                                        </td>
                                    ) : (
                                        <td>{data.tons}</td>
                                    )}
                                    {editingID.includes(data._id) ? (
                                        <td className="edit_project_input">
                                            <input
                                                autoFocus
                                                defaultValue={data.tonsDetailed}
                                                type="text"
                                                onChange={(e) =>
                                                    updatedData['tonsDetailed'] = parseInt(e.target.value)
                                                }
                                            />
                                        </td>
                                    ) : (
                                        <td>{data.tonsDetailed}</td>
                                    )}
                                    {/* {editingID.includes(data._id) ? (
                                        <td className="edit_project_input">
                                            <input
                                                autoFocus
                                                defaultValue={data.readyToBill}
                                                type="text"
                                                onChange={(e) =>
                                                    updatedData['readyToBill'] = parseInt(e.target.value)
                                                }
                                            />
                                        </td>
                                    ) : (
                                        <td>{data.readyToBill}</td>
                                    )} */}
                                    {/* <td>{data.tonsDetailedTimesheet}</td> */}
                                    {/* {editingID.includes(data._id) ? (
                                        <td className="edit_project_input">
                                            <input
                                                autoFocus
                                                defaultValue={data.tonsBillable}
                                                type="text"
                                                onChange={(e) =>
                                                    updatedData['tonsBillable'] = parseInt(e.target.value)
                                                }
                                            />
                                        </td>
                                    ) : (
                                        <td>{data.tonsBillable}</td>
                                    )} */}
                                    {editingID.includes(data._id) ? (
                                        <td className="edit_project_input">
                                            <input
                                                autoFocus
                                                defaultValue={data.tonsBilled}
                                                type="text"
                                                onChange={(e) =>
                                                    updatedData['tonsBilled'] = parseInt(e.target.value)
                                                }
                                            />
                                        </td>
                                    ) : (
                                        <td>{data.tonsBilled}</td>
                                    )}
                                    <td>{jobData.perTon}</td>
                                    <td>{data.pendingTons}</td>
                                </>}
                                <td>{data.billingPending}</td>
                                <td>{data.billingBacklog}</td>
                                {/* {editingID.includes(data._id) ? (
                                    <td className="edit_project_input">
                                        <input
                                            autoFocus
                                            defaultValue={data.co_hours}
                                            type="text"
                                            onChange={(e) =>
                                                updatedData['co_hours'] = parseInt(e.target.value)
                                            }
                                        />
                                    </td>
                                ) : (
                                    <td>{data.co_hours}</td>
                                )} */}
                                {/* {editingID.includes(data._id) ? (
                                    <td className="edit_project_input">
                                        <input
                                            autoFocus
                                            defaultValue={data.usedHours}
                                            type="text"
                                            onChange={(e) =>
                                                updatedData['usedHours'] = parseInt(e.target.value)
                                            }
                                        />
                                    </td>
                                ) : (
                                    <td>{data.usedHours}</td>
                                )} */}
                                {/* <td>{data.backlogHours}</td>
                                <td>{data.finalBalance}</td> */}
                                {linkOnly && <>
                                    {editingID.includes(data._id) ? <Switch onChange={() => {
                                        updatedData['workInProgress'] = !data.workInProgress
                                        // update(updatedData)
                                    }} defaultChecked={data.workInProgress} /> : <td><VerifiedIcon style={{ fill: data.workInProgress ? '#e64848' : '#8080808a' }}/></td>}
                                </>}
                                {data.completedStatus ? <td style={{ paddingRight: "15px" }} ><VerifiedIcon /></td>
                                    : <td>
                                        <button onClick={() => {
                                            updatedData['completedStatus'] = true
                                            update(updatedData)
                                        }} style={jobAlert && !data.completedStatus ? {} : { cursor: 'not-allowed', backgroundColor: 'grey' }} disabled={jobAlert && !data.completedStatus ? false : true} className="rtr_label">REVIEW</button>
                                    </td>
                                }
                                {!linkOnly && <td> <button className="rtr_label" onClick={() => ToggleLinkOnly(data.jobId)}>VIEW</button></td>}
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </Container>
    );
}

export default RebarDashboardTable;
