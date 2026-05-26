import React, { useState, useEffect } from 'react'
import AddPoints from './AddPoints/index'
import DisplayPoints from './displayPoints/displayPoints';
import { general } from "../../Helpers/Extractor/Extractor"
import nextId from "react-id-generator";
import { toast } from 'react-toastify';

function JobCustomizer({ setJobs, defaultData, setTotal }) {
  const [items, setitems] = useState([]);
  const [parentTotal, setparentTotal] = useState({});
  const { sumOfArrayObjects, substractTwoObjects, sumTwoObjects } = general;
  const [saveTable, setsaveTable] = useState(false);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length > 0 && Loading) {
      countParentTotal()
      setLoading(false)
    }
  }, [Loading])


  useEffect(() => {
    if (defaultData) setitems(defaultData)
  }, [defaultData])

  useEffect(() => {
    if (items.length > 0) {
      countParentTotal()
    }
    setJobs(items);
  }, [items])

  const countParentTotal = () => {
    let sum;
    const keys = ["hours", "total_cost", "bid", "bid_hour", "eng_fee","percent"]
    const filteredData = items.filter((data) => data.point !== "Total")
    sum = sumOfArrayObjects(filteredData, keys)
    // const percent = (sum.bid / sum.hours) / 16 * 100
    // sum.percent = Number(percent.toString().slice(0, 4))
    sum.bid_hour = Number(sum.bid) / Number(sum.hours)
    sum.cost = 16;
    setTotal(sum)
    setparentTotal(sum)
  }


  const addNewPoint = (object) => {
    const percent = (object.bid / object.hours)
    object.percent = Number(percent.toString().slice(0, 4))
    setitems([...items, object]);
    setsaveTable(true)
  }

  const updatePoint = (index, object, prev) => {
    items[index] = object
    const totalPositions = items.map((data, index) => {
      if (data.point == "Total") return index
      else return null
    })
    if (index == 0) {
      const latestTotal = totalPositions.at(-1)
      const newTotal = addTotalBreakPoints(latestTotal, false);
      const replacedArr = items;
      replacedArr[latestTotal] = newTotal;
      setitems(replacedArr);
      setLoading(true);
    } else {
      const replacedArr = items;
      const latestTotal = totalPositions.filter((position) => { if (position !== null && position > index) return index }).at(-1)
      if (latestTotal) {
        const newTotal = addTotalBreakPoints(latestTotal, false);
        newTotal.bid_hour = newTotal.bid_hour.toFixed(2)
        replacedArr[latestTotal] = newTotal;
      }
      setitems(replacedArr);
      setLoading(true);
    }
    setsaveTable(true)
  }

  const removePoint = (key) => {
    let latestTotal = null;
    const objIndex = items.findIndex(object => {
      return object.id === key;
    });
    let filteredItem = items.filter(({ id }) => ![key].includes(id));
    const selectedItem = items.filter(({ id }) => id == key)[0];
    const totalPositions = items.forEach(({ point }, index) => {
      if (point == "Total" && index > objIndex) {
        latestTotal = index;
      }
    })
    if (latestTotal) {
      let totalValue = items[latestTotal];
      let newTotal = substractTwoObjects(totalValue, selectedItem, ["hours", "total_cost", "bid", "bid_hour", "eng_fee"]);
      newTotal.point = "Total";
      newTotal.cost = 16;
      newTotal.bid_hour = newTotal.bid_hour.toString().slice(0, 4);
      newTotal.percent = (newTotal.bid / newTotal.hours) / newTotal.cost * 100;
      filteredItem[latestTotal - 1] = newTotal;
    }
    setitems(filteredItem);
    setsaveTable(true)
  }

  const addTotalBreakPoints = (index, type) => {
    const keys = ["hours", "total_cost", "bid", "bid_hour", "eng_fee" , "percent"]
    let sum;
    if (index == 1) sum = sumOfArrayObjects(items, keys)
    else {
      const totalPositions = items.map(({ point }, index) => { if (point == "Total") return index })
      if (totalPositions.length == 0) sum = sumOfArrayObjects(subPoints, keys)
      else {
        const latestTotal = totalPositions.filter((position) => position < index).at(-1)
        const subPoints = items.slice(latestTotal + 1, index)
        sum = sumOfArrayObjects(subPoints, keys)
      }
    }
    sum.point = "Total"
    sum.cost = 16
    sum.id = nextId()
    if (type) addNewPoint(sum)
    else return sum
  }

  const itemMaper = items.map((data, index) => <DisplayPoints key={index} data={data} index={index} remove={removePoint} update={updatePoint} />)

  if (Loading) return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  else
    return (
      <div className="job_customizer" key={items}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>point</th>
              <th>Hours</th>
              <th>$ PH</th>
              <th>Cost</th>
              <th>Bid Price</th>
              <th>Per Hour</th>
              <th>Eng Fee</th>
              <th>Bid %</th>
            </tr>
          </thead>
          <tbody>
            {itemMaper}
            <AddPoints currentItems={items} setTotalBreakPoints={(data) => addTotalBreakPoints(data, true)} length={items.length} addNewPoint={addNewPoint} />
            {items.length > 0 &&
              <tr className={'total_row'}>
                <th>
                </th>
                <th>Main Total</th>
                <th>{parentTotal.hours}</th>
                <th>{parentTotal.cost}</th>
                <th>{parentTotal.total_cost}</th>
                <th>{parentTotal.bid}</th>
                <th>{typeof parentTotal.bid_hour === 'number' ? parentTotal.bid_hour.toFixed(2) : ''}</th>
                <th>{parentTotal.eng_fee}</th>
                <th>{parentTotal.percent}</th>
              </tr>
            }
          </tbody>


        </table>
      </div>
    )
}

export default JobCustomizer
