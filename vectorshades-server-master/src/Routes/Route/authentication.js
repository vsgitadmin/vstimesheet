const express = require("express")
const authenticationRoute = express.Router();
const {loginUserByCredsController, logOutController, logoutAllEmployeesController, checkLogoutController} = require("../../Controllers/Controller/authentication.controller");

authenticationRoute.get('/login', loginUserByCredsController);
authenticationRoute.get('/logout/check', checkLogoutController);
authenticationRoute.post('/logout/all', logoutAllEmployeesController);
authenticationRoute.post('/logout', logOutController);


module.exports = authenticationRoute;