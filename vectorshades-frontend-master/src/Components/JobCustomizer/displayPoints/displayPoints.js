import React, { useRef, useState } from 'react'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { general } from "../../../Helpers/index"
import styles from '../JobCustomizer.module.css'

function DisplayPoints({ data: { point, hours, cost, bid_hour, bid, total_cost, id, percent, eng_fee }, data, update, index, remove }) {
  const [edit, setedit] = useState(false)
  const [objectValue, setobjectValue] = useState(data)
  const { modifyObjectKeys } = general
  const [TotalCost, setTotalCost] = useState(total_cost);
  const [bidCost, setbidCost] = useState(bid_hour);
  const cacheData = useRef(null)

  const updateInputValue = (e) => {
    const object = modifyObjectKeys(objectValue, e.target.name, e.target.value)
    switch (e.target.name) {
      case "hours":
        object.total_cost = object.hours * objectValue.cost;
        object.bid_hour = object.bid / object.hours;
        setTotalCost(object.hours * objectValue.cost)
        setbidCost(object.bid / object.hours)
        break;
      case "bid":
        object.bid_hour = object.bid / object.hours;
        setbidCost(object.bid / object.hours)
        break;
    }
    setobjectValue(object)
  }

  const updatePoint = () => { update(index, objectValue, cacheData); setedit(false) }

  return (
    <tr className={`${styles.row} ${point == "Total" ? styles.totalRow : ''}`}>
      <th>
        {point !== "Total" &&
          <div className={styles.rowActions}>
            {!edit ?
              <span className={styles.iconBtn} onClick={() => remove(id)}>
                <HighlightOffRoundedIcon />
              </span> :
              <span className={`${styles.iconBtn} ${styles.iconBtnPositive}`} onClick={updatePoint}>
                <CheckCircleOutlineRoundedIcon />
              </span>
            }
            <span className={styles.iconBtn} onClick={() => { sessionStorage.setItem("cach_value", JSON.stringify(data)); setedit((e) => !e) }}>
              <BorderColorRoundedIcon />
            </span>
          </div>
        }
        {point == "Total" && <span className={styles.iconBtn} onClick={() => remove(id)}>
          <HighlightOffRoundedIcon />
        </span>}


      </th>
      <th>{edit ? <input className={styles.cellInput} type="text" placeholder='point name' name='point' onChange={updateInputValue} defaultValue={point} /> : point}</th>
      <th>{edit ? <input className={styles.cellInput} type="number" placeholder='hours worked' name='hours' onChange={updateInputValue} defaultValue={hours} /> : hours}</th>
      <th>{edit ? <input className={styles.cellInput} type="number" value={16} readOnly /> : cost}</th>
      <th>{edit ? <input className={styles.cellInput} type="number" placeholder='cost' name='total_cost' onChange={updateInputValue} value={TotalCost} readOnly /> : total_cost}</th>
      <th>{edit ? <input className={styles.cellInput} type="number" placeholder='0' name='bid' onChange={updateInputValue} defaultValue={bid} /> : bid}</th>
      <th>{edit ? <input className={styles.cellInput} type="number" placeholder='0' name='bid_hour' onChange={updateInputValue} value={bidCost} readOnly /> : bid_hour}</th>
      <th>{edit ? <input className={styles.cellInput} type="number" placeholder='0' name='eng_fee' onChange={updateInputValue} value={eng_fee} /> : eng_fee}</th>
      <th>{percent}</th>
    </tr>
  )
}

export default DisplayPoints