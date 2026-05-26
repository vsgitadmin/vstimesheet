import { Close } from "@mui/icons-material";
import { Divider, Slider } from "@mui/material";
import { useState } from "react";
import styles from "../../../styles/Filters.module.css";

const CreateReportFilter = () => {
  const [value, setValue] = useState([20, 80]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <>
      <div className={styles.crf_container}  >
        <div className={styles.price_range} >
          <h4>Price Range</h4>
          <p>The average nightly price is $180</p>
        </div>
        <Slider  value={value} onChange={handleChange} min={0} max={100} valueLabelDisplay="auto" aria-label="Custom color"
           sx={{
            '& .MuiSlider-track': {
             bgcolor: '#E64848',
             border: 'none'
             },
            '& .MuiSlider-thumb': {
             bgcolor: '#E64848',
           },}}/>
           <div className={styles.price_range_box}>
            <div>
              <label>Min Price</label>
              <input type="text" defaultValue='$60' />
            </div>
            <div>
              <label>Max Price</label>
              <input type="text" defaultValue='$360' />
            </div>
           </div>
           <div className={styles.type_of_places}>
            <div className={styles.type_of_place} >
            <div>
              <h4>Entire place</h4>
              <p>A place all to yourself</p>
            </div>
            <div>
              <h4>Private place</h4>
              <p>Your own room in a home</p>
            </div>
            </div>
           </div>
           <div className={styles.rooms}>
            <h4>Rooms and Beds</h4>
            <div className={styles.rooms_option} >
              <h5>Bedrooms</h5>
              <div className={styles.options} >
                <div>Any</div>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
              </div>
            </div>
           </div>
           <Divider/>
           <div className={styles.clear_flt} >
            <button>Clear all</button>
            <button>Show 165  homes</button>
           </div>
      </div>
    </>
  );
};

export default CreateReportFilter;
