const express = require("express");
const {FilterEmployeeController,FilterJobsController,FilterAwardedJobsController,FilterProjectJobsController,FilterSelectEmployeeController, FilterSelectProjectController} = require('../../Controllers/Controller/filters.controller')
const filterRoute = express.Router();

filterRoute.get('/employee',FilterEmployeeController)
filterRoute.get('/jobs',FilterJobsController)
filterRoute.get('/jobs/awarded',FilterAwardedJobsController)
filterRoute.get('/jobs/project',FilterProjectJobsController)
filterRoute.get('/select/employee',FilterSelectEmployeeController)
filterRoute.get('/select/project',FilterSelectProjectController)

module.exports = filterRoute;