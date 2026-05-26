import React,{useState,useEffect} from 'react'
import Popup from 'reactjs-popup';
import moment from 'moment'

function EditDashboardJob({ editPopupData, closePopup, submit }) {
    const [dashboardData, setdashboardData] = useState(editPopupData)
    const [OFAFORMULA, setOFAFORMULA] = useState('');
    const [FABFORMULA, setFABFORMULA] = useState('');
    const [type, settype] = useState('OFA')

    const addFormulaObject = (value) => type == 'OFA' ? setOFAFORMULA((formula) => formula.concat(`<span style="color:red;">${value}</span>`)) : setFABFORMULA((formula) => formula.concat(`<span style="color:red;">${value}</span>`))

    const addFormulaVariable = (value) => type == 'OFA' ? setOFAFORMULA((formula) => formula.concat(`<span style="color:grey;">${value}</span>`)) : setFABFORMULA((formula) => formula.concat(`<span style="color:grey;">${value}</span>`))

    const formulaObjects = ['po_price', 'co_price', 'billed', 'billing_backlog'];
    const formulaVariables = ['+', '-', '*', '/', '%','(',')','num'];

    // useEffect(() => {
    //   setFABFORMULA(editPopupData.FABBacklogFormula);
    //   setOFAFORMULA(editPopupData.OFABacklogFormula)
    // }, [])
    
    const editDashboardJob = () => {
        if(FABFORMULA !== ''){
            let FABDATA = document.createElement('span');
            FABDATA.innerHTML = FABFORMULA;
            dashboardData.FABBacklogFormula = FABDATA.textContent
        }
        if(OFAFORMULA !== ''){
            let OFADATA = document.createElement('span');
            OFADATA.innerHTML = OFAFORMULA;
            dashboardData.OFABacklogFormula = OFADATA.textContent
        }
        submit(dashboardData)
    }

    return (
        <Popup position="right center" contentStyle={{ width: "500px", padding: "40px", borderRadius: "10px" }} open onClose={closePopup}>
            <div className='award_popup'>
                <h1>Edit Dashboard Project</h1>
                <h5 style={{marginBottom:"5px"}}>Date</h5>
                <input required type="date" defaultValue={moment(editPopupData.date).format('YYYY-MM-DD')} onChange={(e) => editPopupData.date = e.target.value} /><br />
                <h5 style={{marginBottom:"5px"}}>Billed</h5>
                <input placeholder='Billed' defaultValue={dashboardData.billed} type="number" onChange={(e) => dashboardData.billed = e.target.value} /><br />
                <h5 style={{marginBottom:"5px"}}>Used Hours</h5>
                <input placeholder='Used Hours' defaultValue={dashboardData.usedHours} type="number" onChange={(e) => dashboardData.usedHours = e.target.value} /><br />
                <h3>Edit Formula</h3>
                <div className='formula_option_parent'>
                    {formulaObjects.map((value,index) => {
                        return (
                            <div key={index} index={value} className='formula_option_child' onClick={() => addFormulaObject(value)}>
                                {value.toUpperCase()}
                            </div>
                        )
                    })}
                </div>
                <div className='formula_symbol_parent'>
                    {formulaVariables.map((value,index) => {
                        if(value !== 'num')
                        return (
                            <div key={index} className='formula_option_child' onClick={() => addFormulaVariable(value)}>
                                {value}
                            </div>
                        )
                        else
                        return(
                            <input placeholder='enter number here' style={{width:'100px',backgroundColor:'#5a5555',border:'none',color:'white'}} onBlur={(e) => addFormulaVariable(e.target.value)}/>
                        )
                    })}
                </div>
                <h5>OFA FORMULA <span style={{fontWeight:'300',textDecoration:'underline'}}>({editPopupData.OFABacklogFormula})</span> <span onClick={() => setOFAFORMULA('')} style={{fontWeight:'300',color:'red',cursor:'pointer',textDecoration:'underline'}}>clear</span></h5>
                <br />
                <div contentEditable={true} onFocus={() => settype('OFA')} className='content_div' dangerouslySetInnerHTML={{ __html: OFAFORMULA }} onChange={(e) => setOFAFORMULA(e.target.value)}></div><br />
                <h5>FAB FORMULA <span style={{fontWeight:'300',textDecoration:'underline'}}>({editPopupData.FABBacklogFormula})</span> <span onClick={() => setFABFORMULA('')} style={{fontWeight:'300',color:'red',cursor:'pointer',textDecoration:'underline'}}>clear</span></h5>
                <br />
                <div contentEditable={true} onFocus={() => settype('FAB')} className='content_div' dangerouslySetInnerHTML={{ __html: FABFORMULA }} onChange={(e) => setFABFORMULA(e.target.value)}></div><br />
                <div style={{ display: "flex", marginTop: "15px" }}>
                    <button onClick={editDashboardJob}>Edit Award Job</button>
                    <button onClick={closePopup}>Cancel</button>
                </div>
            </div>
        </Popup>
    )
}

export default EditDashboardJob