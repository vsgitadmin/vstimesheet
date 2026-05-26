import { useState } from 'react';
import { Modal } from '@mui/material';
import styles from './Popup.module.css';

const PresetsPopup = ({ open, setOpen, createReport, clientList }) => {
  const [data, setData] = useState({});
  const [selectedClient, setSelectedClient] = useState("");
  const [yearRange, setYearRange] = useState(2024);
  const currentYear = new Date().getFullYear();

  const handleClose = () => setOpen(false);

  const createReportFunction = (e) => {
    e.preventDefault();
    const body = { ...data };
    createReport(body);
  };

  const handleYearChange = (year) => {
    setYearRange(year);
    setData((prevData) => ({ ...prevData, year }));
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <form onSubmit={createReportFunction} className={styles.create_report_popup}>
          <div className={styles.cr_title}>
            <h2>Presets</h2>
            <div style={{cursor:'pointer'}} onClick={handleClose}>
              X
            </div>
          </div>

          {/* Location Based Section */}
          <div className={styles.cr_section}>
            <h3>Location Based</h3>
            <div className={styles.gap8}>
              <button type="button" className={styles.button} onClick={() => setData({ ...data, location: 'Chennai' })}>Chennai Report</button>
              <button type="button" className={styles.button} onClick={() => setData({ ...data, location: 'Kochi' })}>Kochi Report</button>
            </div>
          </div>

          {/* Client Based Section */}
          <div className={styles.cr_section}>
            <h3>Client Based</h3>
            <div className={styles.cr_basic_detail}>
              <select name="client" value={selectedClient} onChange={(e) => {
                setSelectedClient(e.target.value);
                setData({ ...data, client: e.target.value });
              }}>
                <option hidden>Select Client</option>
                {clientList.map((client, index) => (
                  <option key={index} value={client}>{client}</option>
                ))}
              </select>
              {/* Download Button - Appears Only When Client Is Selected */}
              {selectedClient && (
                <button type="button" className={styles.button} onClick={() => console.log(`Download report for ${selectedClient}`)}>
                  Download Report
                </button>
              )}
            </div>
          </div>

          {/* Year Report Section */}
          <div className={styles.cr_section}>
            <h3>Year Report</h3>
            <div className={styles.cr_buttons}>
              {Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
                <button key={year} className={styles.button} type="button" onClick={() => handleYearChange(year)}>
                  {year} Report
                </button>
              ))}
            </div>
          </div>

          {/* General Section */}
          <div className={styles.cr_section}>
            <h3>General</h3>
            <button type="button" className={styles.button} onClick={() => setData({ ...data, reportType: 'perHeadBilling' })}>
              Per Head Billing
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PresetsPopup;
