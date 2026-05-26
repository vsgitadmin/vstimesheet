import React, { useRef, useState } from 'react'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { general } from "../../../Helpers/index"

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
    <tr className={point == "Total" && 'total_row'}>
      <th>
        {point !== "Total" &&
          <div style={{ display: "flex" }}>
            {!edit ?
              <div onClick={() => remove(id)}>
                <HighlightOffRoundedIcon />
              </div> :
              <div onClick={updatePoint}>
                <CheckCircleOutlineRoundedIcon />
              </div>
            }
            <div onClick={() => { sessionStorage.setItem("cach_value", JSON.stringify(data)); setedit((e) => !e) }}>
              <BorderColorRoundedIcon />
            </div>
          </div>
        }
        {point == "Total" && <div onClick={() => remove(id)}>
          <HighlightOffRoundedIcon />
        </div>}


      </th>
      <th>{edit ? <input type="text" placeholder='point name' name='point' onChange={updateInputValue} defaultValue={point} /> : point}</th>
      <th>{edit ? <input type="number" placeholder='hours worked' name='hours' onChange={updateInputValue} defaultValue={hours} /> : hours}</th>
      <th>{edit ? <input type="number" value={16} /> : cost}</th>
      <th>{edit ? <input type="number" placeholder='cost' name='total_cost' onChange={updateInputValue} value={TotalCost} /> : total_cost}</th>
      <th>{edit ? <input type="number" placeholder='0' name='bid' onChange={updateInputValue} defaultValue={bid} /> : bid}</th>
      <th>{edit ? <input type="number" placeholder='0' name='bid_hour' onChange={updateInputValue} value={bidCost} /> : bid_hour}</th>
      <th>{edit ? <input type="number" placeholder='0' name='eng_fee' onChange={updateInputValue} value={eng_fee} /> : eng_fee}</th>
      <th>{percent}</th>
    </tr>
  )
}

export default DisplayPoints