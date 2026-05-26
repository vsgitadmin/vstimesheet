import instance from '../../../Config/AxiosConfig/AxiosConfig'
import Endpoints from '../../Constants/Endpoints/config'
const employeeFunctions = {
    fetchActivationRequests: () => {
        return new Promise(async (resolve, reject) => {
        instance.get(Endpoints.getallactivationrequests).then((response) => resolve(response)).catch((err) => {reject(err)})})
    },
    createNewEmployee:(data)=>{
        return new Promise(async(resolve,reject)=>{
            instance.post(Endpoints.createnewemployee,data).then((response)=>resolve(response)).catch((err)=>reject(err))
        })
    }
}
module.exports = employeeFunctions
