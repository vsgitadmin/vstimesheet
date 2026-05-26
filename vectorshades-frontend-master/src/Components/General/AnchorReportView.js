'use client';

import React from 'react';
import styles from './ReportView.module.css'; // reuse same styling
import { StyledTable } from '../Table/Table.Styled';

const AnchorReportView = ({ data = [], link , close }) => {
    if (!data.length) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContainer}>
                <header className={styles.modalHeader}>
                    <h2>Report</h2>
                    {/* You can add a close button here if needed */}
                </header>
                <main className={styles.modalBody}>
                    <StyledTable>
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => (
                                <tr key={idx}>
                                    {Object.entries(row).map(([key, value]) => (
                                        <td key={key}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </main>
                <br/>
                <footer className={styles.modalFooter}>
                    <a href={link} download className={styles.saveButton}>
                        Download
                    </a>
                    <a onClick={close} className={styles.saveButton}>
                        Close
                    </a>
                </footer>
            </div>
        </div>
    );
};

export default AnchorReportView;
