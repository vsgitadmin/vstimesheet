import { Close } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import styles from "../../../styles/Filters.module.css";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRebarClients } from "../../Constants/rebarClients";

const RebarAwardJobsFilter = ({ setIsFilterOpen, render, onChange, children }) => {
  const [value, setValue] = useState([20, 80]);
  const [FilterObject, setFilterObject] = useState({});
  const [selectionObject, setselectionObject] = useState([]);
  const [ClientSelectionObject, setClientSelectionObject] = useState([]);
  const { clients: RebarClients } = useRebarClients();

  const location = ['kochi', 'chennai'];

  const clearFilter = () => {
    setFilterObject({});
    setselectionObject([]);
    setClientSelectionObject([]);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    setFilterObject((prev) => {
      const newFilter = { ...prev };
      if (ClientSelectionObject.length === 0) {
        delete newFilter.client;
      } else {
        newFilter.client = ClientSelectionObject;
      }
      return newFilter;
    });
  }, [ClientSelectionObject]);

  useEffect(() => {
    setFilterObject((prev) => {
      const newFilter = { ...prev };
      if (selectionObject.length === 0) {
        delete newFilter.location;
      } else {
        newFilter.location = selectionObject;
      }
      return newFilter;
    });
  }, [selectionObject]);

  useEffect(() => {
    if (onChange) onChange(FilterObject);
  }, [FilterObject]);

  const handleInputChange = (key, value) => {
    setFilterObject((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={onChange ? styles.report_container : styles.awrd_container}>
      <div className={styles.flt_title}>
        <h4>Filters</h4>
        {!onChange && <Close onClick={() => setIsFilterOpen(false)} style={{ cursor: "pointer" }} />}
      </div>
      <Divider />

      {/* Date Range Filter */}
      <div className={styles.price_range}>
        <h4>Start Date</h4>
        <p>Get the Job where start date is in the range</p>
      </div>
      <div className={styles.price_range_box}>
        <div>
          <label>Start Date</label>
          <input type="date" onChange={(e) => handleInputChange('start', e.target.value)} />
        </div>
        <div>
          <label>End Date</label>
          <input type="date" onChange={(e) => handleInputChange('end', e.target.value)} />
        </div>
      </div>

      {/* Tonnage Filter */}
      <div className={styles.price_range}>
        <h4>Tonnage</h4>
        <p>Get the Job where Tonnage is in the range</p>
      </div>
      <div className={styles.price_range_box}>
        <div>
          <label>Min</label>
          <input type="number" defaultValue={0} onChange={(e) => handleInputChange('tonnageStart', e.target.value)} />
        </div>
        <div>
          <label>Max</label>
          <input type="number" defaultValue={0} onChange={(e) => handleInputChange('tonnageEnd', e.target.value)} />
        </div>
      </div>

      {/* Location and Client Options */}
      <div className={styles.rooms}>
        <h4>Options</h4>
        <div className={styles.rooms_option}>
          {/* Location Filter */}
          <h5>Location</h5>
          <div className={styles.options}>
            {location.map((item) => {
              const selected = selectionObject.includes(item);
              const selectedStyle = {
                backgroundColor: 'black',
                color: 'white'
              };
              return (
                <div
                  key={item}
                  style={selected ? selectedStyle : {}}
                  onClick={() => {
                    if (selected) {
                      setselectionObject((prev) => prev.filter((e) => e !== item));
                    } else {
                      setselectionObject((prev) => [...prev, item]);
                    }
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>

          {/* Clients Filter */}
          <br />
          <h5>
            Clients{" "}
            <DoneAllIcon
              onClick={() => setClientSelectionObject(Object.keys(RebarClients))}
              style={{ fill: '#e64848', cursor: 'pointer' }}
            />
          </h5>
          <div className={styles.options}>
            {Object.keys(RebarClients).map((item) => {
              const selected = ClientSelectionObject.includes(item);
              const selectedStyle = {
                backgroundColor: 'black',
                color: 'white'
              };
              return (
                <div
                  key={item}
                  style={selected ? selectedStyle : {}}
                  onClick={() => {
                    if (selected) {
                      setClientSelectionObject((prev) => prev.filter((e) => e !== item));
                    } else {
                      setClientSelectionObject((prev) => [...prev, item]);
                    }
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {children}
      <Divider />
      {!onChange && (
        <div className={styles.clear_flt}>
          <button onClick={clearFilter}>Clear all</button>
          <button onClick={() => render(FilterObject)}>FILTER</button>
        </div>
      )}
    </div>
  );
};

export default RebarAwardJobsFilter;
