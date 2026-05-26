const {data} = require("../../../Config/constants/EmployeeActivationData")

const processEmployeeActivationRequest = (details) => {
    const processedObj = JSON.parse(JSON.stringify(data.updated_details))
    // processing for personal details

    Object.keys(details.personal_details).forEach((key) => {
        processedObj.personal_details[key] = details.personal_details[key]
    })

    processedObj.photo_path = details.personal_details.img
    // processing for personal details


    processedObj.emergency_contact_details = details.emergency_contact_details.slice(0,1)

    details.family.forEach((data) => {
        if(['Sister','Brother'].includes(data.relation))processedObj.family_details.brothers_and_sisters.push(data)
        else if(['Mother','Father'].includes(data.relation)) processedObj.family_details.parents.push(data)
        else if(['Mother','Father'].includes(data.relation)) processedObj.family_details.parents.push(data)
        else if(['Son'].includes(data.relation)) {
            data['gender'] = 'Male'
            processedObj.family_details.childrens.push(data)
        }
        else if(['Daughter'].includes(data.relation)) {
            data['gender'] = 'Female'
            processedObj.family_details.childrens.push(data)
        }
        else if(['Spouse'].includes(data.relation)) processedObj.family_details.spouse = data
    })

    details.qualification.qualification.forEach((data) => {
        let obj = data
        obj['title'] = obj['type']
        obj['qualification'] = obj['type']
        delete obj.type
        processedObj.qualifications.push(obj)
    })

    details.reference.reference.forEach((data) => {
        let obj = data
        obj['fax'] = ''
        obj['position_or_title'] = obj['position']
        delete obj.position
        processedObj.references.push(obj)
    })

    details.reference.certificate.forEach((data) => {
        let obj = data
        delete obj.file
        delete obj.file_name
        processedObj.other_certifications.push(obj)
    })

    details.employement.employement.forEach((data) => {
        processedObj.employement_history.push(data)
    })


    return processedObj
}

module.exports = {processEmployeeActivationRequest}