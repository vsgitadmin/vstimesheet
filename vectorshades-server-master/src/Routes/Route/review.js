const express = require("express");
const { createEmployeeReviewController, getEmployeeReviewsController, getEmployeeReviewDetailsController, updateEmployeeReviewController, deleteEmployeeReviewController, createReviewAnalyticsController, deleteEmployeeReviewAnalyticsController, getEmployeeReviewAnalyticsController, getReviewAnalyticsDetailsController, updateEmployeeReviewAnalyticsController, createReviewRequestController, getReviewRequestsController, updateReviewRequestsController, deleteReviewRequestsController, getAllReviewRequestsController, getEmployeeAnalyticsOfSpecificYearController, getAllIncommingReviewRequestsController, getReviewRequestByIdController, generateEmployeePerformanceController } = require("../../Controllers/Controller/review.controller");
const reviewRoute = express.Router();

reviewRoute.post('/create', createEmployeeReviewController)
reviewRoute.get('/get/all', getEmployeeReviewsController)
reviewRoute.get('/get', getEmployeeReviewDetailsController)
reviewRoute.patch('/update', updateEmployeeReviewController)
reviewRoute.delete('/delete', deleteEmployeeReviewController)
reviewRoute.post('/employee/analytics/create',createReviewAnalyticsController)
reviewRoute.delete('/employee/analytics/delete',deleteEmployeeReviewAnalyticsController)
reviewRoute.get('/employee/get/analytics',getEmployeeReviewAnalyticsController)
reviewRoute.get('/employee/analytics/single',getReviewAnalyticsDetailsController)
reviewRoute.patch('/employee/analytics/update',updateEmployeeReviewAnalyticsController)
reviewRoute.post('/request/create',createReviewRequestController)
reviewRoute.get('/request/get/active',getReviewRequestsController)
reviewRoute.patch('/request/update',updateReviewRequestsController)
reviewRoute.delete('/request/delete',deleteReviewRequestsController)
reviewRoute.get('/request/get/all',getAllReviewRequestsController)
reviewRoute.get('/employee/analytics/get',getEmployeeAnalyticsOfSpecificYearController)
reviewRoute.post('/employee/analytics/generate',generateEmployeePerformanceController)
reviewRoute.get('/request/reviewer/get',getAllIncommingReviewRequestsController)
reviewRoute.get('/request/get/single',getReviewRequestByIdController)

module.exports = reviewRoute