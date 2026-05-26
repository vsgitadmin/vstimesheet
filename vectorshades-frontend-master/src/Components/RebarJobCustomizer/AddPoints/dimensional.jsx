import React, { useState, useEffect } from 'react'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import { general } from "../../../Helpers/index"
import nextId from "react-id-generator";
import rebarScopes from '../../../Constants/rebarScopes';

function AddPointsDimensional({ addNewPoint, length, setTotalBreakPoints, currentItems }) {
    const [create, setcreate] = useState(false)
    const { modifyObjectKeys } = general
    const [objectValue, setobjectValue] = useState({ cost: 16 });
    const [Cost, setCost] = useState(0)
    const [bidPrice, setBidPrice] = useState(0)
    const [bidPercent, setbidPercent] = useState(0)
    
    const updateInputValue = (e) => {
        const object = modifyObjectKeys(objectValue, e.target.name, e.target.value)
        switch (e.target.name) {
            case "costPH":
                object.cost = object.estimatedHours * objectValue.costPH;
                object.bidPrice = object.estimatedHours * objectValue.PH;
                object.bidPercentage = (object.bidPrice / object.cost) - 1
                setCost(object.estimatedHours * objectValue.costPH)
                setBidPrice(object.estimatedHours * objectValue.PH)
                setbidPercent((object.bidPrice / object.cost) - 1)
                break;
        }
        setobjectValue(object)
    }

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
            'PH',
            'costPH',
            'cost',
            'bidPrice',
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
                        {length !== 0 && <div onClick={() => setTotalBreakPoints(length)}><CurrencyExchangeRoundedIcon /></div>}
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
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" placeholder='0' name='PH' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" placeholder='0' name='costPH' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" value={Cost} placeholder='0' name='cost' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" value={bidPrice} placeholder='0' name='bidPrice' onChange={updateInputValue} /></th>
            <th><input defaultValue={0} className='rebar_customizer_input' type="number" value={bidPercent} placeholder='0' name='bidPercentage' onChange={updateInputValue} /></th>
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

export default AddPointsDimensional