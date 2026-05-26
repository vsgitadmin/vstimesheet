import instance from "../../Axios/Axios.config";
import {filters} from "../../Constants/API/Endpoints";

const filterEmployeesController = async (query) => {
    try {
        const employees = await instance.get(filters.employees, {params: query});
        return employees
    } catch (err) { throw err }
}

const filterJobsDynamicController = async (query) => {
    try {
        const jobs = await instance.get(filters.jobs, {params: query});
        return jobs
    } catch (err) { throw err }
}

const filterAwardedJobsDynamicController = async (query) => {
    try {
        const jobs = await instance.get(filters.awarded, {params: query});
        return jobs
    } catch (err) { throw err }
}

const filterAwardedJobsDashboardDynamicController = async (query) => {
    try {
        const jobs = await instance.get(filters.dashboardJobs, {params: query});
        return jobs
    } catch (err) { throw err }
}

const selectEmployeesController = async (query) => {
    try {
        const jobs = await instance.get(filters.selectEmployee, {params: query});
        return jobs
    } catch (err) { throw err }
}

const selectProjectController = async (query) => {
    try {
        const jobs = await instance.get(filters.selectProject, {params: query});
        return jobs
    } catch (err) { throw err }
}

module.exports = {filterEmployeesController,filterAwardedJobsDynamicController,filterJobsDynamicController,filterAwardedJobsDashboardDynamicController,selectEmployeesController,selectProjectController}