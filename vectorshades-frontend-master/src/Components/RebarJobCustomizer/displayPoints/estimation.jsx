import React, { useRef, useState } from 'react'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { general } from "../../../Helpers/index"
import rebarScopes from '../../../Constants/rebarScopes';

function DisplayPointsEstimation({ data: { scope, estimatedHours, estimatedTons, tonPH,id, perTon, costPH, cost, bidPrice, pricePH, bidPercentage, complexity }, data, update, index, remove }) {
    const [edit, setedit] = useState(false)
    const [objectValue, setobjectValue] = useState(data)
    const { modifyObjectKeys } = general
    const cacheData = useRef(null)

    const updateInputValue = (e) => {
        const object = modifyObjectKeys(objectValue, e.target.name, e.target.value)
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
                        </div> :
                        <div onClick={updatePoint}>
                            <CheckCircleOutlineRoundedIcon />
                        </div>
                    } */}
                                            <div onClick={updatePoint}>
                            <CheckCircleOutlineRoundedIcon />
                        </div>
                    <div onClick={() => { sessionStorage.setItem("cach_value", JSON.stringify(data)); setedit((e) => !e) }}>
                        <BorderColorRoundedIcon />
                    </div>
                </div>
            </th>
            <th>{edit ?
                <select className='rebar_customizer_select' name='scope' defaultValue={scope} onChange={updateInputValue}>
                    <option hidden>select scope</option>
                    {rebarScopes.map((val) => <option value={val}>{val}</option>)}
                </select>
                : scope}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='estimated Hours' name='estimatedHours' onChange={updateInputValue} defaultValue={estimatedHours} /> : estimatedHours}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='estimated Tons' name='estimatedTons' onChange={updateInputValue} value={estimatedTons} /> : estimatedTons}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='ton per hour' name='tonPH' onChange={updateInputValue} defaultValue={tonPH} /> : tonPH}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='per ton' name='perTon' onChange={updateInputValue} defaultValue={perTon} /> : perTon}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='cost per hour' name='costPH' onChange={updateInputValue} defaultValue={costPH} /> : costPH}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='cost' name='cost' onChange={updateInputValue} value={cost} /> : cost}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='bid price' name='bidPrice' onChange={updateInputValue} defaultValue={bidPrice} /> : bidPrice}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='price per hour' name='pricePH' onChange={updateInputValue} defaultValue={pricePH} /> : pricePH}</th>
            <th>{edit ? <input className='rebar_customizer_input' type="number" placeholder='bid percentage' name='bidPercentage' onChange={updateInputValue} defaultValue={bidPercentage} /> : bidPercentage}</th>
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

export default DisplayPointsEstimation