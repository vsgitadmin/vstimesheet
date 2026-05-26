import React from 'react';
import { StyledTable, Container } from './Table.Styled';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

function Table({ data, projectView, onSortChange, sortingHead }) {
    const tableHeaders = [
        { label: "Location", key: "location" },
        { label: "Client", key: "client" },
        { label: "Job No", key: "jobNo" },
        { label: "Project No", key: "projectNo" },
        { label: "Project", key: "Project" },
        { label: "Description", key: "description" },
        { label: "Aging", key: "aging" },
        { label: "Transmittal Date", key: "transmittalDate" },
        { label: "Projected Billing", key: "projectedBilling" },
        { label: "CD", key: "cd" },
        { label: "Billed", key: "billed" },
        { label: "Invoice No", key: "invoiceNo" },
        { label: "Remarks", key: "remarks" },
    ];

    const filteredTableHeaders = projectView
        ? tableHeaders.filter(header => header.key !== "projectNo" && header.key !== "Project")
        : tableHeaders;

    const handleSort = (key) => {
        if (onSortChange) {
            if (sortingHead) {
                if (sortingHead.name == key.name) {                    
                    if (sortingHead.direction == "asc") {
                        onSortChange({ name: key.name, direction: "desc" });
                    } else {
                        onSortChange(undefined);
                    }
                }else{
                    onSortChange({...key, direction: "asc"});
                }
            }
            else onSortChange({...key, direction: "asc"});
        }
    };

    return (
        <Container>
            <StyledTable>
                <thead>
                    <tr>
                        {filteredTableHeaders.map((header, index) => (
                            <th
                                key={index}
                                onClick={() => handleSort({ name: header.key })}
                                style={{ cursor: 'pointer', }}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {header.label}
                                    {sortingHead && sortingHead.name == header.key && sortingHead.direction == "asc" && <ArrowDownward sx={{ marginLeft: "10px" }} />}
                                    {sortingHead && sortingHead.name == header.key && sortingHead.direction != "asc" && <ArrowUpward sx={{ marginLeft: "10px" }} />}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((data, index) => (
                        <tr key={index}>
                            <td>{data.location}</td>
                            <td>{data.client}</td>
                            <td>{data.jobNo}</td>
                            {!projectView && <td>{data.projectNo}</td>}
                            {!projectView && <td>{data.Project}</td>}
                            <td>{data.description}</td>
                            <td>{data.aging}</td>
                            <td>{new Date(data.transmittalDate).toLocaleDateString()}</td>
                            <td>{data.projectedBilling}</td>
                            <td>{data.cd}</td>
                            <td>{data.billed}</td>
                            <td>{data.invoiceNo}</td>
                            <td>{data.remarks}</td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
        </Container>
    );
}

export default Table;
