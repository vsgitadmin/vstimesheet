const { management: { employeeActivationRequest }, employee: { employeeModel } } = require("../../../Models/Extractor/index");
const { updateEmpByEmp } = require("../../../Controllers/ControllerFunction/Employees/index")
const { employee: { sendEmployeeActivationReviewMail } } = require("../../../Helpers/Extractor/index");
const encryptDataToJwt = require("../../../Helpers/Functions/Authentication/JWTEncoder");
const sendEmail = require("../../../Helpers/Functions/Email/sendEmail");
const OnboardingSuccessTemplate = require("../../../Config/Templates/OnboardingSuccessTemplate");
const activationReviewTemplate = require("../../../Config/Templates/activationReviewTemplate");
const { sendEmailFunction } = require("../Communication");
const { withEmailBanner } = require("../../../Helpers/Functions/General/emailBanner");

const createEmployeeActivationRequest = async (body) => {
    try {
        const employeeDetail = await employeeModel.findOne({ activationId: body.activationId })
        body.empId = employeeDetail._id
        body.empName = `${employeeDetail.firstName} ${employeeDetail.lastName}`
        body.designation = employeeDetail.designation
        body.department = employeeDetail.department
        const employeeRequest = new employeeActivationRequest(body).save();
        return employeeRequest;
    } catch (err) {
        throw err;
    }
}

const getSingleActivationRequest = async (query) => {
    try {
        const request = await employeeActivationRequest.findOne(query)
        return request
    } catch (err) {
        throw err;
    }
}

const UpdateActivationRequest = async (id, data) => {
    try {
        const img = data.updatedDetails.personal_details.img
        const request = await employeeActivationRequest.findByIdAndUpdate({ _id: id }, { $set: {updatedDetails:data.updatedDetails,approved:false} })
        return request
    } catch (err) {
        throw err;
    }
}

const getAllEmpActivationRequests = async (pageNumber) => {
    let page = pageNumber >= 1 ? pageNumber : 1;
    page = page - 1
    const empPerPage = 6
    const allActivationRequest = employeeActivationRequest.find().limit(empPerPage).skip(page * empPerPage).sort({ requestedDate: -1 })
    return allActivationRequest;
}

const sendEmpActivationreviewRequests = async (body) => {
    const employee = await employeeModel.findOne({ email: body.mail }).select('email firstName lastName activationId')
    const templateCode = activationReviewTemplate(
        await withEmailBanner({
            name: employee.firstName + ' ' + employee.lastName,
            message: body.message,
        }))
    await sendEmailFunction({ to: employee.email, subject: `Activaton Details Changes Requested`, html: templateCode })
    return true;
}

const ApproveEmployeeActivationRequests = async (id) => {
    try {
        const approveRequestData = await employeeActivationRequest.findOne({ empId: id });
        const approveRequest = employeeActivationRequest.findOneAndUpdate({ empId: id }, { approved: true });
        await updateEmpByEmp({ id: id, data: approveRequestData.updatedDetails, working: true })
        const eData = await employeeModel.findById(id);
        eData.onBoarded = true
        await eData.save()
        let passwordConfigKey = await encryptDataToJwt({ _id: id })
        await sendEmail(eData.personalEmail, 'Set password for vectorshades', OnboardingSuccessTemplate(await withEmailBanner({ link: `http://localhost:3000/auth/password/set?key=${passwordConfigKey}`, name: eData.firstName, email: eData.email })))
        return approveRequest
    } catch (err) {
        throw err;
    }
}

const getTotalNumberofActivationRequests = async () => {
    try {
        const count = await employeeActivationRequest.count()
        return count
    } catch (err) { throw err }
}

const getAllFilterdActivationReq = async (query) => {
    try {
        const employees = await employeeActivationRequest.find({ empName: { $regex: query.name, "$options": "i" } }).select('-updatedDetails').sort({ requestedDate: query.sortkey })
        return employees
    } catch (err) { throw err }
}

module.exports = { createEmployeeActivationRequest, sendEmpActivationreviewRequests, getAllEmpActivationRequests, ApproveEmployeeActivationRequests, getSingleActivationRequest, UpdateActivationRequest, getTotalNumberofActivationRequests, getAllFilterdActivationReq }