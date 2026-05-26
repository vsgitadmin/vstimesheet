import { Close } from '@mui/icons-material';
import { FormControl, MenuItem, Select, Modal, Avatar } from '@mui/material';
import React, { useState , useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler';
import { toast } from 'react-toastify';
import { selectEmployeesController } from '../../../../Controllers/Filters/index'
import ProfileImage from '../../../ProfileImage/Image'

function AwardJobPopup({ closePopup, setData }) {
    const [awardDetail, setawardDetail] = useState({});
    const [OFAFORMULA, setOFAFORMULA] = useState('');
    const [FABFORMULA, setFABFORMULA] = useState('');
    const [type, settype] = useState('OFA')
    const [isDropDownOpen, setIsDropdownOpen] = useState(false)
    const [Users, setUsers] = useState([])
    const [isUserSelected, setIsUserSelected] = useState(false)
    const [formulaTested, setformulaTested] = useState(false)

    // useEffect(() => {
    //   if(isDropDownOpen){
    //     selectEmployeesController({search:''}).then((data) => {
    //         setUsers(data.data.response.employee)
    //     }).catch((error) => {
    //         toast.error('error occured')
    //     })
    //   }
    // }, [isDropDownOpen])

    const searchEmployee = async (search) => {
        try {
            const emp = await selectEmployeesController({ search: search.target.value });
            setIsDropdownOpen(true)
            setUsers(emp.data.response.employee)
            return emp
        } catch (err) { throw err }
    }

    useEffect(() => {
        setformulaTested(false)
    }, [OFAFORMULA,FABFORMULA])
    


    const addFormulaVariable = (value) => type == 'OFA' ? setOFAFORMULA(OFAFORMULA + value) : setFABFORMULA(FABFORMULA + value)

    const formulaObjects = ['poPrice', 'coPrice', 'billed', 'billingBbacklog'];

    const keyNames = {
        poPrice: 'po_price',
        coPrice: 'co_price',
        billed: 'billed',
        billingBbacklog: 'billing_backlog'
    }

    const evaluateFormula = async (formula, data) => {
        const regex = /[a-zA-Z_]+|%[0-9]+/g;
        const variables = formula.match(regex);
        let evaluatedFormula = formula;
        variables.forEach(variable => {
            evaluatedFormula = evaluatedFormula.replace(
                variable,
                variable.includes('%')
                    ? `*${parseInt(variable.slice(1)) / 100}`
                    : data[variable]
            );
        });
        try {
            eval(evaluatedFormula);
            return formula.replace(/[a-zA-Z_]+|%[0-9]+/g, variable =>
                variable.includes('%')
                    ? `*${parseInt(variable.slice(1)) / 100}`
                    : keyNames[variable]
            );
        } catch (error) {
            throw false;
        }
    };

    const processAndSaveAwardData = async (e) => {
        e.preventDefault()
        // let dummyformulaObj = {}
        // formulaObjects.forEach((key) => dummyformulaObj[key] = 10)
        // if(!formulaTested) {
        //     toast.info('please test formula before awarding')
        //     return ;
        // }
        try {
            // const OFAFORMULACLIENT = clients[]
            // awardDetail.OFABacklogFormula = await evaluateFormula(OFAFORMULA, dummyformulaObj)
            // awardDetail.FABBacklogFormula = await evaluateFormula(FABFORMULA, dummyformulaObj)
            setData(awardDetail)
        } catch (error) {
            console.log(error)
            toast.error("Invalid formula detected")
        }
    }

    const testFormula = async () => {
        try {
            let dummyformulaObj = {}
            formulaObjects.forEach((key) => dummyformulaObj[key] = 10)
            await evaluateFormula(OFAFORMULA, dummyformulaObj)
            await evaluateFormula(FABFORMULA, dummyformulaObj)
            toast.success('Formula Tested Successfully')
            setformulaTested(true)
            console.log(FABFORMULA,OFAFORMULA)
        } catch (error) {
            toast.error("Invalid formula detected")
        }
    }

    return (
        <Modal open onClose={closePopup}>
            <form onSubmit={processAndSaveAwardData}>
                <div className='award_popup award_popup_container' >
                    <div>
                        <h1>Award Job</h1>
                        <input required type="date" onChange={(e) => awardDetail.date = e.target.value} /><br />
                        <select required onChange={(e) => awardDetail.location = e.target.value}>
                            <option hidden value="">Location</option>
                            <option value="Kochi">Kochi</option>
                            <option value="Chennai">Chennai</option>
                        </select>
                        {/* <input placeholder='Location' onChange={(e) => awardDetail.location = e.target.value} /><br /> */}
                        <input placeholder='Tonnage' onChange={(e) => awardDetail.tonnage = e.target.value} /><br /> {/* add user dropdown start */}
                        <OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)} >
                            <div style={{ position: "relative" }} className="award_add_user" >
                                <label>{isUserSelected ? "Selected User" : "Add User"}</label>
                                {!isUserSelected && <input required placeholder='Search User' onChange={searchEmployee} type='text' />}
                                {isUserSelected &&
                                    <div className='award_selected_users'>
                                        <ProfileImage id={awardDetail.user} size={25} />
                                        <h3>{awardDetail.userName}</h3>
                                        <Close onClick={() => setIsUserSelected(false)} />
                                    </div>}
                                {isDropDownOpen &&
                                    <div className='list_style' >
                                        {Users.map((user) => (
                                            <MenuItem key={user._id} value={user._id} onClick={() => {
                                                awardDetail.user = user._id
                                                awardDetail.userName = user.firstName
                                                setIsDropdownOpen(false)
                                                setIsUserSelected(true)
                                            }}>
                                                <ProfileImage id={user._id} size={30} />
                                                {user.firstName} {user.lastName}
                                            </MenuItem>
                                        ))}
                                    </div>}
                            </div>
                        </OutsideClickHandler>

                        <input required placeholder='Job NO' type={'text'} onChange={(e) => awardDetail.jobNumber = e.target.value} /><br />
                        <textarea placeholder='Notes' required onChange={(e) => awardDetail.notes = e.target.value} /><br />
                    </div>
                    <div>
                        {/* <h1>Project Dashboard Details</h1> */}
                        {/* <h3>formula objects</h3>
                        <div className='formula_option_parent'>
                            {formulaObjects.map((value, index) => {
                                return (
                                    <div key={index} className='formula_option_child' onClick={() => addFormulaVariable(value)}>
                                        {value.toUpperCase()}
                                    </div>
                                )
                            })}
                        </div>
                        <h5>OFA FORMULA ( <span onClick={() => setOFAFORMULA('')} style={{ fontWeight: '300', color: 'red', cursor: 'pointer', textDecoration: 'underline' }}>clear</span> ) </h5>
                        <br />
                        <input required onFocus={() => settype('OFA')} className='content_div' value={OFAFORMULA} onChange={(e) => setOFAFORMULA(e.target.value)} type={"text"} />
                        <h5>FAB FORMULA ( <span onClick={() => setFABFORMULA('')} style={{ fontWeight: '300', color: 'red', cursor: 'pointer', textDecoration: 'underline' }}>clear</span> ) </h5>
                        <br />
                        <input required onFocus={() => settype('FAB')} className='content_div' value={FABFORMULA} onChange={(e) => setFABFORMULA(e.target.value)} type={"text"} />
                        <button type='button' onClick={testFormula} style={{padding:'5px'}}>TEST FORMULA</button>
                        <br/>
                        <br/> */}
                        <div style={{ display: "flex", marginTop: "15px" }}>
                            <button type='submit'>Award Job</button>
                            <button onClick={closePopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form>

        </Modal>
    )
}

export default AwardJobPopup