'use client';

import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import styles from './ReportView.module.css';
import { StyledTable } from '../Table/Table.Styled';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { fetchCSVData } from '../../Helpers/Functions/Api Functions/readFileData';

const ReportView = forwardRef((_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [downloadData, setDownloadData] = useState([]);
    const [fileContent, setfileContent] = useState([])
    const [link, setlink] = useState()
    const requestRef = useRef(null);
    const bodyRef = useRef(null);
    const router = useRouter();

    const openView = async (request, body) => {
        setIsLoaded(false);
        setDownloadData([]);
        setIsOpen(true);

        requestRef.current = request;
        bodyRef.current = { ...body };

        try {
            const { data: { response: { url ,data } } } = await request({ ...body, data: true });
            setDownloadData(data);
            setlink(url)
            setIsLoaded(true);
        } catch (error) {
            console.error('Error fetching report data:', error);
            setIsOpen(false);
        }
    };

    const fetchAndLoadTableView = async (url) => {
        const data = await fetchCSVData(url)
        setfileContent(data)
        setlink(url)
    }

    useEffect(() => {
        if(Array.isArray(downloadData)){
            setfileContent(downloadData)
            setIsLoaded(true)
        } 
        else if (downloadData.url) fetchAndLoadTableView(downloadData.url)
        
    }, [downloadData])


    const download = async () => {
        if (!requestRef.current || !bodyRef.current) return;
        try {
            const { data: { response: { data } } } = await requestRef.current({ ...bodyRef.current, download: true });
            router.push(data.url);
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    useImperativeHandle(ref, () => ({ openView }));


    if (!isOpen) return null;

    return (
        <div onClick={() => setIsOpen(false)} className={styles.modal}>
            <div onClick={(e) => e.stopPropagation()} className={styles.modalContainer}>
                {isLoaded ? (
                    <>
                        <header className={styles.modalHeader}>
                            <h2>Report</h2>
                            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>X</button>
                        </header>
                        <main className={styles.modalBody}>
                            <StyledTable>
                                <thead>
                                    <tr>
                                        {Object.keys(fileContent[0] || {}).map((key) => (
                                            <th key={key}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {fileContent.map((data, index) => (
                                        <tr key={index}>
                                            {Object.entries(data).map(([key, value]) => (
                                                <td key={key}>{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </StyledTable>
                        </main>
                        <footer className={styles.modalFooter}>
                            <a download href={link} className={styles.saveButton}>Download</a>
                        </footer>
                    </>
                ) : (
                    <div className={styles.loadingContainer}>
                        <header className={styles.modalHeader}>
                            <h2>Report</h2>
                        </header>
                        <div className={styles.loading}>
                            <CircularProgress />
                            <p>Generating Report...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ReportView;
