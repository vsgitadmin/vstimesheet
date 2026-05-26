import React, { useRef, useState } from 'react'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { general } from "../../../Helpers/index"
import rebarScopes from '../../../Constants/rebarScopes';

function DisplayPointsDetailing({ data: { scope, estimatedHours, estimatedTons, tonPH, perTon, costPH, cost, bidPrice, pricePH, bidPercentage, complexity, id }, data, update, index, remove }) {
    const [edit, setedit] = useState(false)
    const [objectValue, setobjectValue] = useState(data)
    const { modifyObjectKeys } = general
    const cacheData = useRef(null)
    const [TonPH, setTonPH] = useState(tonPH)
    const [Cost, setCost] = useState(cost)
    const [BidPrice, setBidPrice] = useState(bidPrice)
    const [pricePerHour, setpricePerHour] = useState(pricePH)
    const [bidPercent, setbidPercent] = useState(bidPercentage)

    const updateInputValue = (e) => {
        const object = modifyObjectKeys(objectValue, e.target.name, e.target.value)
        switch (e.target.name) {
            case "estimatedTons":
                object.tonPH = object.estimatedTons / objectValue.estimatedHours;
                setTonPH(object.estimatedTons / objectValue.estimatedHours)
                break;
            case "costPH":
                object.cost = object.estimatedHours * objectValue.costPH;
                object.bidPrice = object.estimatedTons * objectValue.perTon;
                object.bidPercentage = (object.bidPrice / object.cost) - 1
                object.pricePH = object.bidPrice / object.estimatedHours;
                setpricePerHour(object.bidPrice / object.estimatedHours)
                setBidPrice(object.estimatedTons * objectValue.perTon)
                setCost(object.estimatedHours * objectValue.costPH)
                setbidPercent((object.bidPrice / object.cost) - 1)
                break;
            case "perTon":
                object.bidPrice = object.estimatedTons * objectValue.perTon;
                object.bidPercentage = (object.bidPrice / object.cost) - 1
                object.pricePH = object.bidPrice / object.estimatedHours;
                setpricePerHour(object.bidPrice / object.estimatedHours)
                setbidPercent((object.bidPrice / object.cost) - 1)
                setBidPrice(object.estimatedTons * objectValue.perTon)
                break;
        }
        setobjectValue(object)
    }

    const updatePoint = () => { update(index, objectValue, cacheData); setedit(false) }

    return (
        <tr>
            <th>
                <div style={{ display: "flex" }}>
                    {/* {!edit ?
                    
                        <div onClick={() => remove(id)}>
                            <HighlightOffRoundedIcon />
                        </div> 

                        :
                        <div onClick={updatePoint}>
                            <CheckCircleOutlineRoundedIcon />
                        </div>
                    } */}
                    <div onClick={updatePoint}>
                        <CheckCircleOutlineRoundedIcon />
                    </div>
                    {/* <div onClick={() => { sessionStorage.setItem("cach_value", JSON.stringify(data)); setedit((e) => !e) }}>
                        <BorderColorRoundedIcon />
                    </div> */}
                </div>
            </th>
            <th>{edit ?
                <select className='rebar_customizer_select' name='scope' defaultValue={scope} onChange={updateInputValue}>
                    <option hidden>select scope</option>
                    {rebarScopes.map((val) => <option value={val}>{val}</option>)}
                </select>
                : scope}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='estimated Hours' name='estimatedHours' onChange={updateInputValue} defaultValue={estimatedHours} /> : estimatedHours}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder={estimatedTons} name='estimatedTons' onChange={updateInputValue} defaultvalue={estimatedTons} /> : estimatedTons}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='ton per hour' name='tonPH' onChange={updateInputValue} defaultValue={TonPH} /> : TonPH}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='per ton' name='perTon' onChange={updateInputValue} defaultValue={perTon} /> : perTon}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='cost per hour' name='costPH' onChange={updateInputValue} defaultValue={costPH} /> : costPH}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='cost' name='cost' onChange={updateInputValue} value={Cost} /> : Cost}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='bid price' name='bidPrice' onChange={updateInputValue} defaultValue={BidPrice} /> : BidPrice}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='price per hour' name='pricePH' onChange={updateInputValue} defaultValue={pricePerHour} /> : pricePerHour}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='bid percentage' name='bidPercentage' onChange={updateInputValue} defaultValue={bidPercent} /> : bidPercent}</th>
            <th>{edit ?
                <select className='rebar_customizer_select' name='complexity' defaultValue={complexity} onChange={updateInputValue}>
                    <option hidden>select scope</option>
                    <option value={'Easy'}>Easy</option>
                    <option value={'Medium'}>Medium</option>
                    <option value={'Hard'}>Hard</option>
                </select>
                : complexity}</th>
        </tr>
    )
}

export default DisplayPointsDetailing