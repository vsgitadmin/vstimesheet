import React from 'react'
import { StyledTable, Flexspan, Blockspan, Avatar, Container } from './Table.Styled'
import Image from 'next/image'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useRouter } from 'next/router';

function RebarAwardedDisplayTable({ data, enableEditPopup, navId, hideEdit }) {
    const router = useRouter();

    return (
        <Container>
            <StyledTable>
                <thead>
                    <tr>
                        {!hideEdit && <th>
                            <input type="checkbox"></input>
                        </th>}
                        <th>
                            S . No
                        </th>
                        <th>
                            Date
                        </th>
                        <th>
                            Location
                        </th>
                        <th>
                            Client Name
                        </th>
                        <th>
                            Project Name
                        </th>
                        <th>
                            Estimated Hours
                        </th>
                        <th>
                            Estimated Tons
                        </th>
                        <th>
                            Ton PH
                        </th>
                        <th>
                            Per Ton
                        </th>
                        <th>
                            Cost Per Hour
                        </th>
                        <th>
                            Cost
                        </th>
                        <th>
                            Bid Price
                        </th>
                        <th>
                            Price Per Hour
                        </th>
                        <th>
                            Bid%
                        </th>
                        <th>
                            Notes
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data, index) => {
                        const { jobData, jobData: { total_breakpoints } } = data
                        const date = new Date(data.date).toString().split(" ").slice(1, 3).join(" ")
                        const estimatedDate = new Date(jobData.estimate).toString().split(" ").slice(1, 3).join(" ")
                        return (
                            <tr
                                key={data._id}
                                className={navId == data._id ? 'blinking' : ''}
                                onClick={() => data.projectId && router.push(`/admin/dashboard/projects/${data.projectId}`)}
                                style={{ cursor: data.projectId ? "pointer" : undefined }}
                                title={data.projectId ? "Open project" : undefined}
                            >
                                {!hideEdit && <td onClick={(e) => { e.stopPropagation(); enableEditPopup(data) }} style={{ cursor: "pointer" }}>
                                    <EditOutlinedIcon />
                                </td>}
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{index + 1}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{date}</Blockspan>
                                    </Blockspan>
                                </td>
                                {/* <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{estimatedDate}</Blockspan>
                                    </Blockspan>
                                </td> */}
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.location}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{jobData.client}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{jobData.project}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.estimatedHours}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.estimatedTons}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.tonPH}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.perTon}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.costPH}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.cost}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.bidPrice}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.pricePH}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{data.jobData.total_breakpoints.bidPercentage}</Blockspan>
                                    </Blockspan>
                                </td>
                                <td>
                                    <Blockspan>
                                        <Blockspan style={{ whiteSpace: "normal", display: "block", minWidth: "200px", maxWidth: "320px" }} className='tb-md-title'>{data.notes || ""}</Blockspan>
                                    </Blockspan>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </StyledTable>
        </Container>
    )
}

export default RebarAwardedDisplayTable
