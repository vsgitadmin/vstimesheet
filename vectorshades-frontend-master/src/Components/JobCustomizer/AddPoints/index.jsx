import React, { useState, useEffect } from 'react'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import { general } from "../../../Helpers/index"
import nextId from "react-id-generator";
import styles from '../JobCustomizer.module.css'

function AddPoints({ addNewPoint, length, setTotalBreakPoints, currentItems }) {
    const [create, setcreate] = useState(false)
    const { modifyObjectKeys } = general
    const [objectValue, setobjectValue] = useState({ cost: 16 });
    const [defaultPointName, setdefaultPointName] = useState(null)
    const [TotalCost, setTotalCost] = useState(0);
    const [bidCost, setbidCost] = useState(0);

    useEffect(() => {
        let defaultNameVar;
        if (currentItems.length === 0) defaultNameVar = 'main'
        else if (currentItems.length === 1) defaultNameVar = 'misc'
        setdefaultPointName(defaultNameVar)
        objectValue.point = defaultNameVar
    }, [])


    const updateInputValue = (e) => {
        const object = modifyObjectKeys(objectValue, e.target.name, e.target.value)
        switch (e.target.name) {
            case "hours":
                object.total_cost = object.hours * objectValue.cost;
                setTotalCost(object.hours * objectValue.cost)
                break;
            case "bid":
                object.bid_hour = (object.bid / object.hours);
                setbidCost(object.bid / object.hours)
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
        const defaultKeys = ["cost", "point", "hours", "total_cost", "bid", "bid_hour", "eng_fee"];
        defaultKeys.forEach((key) => {
            if (!(key in newObj)) {
                newObj[key] = 0;
            }
        });
        addNewPoint(newObj);
        setcreate(false);
    }

    if (!create) return (
        <tr className={styles.row}>
            <td colSpan={9} className={styles.addRowCell}>
                <span className={styles.addRowTrigger} onClick={() => setcreate(true)}><AddCircleOutlineRoundedIcon />Add Row</span>
                {length !== 0 &&
                    <span className={styles.addRowTrigger} onClick={() => setTotalBreakPoints(length)}><CurrencyExchangeRoundedIcon />Add Checkpoint Total</span>}
            </td>
        </tr>
    )

    return (
        <tr className={styles.row}>
            <th>
                <div className={styles.rowActions}>
                    <span className={styles.iconBtn} onClick={() => setcreate(false)}><RemoveCircleOutlineRoundedIcon /></span>
                    <span className={`${styles.iconBtn} ${styles.iconBtnPositive}`} onClick={addNewPointFunction}><CheckCircleOutlineRoundedIcon /></span>
                </div>
            </th>
            <th><input className={styles.cellInput} type="text" placeholder='point name' defaultValue={defaultPointName} name='point' onChange={updateInputValue} /></th>
            <th><input className={styles.cellInput} type="number" placeholder='hours worked' name='hours' onChange={updateInputValue} /></th>
            <th><input className={styles.cellInput} type="number" value={objectValue.cost} readOnly /></th>
            <th><input className={styles.cellInput} type="number" placeholder='cost' name='total_cost' value={TotalCost} readOnly /></th>
            <th><input className={styles.cellInput} type="number" placeholder='0' name='bid' onChange={updateInputValue} /></th>
            <th><input className={styles.cellInput} type="number" placeholder='0' name='bid_hour' value={bidCost} readOnly /></th>
            <th><input className={styles.cellInput} type="number" placeholder='0' defaultValue={0} name='eng_fee' onChange={updateInputValue} /></th>
            <th></th>
        </tr>
    )


}

export default AddPoints