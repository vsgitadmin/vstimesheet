import React, { useState } from 'react';
import { StyledTable, Container } from './Table.Styled';
import Image from 'next/image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { general } from '../../../../Helpers/index';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function Table({ data, enableEditPopup, completed, hideEditIcon, update, completedDashboard }) {
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

    function extractPercentage(expression) {
        const match = expression.match(/^\s*\w+\s*\*\s*(0\.\d+|1(\.0*)?)\s*$/);
        if (match) {
            const decimal = parseFloat(match[1]);
            return Math.round(decimal * 100);
        }
        return null;
    }

    const handleCancel = (tableId) => {
        setEditableFields({});
        setIsEditing(false);
        seteditingID(editingID.filter((id) => id !== tableId))
    };

    const handleSubmit = (tableId, data) => {
        update(data)
        seteditingID(editingID.filter((id) => id !== tableId))
    };

    const reOpenDashboardJob = (data) => {
        data.completedStatus = false
        data.toBeReviewedByAccounts = false
        update(data)
    }

    return (
        <Container>
            <StyledTable>
                <thead>
                    <tr>
                        {!hideEditIcon && <th> {/* Checkbox column */}</th>}
                        <th>S.NO</th>
                        <th>Awarded Date</th>
                        <th>Location</th>
                        <th>Client Name</th>
                        <th>Job No</th>
                        <th>Project Name</th>
                        <th>PO Price</th>
                        <th>CO P/H</th>
                        <th>CO Price</th>
                        <th>Billed</th>
                        <th>Billing Backlog</th>
                        <th>OFA Backlog</th>
                        <th>Fab Backlog</th>
                        <th>Bid Hours</th>
                        <th>CO Hours</th>
                        <th>Used Hours</th>
                        <th>Backlog Hrs</th>
                        <th>Est Final Balance</th>
                        <th>RTR</th>
                        {completedDashboard && <th>Reopen</th>}
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
                                <td>{DateToMonthYear(awardData.date)}</td>
                                <td>{awardData.location}</td>
                                <td>{jobData.client}</td>
                                <td>{awardData.jobNumber}</td>
                                <td>{jobData.project}</td>
                                <td>{data.po_price}</td>
                                {editingID.includes(data._id) ? (
                                    <td className="edit_project_input">
                                        <input
                                            autoFocus
                                            defaultValue={data.co_ph}
                                            type="text"
                                            onChange={(e) =>
                                                updatedData['co_ph'] = parseInt(e.target.value)
                                            }
                                        />
                                    </td>
                                ) : (
                                    <td>${data.co_ph}</td>
                                )}
                                {editingID.includes(data._id) ? (
                                    <td className="edit_project_input">
                                        <input
                                            autoFocus
                                            defaultValue={data.co_price}
                                            type="text"
                                            onChange={(e) =>
                                                updatedData['co_price'] = parseInt(e.target.value)
                                            }
                                        />
                                    </td>
                                ) : (
                                    <td>{data.co_price.toFixed(2)}</td>
                                )}
                                {editingID.includes(data._id) ? (
                                    <td className="edit_project_input">
                                        <input
                                            autoFocus
                                            defaultValue={data.billed}
                                            type="text"
                                            onChange={(e) =>
                                                updatedData['billed'] = parseInt(e.target.value)
                                            }
                                        />
                                    </td>
                                ) : (
                                    <td>{data.billed.toFixed(2)}</td>
                                )}
                                <td>{data.billing_backlog.toFixed(2)}</td>
                                {editingID.includes(data._id) ? (
                                    <td className="edit_project_input">
                                        <select
                                            defaultValue={extractPercentage(data.OFABacklogFormula)}
                                            className="year_select_dropdown"
                                            style={{width:'4rem',paddingLeft:'0rem',color:'darkred'}}
                                            onChange={(e) => {
                                                const percent = e.target.value;
                                                const formula = `po_price*${percent / 100}`;
                                                updatedData['OFABacklogFormula'] = formula
                                            }}
                                        >
                                            <option disabled>Select Percentage</option>
                                            {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map((value) => (
                                                <option key={value} value={value}>
                                                    {value}%
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                ) : (
                                    <td>{data.OFABacklog}</td>
                                )}
                                {editingID.includes(data._id) ? (
                                    <td className="edit_project_input">
                                        <select
                                            defaultValue={extractPercentage(data.FABBacklogFormula)}
                                            className="year_select_dropdown"
                                            style={{width:'4rem',paddingLeft:'0rem',color:'darkred'}}
                                            onChange={(e) => {
                                                const percent = e.target.value;
                                                const formula = `po_price*${percent / 100}`;
                                                updatedData['FABBacklogFormula'] = formula

                                            }}
                                        >
                                            <option disabled>Select Percentage</option>
                                            {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map((value) => (
                                                <option key={value} value={value}>
                                                    {value}%
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                ) : (
                                    <td>{data.FABBacklog}</td>
                                )}
                                <td>{data.bidHours.toFixed(2)}</td>
                                {editingID.includes(data._id) ? (
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
                                    <td>{data.co_hours.toFixed(2)}</td>
                                )}
                                {editingID.includes(data._id) ? (
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
                                    <td>{data.usedHours.toFixed(2)}</td>
                                )}
                                <td>{data.backlogHours.toFixed(2)}</td>
                                <td>{data.finalBalance.toFixed(2)}</td>
                                {data.completedStatus ? <td style={{ paddingRight: "15px" }} ><VerifiedIcon /></td>
                                    : <td>
                                        <button onClick={() => {
                                            updatedData['completedStatus'] = true
                                            update(updatedData)
                                        }} style={jobAlert && !data.completedStatus ? {} : { cursor: 'not-allowed', backgroundColor: 'grey' }} disabled={jobAlert && !data.completedStatus ? false : true} className="rtr_label">REVIEW</button>
                                    </td>
                                }
                                {completedDashboard && <td style={{ cursor: 'pointer' }} onClick={() => reOpenDashboardJob(data)}><LockOpenIcon /></td>}
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </Container>
    );
}

export default Table;
