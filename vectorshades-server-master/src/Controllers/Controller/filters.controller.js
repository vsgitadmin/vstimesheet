const {filterEmployee} = require("../ControllerFunction/Employees/index")
const {filterJobs,filterAwardedJobs,filterProjectJobs,selectEmployeeFunction, selectProjectFunction} = require("../ControllerFunction/Filters/index")
const { response: { employeeResponse } } = require("../../Classes/index")

const FilterEmployeeController = async (req,res) => {
    const response = await filterEmployee(req.query,req.query.page)
    .then((emp) => new employeeResponse("employee filtered", emp, false))
    .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}
const FilterJobsController = async (req,res) => {
    const response = await filterJobs(req.query,req.query.page)
    .then((jobs) => new employeeResponse("jobs filtered", {jobs}, false))
    .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const FilterAwardedJobsController = async (req,res) => {
    const response = await filterAwardedJobs(req.query,req.query.page)
    .then((jobs) => new employeeResponse("awarded jobs filtered", {jobs}, false))
    .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const FilterProjectJobsController = async (req,res) => {
    const response = await filterProjectJobs(req.query,req.query.page)
    .then((jobs) => new employeeResponse("dashboard jobs filtered", {jobs}, false))
    .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const FilterSelectEmployeeController = async (req,res) => {
    const response = await selectEmployeeFunction(req.query)
    .then((employee) => new employeeResponse(" employee filtered", {employee}, false))
    .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const FilterSelectProjectController = async (req,res) => {
    const response = await selectProjectFunction(req.query)
    .then((project) => new employeeResponse("project filtered", {project}, false))
    .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

module.exports = {FilterEmployeeController,FilterJobsController,FilterAwardedJobsController,FilterProjectJobsController,FilterSelectEmployeeController, FilterSelectProjectController}