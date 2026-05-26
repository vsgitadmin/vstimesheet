const {validateUserloginDetails, logoutUser, logOutAllEmployees, checkLogoutEligibility} = require("../ControllerFunction/Authentication/index")
const {response:{authResponse}} = require('../../Classes/index')

const loginUserByCredsController = async (req,res) => {
    const response = await validateUserloginDetails(req.query)
    .then((token) => new authResponse("log in successfull",{token:token},true))
    .catch((err) => new authResponse("log in failed "+err.message,null,false));
    res.status(!response.validated ? 400 : 200).json(response)
}

const logoutAllEmployeesController = async (req,res) => {
    // Defaults to keep this endpoint responsive when called without a body.
    // You can still override by sending daysBack/concurrency/startDate/endDate explicitly.
    const body = { ...(req.body || {}) }
    if (!body.startDate && !body.endDate && (body.daysBack === undefined || body.daysBack === null)) {
        body.daysBack = 1
    }
    if (body.concurrency === undefined || body.concurrency === null) {
        body.concurrency = 2
    }

    const response = await logOutAllEmployees(body)
    .then((token) => new authResponse("Work hours generated for employees", { token: token }, true))
    .catch((err) => new authResponse("log in failed "+err.message,null,false));
    res.status(!response.validated ? 400 : 200).json(response)
}

const checkLogoutController = async (req, res) => {
    const response = await checkLogoutEligibility(req.headers.data)
        .then((data) => new authResponse("Logout eligibility checked", data, true))
        .catch((err) => new authResponse("Logout check failed " + err.message, null, false));
    res.status(!response.validated ? 400 : 200).json(response);
};

const logOutController = async (req,res) => {
    const response = await logoutUser(req.headers.data)
    .then((data) => new authResponse("loged out successfull",{data},true))
    .catch(async (err) => {
        let extra = null;
        try {
            extra = await checkLogoutEligibility(req.headers.data);
        } catch (_) { /* ignore */ }
        return new authResponse(
            "log out failed " + err.message,
            extra,
            false
        );
    });
    res.status(!response.validated ? 400 : 200).json(response)
}

module.exports = {loginUserByCredsController, logOutController, logoutAllEmployeesController, checkLogoutController}