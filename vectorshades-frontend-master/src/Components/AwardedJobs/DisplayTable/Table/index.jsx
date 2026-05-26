import React from "react";
import {
  StyledTable,
  Flexspan,
  Blockspan,
  Avatar,
  Container,
} from "./Table.Styled";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";

function Table({ data, enableEditPopup, navId, hideEdit }) {
  return (
    <Container>
      <StyledTable>
        <thead>
          <tr>
            {!hideEdit && (
              <th>
                <input type="checkbox"></input>
              </th>
            )}
            <th>S . No</th>
            <th>Date</th>
            {/* <th>
                            Estimated
                        </th> */}
            <th>Location</th>
            <th>Client Name</th>
            <th>Project No</th>

            <th>Project Name</th>
            <th>Software</th>
            <th>Con Engineer</th>
            <th>Tonnage</th>
            <th>Hours</th>
            <th>$PH</th>
            <th>Cost</th>
            <th>Po Price</th>
            <th>Engineering fee</th>
            <th>$ Per hour</th>
            <th>Bid %</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data, index) => {
            const {
              jobData,
              jobData: { total_breakpoints },
            } = data;
            const date = new Date(data.date)
              .toString()
              .split(" ")
              .slice(1, 3)
              .join(" ");
            const estimatedDate = new Date(jobData.estimate)
              .toString()
              .split(" ")
              .slice(1, 3)
              .join(" ");
            return (
              <tr
                key={data._id}
                className={navId == data._id ? "blinking" : ""}
              >
                {!hideEdit && (
                  <td
                    onClick={() => enableEditPopup(data)}
                    style={{ cursor: "pointer" }}
                  >
                    <EditOutlinedIcon />
                  </td>
                )}
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">{data.serialNumber}</Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">{date}</Blockspan>
                  </Blockspan>
                </td>
                {/* <td>
                                    <Blockspan>
                                        <Blockspan className='tb-md-title'>{estimatedDate}</Blockspan>
                                    </Blockspan>
                                </td> */}
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {data.location}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {jobData.client}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {data.jobNumber}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {jobData.project}
                    </Blockspan>
                  </Blockspan>
                </td>
                 <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {jobData.software}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {jobData.assignedConnectionEngineerBYName}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {data.tonnage}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {total_breakpoints?.hours}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">{"16"}</Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {total_breakpoints?.total_cost}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {total_breakpoints?.bid}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {total_breakpoints?.eng_fee}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {total_breakpoints?.bid_hour}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan className="tb-md-title">
                      {total_breakpoints?.percent}
                    </Blockspan>
                  </Blockspan>
                </td>
                <td>
                  <Blockspan>
                    <Blockspan
                      style={{ whiteSpace: "nowrap" }}
                      className="tb-md-title"
                    >
                      <Tooltip title={data?.notes || ""}>
                        <div>
                          {data.notes
                            ? data.notes.length < 20
                              ? data.notes
                              : data.notes.slice(0, 20)
                            : ""}
                          {data.notes && data.notes.length > 20 && "..."}
                        </div>
                      </Tooltip>
                    </Blockspan>
                  </Blockspan>
                </td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </Container>
  );
}

export default Table;
