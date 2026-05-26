import {config} from "../../Constants/API/Endpoints";
import instance from "../../Axios/Axios.config";

const updateConfig = (body) => {
    return instance.post(config.updateConfig, body)
}

const getConfigController = () => {
    return instance.get(config.getConfig)
}

export {updateConfig, getConfigController}