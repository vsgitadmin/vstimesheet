import React, { useState, useEffect } from 'react'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import { general } from "../../../Helpers/index"
import nextId from "react-id-generator";
import rebarScopes from '../../../Constants/rebarScopes';

function AddPointsDetailing({ addNewPoint, length, setTotalBreakPoints, currentItems }) {
    const [create, setcreate] = useState(false)
    const { modifyObjectKeys } = general
    const [objectValue, setobjectValue] = useState({ cost: 16 });
    const [tonPH, setTonPH] = useState(0)
    const [Cost, setCost] = useState(0)
    const [bidPrice, setBidPrice] = useState(0)
    const [pricePerHour, setpricePerHour] = useState(0)
    const [bidPercent, setbidPercent] = useState(0)

    const toFloat2 = (num) => parseFloat(parseFloat(num).toFixed(2));

    const updateInputValue = (e) => {
        const { name, value } = e.target;
        const updatedValue = toFloat2(value);
        const updatedObject = modifyObjectKeys(objectValue, name, updatedValue);

        switch (name) {
            case "estimatedTons":
                updatedObject.tonPH = toFloat2(updatedValue / objectValue.estimatedHours);
                setTonPH(updatedObject.tonPH);
                break;

            case "costPH":
                updatedObject.cost = toFloat2(objectValue.estimatedHours * updatedValue);
                updatedObject.bidPrice = toFloat2(objectValue.estimatedTons * objectValue.perTon);
                updatedObject.bidPercentage = toFloat2(((updatedObject.bidPrice / updatedObject.cost) - 1) * 100);
                updatedObject.pricePH = toFloat2(updatedObject.bidPrice / objectValue.estimatedHours);

                setCost(updatedObject.cost);
                setBidPrice(updatedObject.bidPrice);
                setbidPercent(updatedObject.bidPercentage);
                setpricePerHour(updatedObject.pricePH);
                break;

            case "perTon":
                updatedObject.bidPrice = toFloat2(objectValue.estimatedTons * updatedValue);
                updatedObject.bidPercentage = toFloat2(((updatedObject.bidPrice / objectValue.cost) - 1) * 100);
                updatedObject.pricePH = toFloat2(updatedObject.bidPrice / objectValue.estimatedHours);

                setBidPrice(updatedObject.bidPrice);
                setbidPercent(updatedObject.bidPercentage);
                setpricePerHour(updatedObject.pricePH);
                break;
        }

        setobjectValue(updatedObject);
    };

    // const updateInputValue = (e) => {
    //     const object = modifyObjectKeys(objectValue, e.target.name, e.target.value)
    //     switch (e.target.name) {
    //         case "estimatedTons":
    //             object.tonPH = object.estimatedTons / objectValue.estimatedHours;
    //             setTonPH(object.estimatedTons / objectValue.estimatedHours)
    //             break;
    //         case "costPH":
    //             object.cost = object.estimatedHours * objectValue.costPH;
    //             object.bidPrice = object.estimatedTons * objectValue.perTon;
    //             object.bidPercentage = (object.bidPrice / object.cost) - 1
    //             object.pricePH = object.bidPrice / object.estimatedHours;
    //             setpricePerHour(object.bidPrice / object.estimatedHours)
    //             setBidPrice(object.estimatedTons * objectValue.perTon)
    //             setCost(object.estimatedHours * objectValue.costPH)
    //             setbidPercent((object.bidPrice / object.cost) - 1)
    //             break;
    //         case "perTon":
    //             object.bidPrice = object.estimatedTons * objectValue.perTon;
    //             object.bidPercentage = (object.bidPrice / object.cost) - 1
    //             object.pricePH = object.bidPrice / object.estimatedHours;
    //             setpricePerHour(object.bidPrice / object.estimatedHours)
    //             setbidPercent((object.bidPrice / object.cost) - 1)
    //             setBidPrice(object.estimatedTons * objectValue.perTon)
    //             break;
    //     }
    //     setobjectValue(object)
    // }

    const addNewPointFunction = () => {
        const newObj = { ...objectValue, id: nextId() }
        Object.keys(newObj).forEach((data) => {
            const value = newObj[data]
            var isNumber = /^\d+\.\d+$/.test(value);
            if (isNumber) newObj[data] = Number(value.toString().slice(0, 4))
        })
        const defaultKeys = [
            'scope',
            'estimatedHours',
            'estimatedTons',
            'tonPH',
            'perTon',
            'costPH',
            'cost',
            'bidPrice',
            'pricePH',
            'bidPercentage',
            'complexity'
        ];
        defaultKeys.forEach((key) => {
            if (!(key in newObj)) {
                newObj[key] = 0;
            }
        });
        addNewPoint(newObj);
        setcreate(false);
    }

    return (
        <tr style={{ visibility: !create ? "hidden" : "visible" }} key={create}>
            <th>
                {!create &&
                    <div style={{ visibility: "visible", display: "flex" }}>
                        <div onClick={() => setcreate(true)}><AddCircleOutlineRoundedIcon /></div>
                        {/* {length !== 0 && <div onClick={() => setTotalBreakPoints(length)}><CurrencyExchangeRoundedIcon /></div>} */}
                    </div>
                }
                <div style={{ display: "flex" }}>
                    <div onClick={() => setcreate(false)}><RemoveCircleOutlineRoundedIcon /></div>
                    <div onClick={addNewPointFunction}><CheckCircleOutlineRoundedIcon /></div>
                </div>
            </th>
            <th>
                <select className='rebar_customizer_select' name='scope' onChange={updateInputValue}>
                    <option hidden>select scope</option>
                    {rebarScopes.map((val) => <option value={val}>{val}</option>)}
                </select>
            </th>
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" placeholder='0' name='estimatedHours' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" placeholder='0' name='estimatedTons' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' value={tonPH} key={tonPH} type="number" placeholder='0' name='tonPH' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" placeholder='0' name='perTon' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" placeholder='0' name='costPH' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' value={Cost} type="number" placeholder='0' name='cost' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' value={bidPrice} type="number" placeholder='0' name='bidPrice' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' value={pricePerHour} type="number" placeholder='0' name='pricePH' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' value={bidPercent} type="number" placeholder='0' name='bidPercentage' onChange={updateInputValue} /></th>
            <th>
                <select className='rebar_customizer_select' name='complexity' onChange={updateInputValue}>
                    <option hidden>select scope</option>
                    <option value={'Easy'}>Easy</option>
                    <option value={'Medium'}>Medium</option>
                    <option value={'Hard'}>Hard</option>
                </select>
            </th>
            <th></th>
        </tr>
    )
}

export default AddPointsDetailing