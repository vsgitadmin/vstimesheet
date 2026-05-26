import instance from '../../Axios/Axios.config'
import { reviews } from '../../Constants/API/Endpoints'

const getEmployeeAnalyticsOfSpecificYearController = async (query) => {
    try {
        let response = await instance.get(reviews.getEmployeeAnalyticsOfSpecificYear, { params: query })
        return response
    } catch (Err) { throw Err }
}

const getAllReviewsOfEmployeeController = async (query) => {
    try {
        let response = await instance.get(reviews.getAllReviewsOfEmployee, { params: query })
        return response
    } catch (Err) { throw Err }
}

const getEmployeeReviewRequest = async (query) => {
    try {
        let response = await instance.get(reviews.getEmployeeReviewRequests, { params: query })
        return response
    } catch (Err) { throw Err }
}

const createEmployeeReviewRequest = async (body) =>{
    try {
        let response = await instance.post(reviews.createEmployeeReviewRequest,body)
        return response
    } catch (Err) { throw Err }
}

const getReviewRequestByIdController = async (query) =>{
    try {
        let response = await instance.get(reviews.getSingleReviewRequest,{params:query})
        return response
    } catch (Err) { throw Err }
}

const createReviewController = async (body) =>{
    try {
        let response = await instance.post(reviews.createReview,body)
        return response
    } catch (Err) { throw Err }
}

export { getEmployeeAnalyticsOfSpecificYearController, getAllReviewsOfEmployeeController, getEmployeeReviewRequest, createEmployeeReviewRequest, getReviewRequestByIdController,createReviewController }