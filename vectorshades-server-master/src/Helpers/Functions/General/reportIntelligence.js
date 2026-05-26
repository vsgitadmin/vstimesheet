const fs = require('fs');
const path = require('path');
const {
    filterJobs, filterAwardedJobs, filterProjectJobs, leavesFilter, employeeProductionHrsFunction,
    employeeBillingReportFunction, employeeLogsReport,
    CompanyLogsFilter,filterEmployee,employeesWorkHrsFunction,ProjectProductionList, ProjectProductionBilling,
    employeesProjectPersonalWorkHrsFunction
} = require('../../../Controllers/ControllerFunction/Filters/index')
const generateCSV = require('../../../Helpers/Functions/General/csvGenerator')
const { existsSync, mkdirSync, unlinkSync } = require("fs");
const { uploadCloudS3Document, uploadExcelToS3 } = require('../../../Helpers/Functions/S3/index');
const { randomUUID } = require('crypto');
const writeXlsxFile = require('write-excel-file/node');
const { fileModel } = require('../../../Models/Reports');
const { generateStyledWorkbook, generateGeneralStyledWorkbook } = require('../ThirdParty/styleExcel');

const generateReportData = async (type, query, body ) => {
    try {
        const availableFilter = {
            employee: filterEmployee,rebarJobs:filterJobs,rebarAwardedJobs:filterAwardedJobs,rebarAwardedDashboardJobs:filterProjectJobs, jobs: filterJobs, awardedJobs: filterAwardedJobs, projectJobs: filterProjectJobs, leaves: leavesFilter
        }
        const presetFilters = {
            employeeProductionHrs: employeeProductionHrsFunction,
            employeeWorkHrs: employeesWorkHrsFunction,
            projectProduction:ProjectProductionList,
            projectBilling:ProjectProductionBilling,
            employeeBillingReport: employeeBillingReportFunction,
            employeeLogsReport: employeeLogsReport,
            CompanyLogsFilter: CompanyLogsFilter,
            EmployeeProjectPersonal:employeesProjectPersonalWorkHrsFunction
        }
        let filteredData;
        let location;
        // Exception Cases
        const manualReports = ['employeeWorkHrs','EmployeeProjectPersonal']
        if(type == 'employeeWorkHrs'){
            const data = await presetFilters[type](query)
            location = await createExcelReportAndUpload(data, { file: body.file },'employeeWorkHrs')
        }
        else if(type == 'EmployeeProjectPersonal'){
          const data = await presetFilters[type](query)
          location = await createExcelReportAndUpload(data, { file: body.file },'EmployeeProjectPersonal')
        }
        else if (presetFilters[type] !== undefined) {
            filteredData = await presetFilters[type](query)
            filteredData = filteredData.map(obj =>
                body.keys.reduce((filteredObj, key) => {
                    if (key in obj) {
                        filteredObj[key] = obj[key];
                    }
                    return filteredObj;
                }, {})
            );
        }
        else filteredData = await availableFilter[type]({ ...query, fields: body.keys, monthFilter: body.monthFilter, yearFilter: body.yearFilter }, 0, true)
        if(manualReports.includes(type) === false) location = await createExcelReportAndUpload(filteredData, { file: body.file })
        return location
    } catch (error) {
        throw error;
    }
}

const writeCSVStringToFile = (csvString, filePath) => {
    const resolvedPath = path.resolve(filePath);
    fs.writeFileSync(resolvedPath, csvString, 'utf8');
    console.log(`CSV file written to ${resolvedPath}`);
};

const createReportAndUpload = async (data, body , dataProcessed = false ) => {
    try {
        const id = randomUUID()
        const fileName = path.join('public/reports/general', `${id}_${body.file}`);
        fs.mkdirSync(path.dirname(fileName), { recursive: true });
        fs.writeFileSync(fileName, "", 'utf8');

        if(!dataProcessed) await generateCSV(data, fileName)
        else await writeCSVStringToFile(data,fileName)
        let paths3 = await uploadCloudS3Document(fileName, body.file)
        await unlinkSync(fileName)
        return paths3.Key
    } catch (error) {
        throw error;
    }
}

function processData(dataArray) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
    return dataArray.map(item => {
      const result = {};
      for (const [key, value] of Object.entries(item)) {
        if (typeof value === 'string' && uuidRegex.test(value)) {
          continue;
        }
        if (typeof value === 'number' && !Number.isInteger(value)) {
          const rounded = Number(value.toFixed(2));
          result[key] = rounded;
        } else {
          result[key] = value;
        }
      }
      return result;
    });
  }
  


async function createExcelReportAndUpload(data, body , type ) {
    const baseName = path.parse(body.file).name
    const fileName = path.join('public', 'reports', 'general', `${baseName}.xlsx`)
  
    fs.mkdirSync(path.dirname(fileName), { recursive: true })
    
    let workbook;

    if(type === 'employeeWorkHrs') workbook = await generateStyledWorkbook(data, 'employeeWorkHrs');
    else workbook = await generateGeneralStyledWorkbook(processData(data), baseName);

    await workbook.xlsx.writeFile(fileName);
  
    const s3Key  = `${baseName}.xlsx`
    const paths3 = await uploadExcelToS3(
      fileName,
      s3Key,
      { ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    )
    fs.unlinkSync(fileName)
    await fileModel.updateOne(
        { location: paths3.Key },
        { $set: { fileData: JSON.stringify(data) } },
        { upsert: true }
      );
    return paths3.Key
  }

module.exports = {
    generateReportData,
    createReportAndUpload,
    employeeLogsReport,
    createExcelReportAndUpload
};
