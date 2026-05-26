import {fetchActivationRequests,createNewEmployee} from "../Functions/Api Functions/employee";
import sumOfArrayObjects from "../General/SumofObject";
import substractTwoObjects from "../General/SubstractObject";
import sumTwoObjects from "../General/AddTwoObject";
import debounce from "../General/Debouncer";
// import extractKeys from "../General/Extractkeys";

const extractKeys = (form,keys) => {
    let obj = {}
    keys.forEach(key => {
        obj[`${key}`] = form.target[key].value
    });
    return obj
}

const helperFunctions = {
    general: {
        extractKeys,
        sumOfArrayObjects,
        substractTwoObjects,
        sumTwoObjects,
        debounce
    },
    employeeFunctions: {
        fetchActivationRequests,
        createNewEmployee
    }
}
module.exports = helperFunctions