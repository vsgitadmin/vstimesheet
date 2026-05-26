const arrayDiff = require('../../Functions/General/arrayDiff')
const getCommonKeys = require('./getCommonKeys')

const jobActivityComparisonFunction = async (data, jobModel) => {
    let Log = {}
    let TotalLog = {}
    const oldObject = await jobModel.findById(data._id);
    const newObject = Object.assign(data, {})
    Object.keys(data).forEach((key) => newObject[key] = data[key])
    newObject.date = new Date(newObject.date)
    newObject.estimate = new Date(newObject.estimate)

    // direct checking
    Object.keys(newObject).forEach((key) => {
        if (['total_breakpoints', 'awarded', 'sub_items', 'lastUpdated', 'date', 'estimate', 'pending', 'createdAt'].includes(key) == false) {
            if (oldObject[key] != newObject[key]) {
                Log[key] = `${oldObject[key]} has been changed to ${newObject[key]} `;
            }
        } else if (['date', 'estimate'].includes(key)) {
            const oldDateToString = new Date(oldObject[key]).toDateString();
            const newDateToString = new Date(newObject[key]).toDateString();
            if (oldDateToString === newDateToString) null
            else Log[key] = `${oldDateToString} has been changed to ${newDateToString}`;
        }
    })

    // total object checking
    if ([newObject.total_breakpoints, oldObject.total_breakpoints].includes(undefined) == false)
        Object.keys(newObject.total_breakpoints).forEach((total_key) => {
            if (oldObject.total_breakpoints[total_key] !== newObject.total_breakpoints[total_key])
                TotalLog[total_key] = ` ${total_key} : ${oldObject.total_breakpoints[total_key]} has been changed to ${newObject.total_breakpoints[total_key]} `;
        })

    const addedElements = arrayDiff(newObject.sub_items, oldObject.sub_items).map((data) => `${data.point} has been added`)
    const removedElement = arrayDiff(oldObject.sub_items, newObject.sub_items).map((data) => `${data.point} has been removed`)
    const commonElements = getCommonKeys(oldObject.sub_items, newObject.sub_items).map((elements) => elements.point)
    const UpdateLog = updatedElements(oldObject.sub_items, newObject.sub_items, commonElements)
    const UpdateLogCheck = Object.keys(UpdateLog).filter((key) => Object.keys(UpdateLog[key]).length > 0)
    const UpdateLogFiltered = UpdateLogCheck.map((key) => {
        return {
            ...UpdateLog[key],
            name: key
        }
    })
    const Activity = {
        direct: Object.keys(Log).length > 0 ? Log : null,
        total: Object.keys(TotalLog).length > 0 ? TotalLog : null,
        added: addedElements.length > 0 ? addedElements : null,
        removed: removedElement.length > 0 ? removedElement : null,
        updated: UpdateLogFiltered.length > 0 ? UpdateLogFiltered : null,
    }

    return Activity
}


function updatedElements(array1, array2, common) {
    let UpdateLog = []
    let changes = {}
    common.map((key) => {
        const obj1 = array1.find((obj => obj.point == key))
        const obj2 = array2.find((obj) => obj.point == key)
        Object.keys(obj1).map((obj_key) => {
            if (obj1[obj_key] !== obj2[obj_key]) changes[obj_key] = `${obj1[obj_key]} has been updated to ${obj2[obj_key]}`
        })
        UpdateLog[key] = changes
        changes = {}
    })
    return UpdateLog

}

module.exports = jobActivityComparisonFunction