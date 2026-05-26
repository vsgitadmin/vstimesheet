import React, { useState, useEffect } from 'react'
import { general } from "../../Helpers/Extractor/Extractor"
import nextId from "react-id-generator";
import { toast } from 'react-toastify';
import HeadMapperRebar from './ConditionalMapper/head';
import AddPointsDimensional from './AddPoints/dimensional';
import AddPointsEstimation from './AddPoints/estimation';
import AddPointsDetailing from './AddPoints/detailing';
import DisplayPointsDetailing from './displayPoints/detailing';
import DisplayPointsEstimation from './displayPoints/estimation';
import DisplayPointsDimensional from './displayPoints/dimensional';
import TotalMapper from './ConditionalMapper/total';

function RebarJobCustomizer({ setJobs, defaultData, setTotal , type }) {
  const [items, setitems] = useState([]);
  const [parentTotal, setparentTotal] = useState({});
  const { sumOfArrayObjects, substractTwoObjects, sumTwoObjects } = general;
  const [saveTable, setsaveTable] = useState(false);
  const [Loading, setLoading] = useState(false);

  const rebarKeys = {
    'Detailing': ['estimatedHours', 'estimatedTons', 'tonPH', 'perTon', 'costPH', 'cost', 'bidPrice', 'pricePH', 'bidPercentage'],
    'Estimation': ['estimatedHours', 'estimatedTons', 'tonPH', 'perTon', 'costPH', 'cost', 'bidPrice', 'pricePH', 'bidPercentage'],
    'Dimensional Drawing': ['estimatedHours', 'estimatedTons', 'tonPH', 'perTon', 'costPH', 'cost', 'bidPrice', 'pricePH', 'bidPercentage']
  }

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
    const keys = rebarKeys[type]
    const filteredData = items.filter((data) => data.point !== "Total")
    sum = sumOfArrayObjects(filteredData, keys)
    const percent = (sum.bid / sum.hours) / 16 * 100
    setTotal(sum)
    setparentTotal(sum)
  }


  const addNewPoint = (object) => {
    setitems([...items, object]);
    setsaveTable(true)
  }

  const updatePoint = (index, object, prev) => {
    setLoading(true)
    items[index] = object
    setitems(items)
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
      let newTotal = substractTwoObjects(totalValue, selectedItem, rebarKeys[type]);
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
    const keys = rebarKeys[type]
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

  const addMapper = {
    'Detailing': <AddPointsDetailing currentItems={items} setTotalBreakPoints={(data) => addTotalBreakPoints(data, true)} length={items.length} addNewPoint={addNewPoint} />,
    'Estimation': <AddPointsEstimation currentItems={items} setTotalBreakPoints={(data) => addTotalBreakPoints(data, true)} length={items.length} addNewPoint={addNewPoint} />,
    'Dimensional Drawing': <AddPointsEstimation currentItems={items} setTotalBreakPoints={(data) => addTotalBreakPoints(data, true)} length={items.length} addNewPoint={addNewPoint} />
  }

  const itemMaper = items.map((data, index) => {
      const displayMapper = {
        'Detailing': <DisplayPointsDetailing key={data} data={data} index={index} remove={removePoint} update={updatePoint} />,
        'Estimation': <DisplayPointsEstimation key={data} data={data} index={index} remove={removePoint} update={updatePoint} />,
        'Dimensional Drawing':  <DisplayPointsEstimation key={data} data={data} index={index} remove={removePoint} update={updatePoint} />
      }
      return displayMapper[type]
  })

  if (Loading) return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  else
    return (
      <div className="job_customizer rebar_customizer" key={items}>
        <table>
          <thead>
            <tr>
              <HeadMapperRebar type={type}/>
            </tr>
          </thead>
          <tbody>
            {itemMaper}
            {items.length < 2 && addMapper[type] }
            {items.length > 0 && <TotalMapper parentTotal={parentTotal} type={type}/>}
          </tbody>
        </table>
      </div>
    )
}

export default RebarJobCustomizer
