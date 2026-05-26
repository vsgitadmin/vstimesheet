import React from "react";
import {
  StyledTable,
  Blockspan,
  Container,
} from "./Table.Styled";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import { useRouter } from "next/navigation";

function AllJobsRebarTable({ data }) {
  const router = useRouter();


  const formatNumber = (number) => {
    const parsed = parseFloat(number);
    if (isNaN(parsed)) return "-";
    return parsed % 1 === 0 ? parsed.toString() : parsed.toFixed(2);
  };

  return (
    <Container>
      <StyledTable>
        <thead>
          <tr>
            <th>Awarded</th>
            <th>Bid Date</th>
            <th>Location</th>
            <th>Client Name</th>
            <th>Project Name</th>
            <th>Job Location</th>
            <th>Job Type</th>
            <th>Sales Person</th>
            <th>Hours</th>
            <th>Tons</th>
            <th>TP Hour</th>
            <th>$ Per Ton</th>
            <th>$ CostPH</th>
            <th>Cost</th>
            <th>Bid Price</th>
            <th>PricePH</th>
            <th>Bid %</th>
            <th>Target</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((job, index) => {
              const bidDate = new Date(job.date).toString().split(" ").slice(1, 3).join(" ")

              return (
                <tr
                  onClick={() => router.push(`/admin/dashboard/rebar/${job._id}`)}
                  key={job._id}
                  style={{cursor:'pointer'}}
                >
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title"><VerifiedIcon style={{ fill: job.awarded ? '#e64848' : '#0000002e' }} /></Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">{bidDate}</Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">-</Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">{job.client}</Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">{job.project}</Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">-</Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">{job.rebarType}</Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">{job.assignedSalesBYName}</Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        {formatNumber(job?.total_breakpoints?.estimatedHours)}
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        {formatNumber(job?.total_breakpoints?.estimatedTons)}
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        ${formatNumber(job?.total_breakpoints?.tonPH)}
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        ${formatNumber(job?.perTon)}
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        ${formatNumber(job?.total_breakpoints?.costPH)}
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        ${formatNumber(job?.total_breakpoints?.cost)}
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        ${formatNumber(job?.total_breakpoints?.bidPrice)}
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        ${formatNumber(job?.total_breakpoints?.pricePH)}
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">
                        {formatNumber(job?.total_breakpoints?.bidPercentage)}%
                      </Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">-</Blockspan>
                    </Blockspan>
                  </td>
                  <td>
                    <Blockspan>
                      <Blockspan className="tb-md-title">-</Blockspan>
                    </Blockspan>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </StyledTable>
    </Container>
  );
}

export default AllJobsRebarTable;
