import { Add } from '@mui/icons-material'
import React, { useContext, useEffect, useState } from 'react'
import AddConfigPopup from '../Popups/General/AddConfigPopup'
import { getConfigController } from "../../Controllers/Config";
import { updateConfig } from "../../Controllers/Config/index"
import { toast } from "react-toastify";
import { ParentStore } from '../../../pages/_app';
const ConfigPage = () => {

    const [addConfigPopup, setAddConfigPopup] = useState(false)
    const [configData, setConfigData] = useState([])
    const [selectedType, setSelectedType] = useState(null)
    const { setParentState, ParentState } = useContext(ParentStore)

    const updateConfigFunction = (body) => {
        let req = updateConfig(body)
        toast.promise(req, { error: "error updating config", pending: "updating config", success: "config updated successfully" }).then(() => { fetchConfig(); setAddConfigPopup(false) }).catch((err) => { console.log(err); })
    }

    const fetchConfig = () => {
        getConfigController().then((res) => {
            setConfigData(res.data.response.data)
        }).catch((e) => {
            console.log(e)
        })
    }

    useEffect(() => {
        fetchConfig()
    }, []);

    const handleUpdateJobprice = (e) => {
        let price = e.target.value
        updateConfigFunction({ type: 'jobPrice', value: price })
    }


    return (<div className='container'>
        <AddConfigPopup selectedType={selectedType} updateConfig={updateConfigFunction} addConfigPopup={addConfigPopup} setAddConfigPopup={setAddConfigPopup} />
        <div>
            <h1>Config Page</h1>
        </div>

        <div className='config_title mt_4'>
            <h2>Clients</h2>
            <button onClick={() => {
                setSelectedType('client')
                setAddConfigPopup(true)
            }}><Add /></button>
        </div>

        <div className='config_main'>
            {
                configData.filter((c) => c.type === "client")[0]?.configObjects.map((data) => {
                    return <div className='config_card'>
                        <div>
                            <h2>{data.name}</h2>
                        </div>
                        <div>
                            {
                                Object.keys(data).map((key) => {
                                    if (key !== '_id')
                                        return <h3>{data[key]}</h3>
                                })
                            }
                        </div>
                    </div>
                })
            }
        </div>

        <div className='config_title mt_4'>
            <h2>Designation</h2>
            <button onClick={() => { setSelectedType('designation'); setAddConfigPopup(true) }}><Add /></button>
        </div>

        <div className='config_main'>
            {
                configData.filter((c) => c.type === 'designation')[0]?.configObjects.map((data) => {
                    return <div className='config_card'>
                        <div>
                            <h2>{data.name}</h2>
                        </div>
                        <div>
                            {
                                Object.keys(data).map((key) => {
                                    if (key !== '_id')
                                        return <h3>{data[key]}</h3>
                                })
                            }
                        </div>
                    </div>
                })
            }
        </div>


        <div className='config_title mt_5'>
            <h2>Constants</h2>
        </div>

        <div className='config_main'>
            <div className='config_const'>
                <h3>JOB Price</h3>
                <input defaultValue={configData.filter((f) => f.type === 'jobPrice')[0]?.value} onBlur={handleUpdateJobprice} />
            </div>
        </div>

    </div>)
}

export default ConfigPage