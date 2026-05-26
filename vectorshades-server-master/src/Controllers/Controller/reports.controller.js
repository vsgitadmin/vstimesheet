const {createReports,getReports,refreshReports,deleteReports , getReportKeys,getTotalNumberOfReports, generateCSVReport, viewFileData} = require("../ControllerFunction/Reports/index")
const { response: { reportResponse } } = require("../../Classes/index")
const {generateCsvReportFunction, getCsvReportsFunction} = require("../ControllerFunction/Reports");
const { logOutAllEmployees } = require("../ControllerFunction/Authentication");
const sendEmail = require("../../Helpers/Functions/Email/sendEmail");
const { withEmailBanner } = require("../../Helpers/Functions/General/emailBanner");

const formatRangeLabel = ({ startDate, endDate, daysBack }) => {
    if (startDate || endDate) {
        const s = startDate ? new Date(startDate) : null;
        const e = endDate ? new Date(endDate) : null;
        const sLabel = s && !Number.isNaN(s.getTime()) ? s.toDateString() : String(startDate || '');
        const eLabel = e && !Number.isNaN(e.getTime()) ? e.toDateString() : String(endDate || '');
        return `${sLabel} → ${eLabel}`;
    }
    return `Last ${Number(daysBack) || 3} day(s)`;
}

const buildWorkHoursGeneratedEmailHtml = async ({ name, rangeLabel, generation }) => {
    const { bannerUrl } = await withEmailBanner({});
    const safeName = name ? String(name) : 'there';
    const safeRange = rangeLabel ? String(rangeLabel) : '';
    const updated = generation && typeof generation.updated === 'number' ? generation.updated : '';
    const employees = generation && typeof generation.employees === 'number' ? generation.employees : '';
    const days = generation && typeof generation.days === 'number' ? generation.days : '';

    return `
      <div style="font-family: Arial, sans-serif; background: #f6f7fb; padding: 24px;">
        <div style="max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e7ee;">
          <div style="background: #111827;">
            <img src="${bannerUrl}" alt="Vectorshades" style="width: 100%; max-height: 220px; object-fit: cover; display: block;" />
          </div>
          <div style="padding: 20px 24px;">
            <h2 style="margin: 0 0 8px 0; color: #111827;">Work hours generation completed</h2>
            <p style="margin: 0 0 16px 0; color: #374151; line-height: 1.5;">
              Hi ${safeName}, your work-hours logs have been generated for <strong>${safeRange}</strong>.
            </p>
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 16px 0;">
              <div style="border: 1px solid #e7e7ee; border-radius: 10px; padding: 12px;">
                <div style="font-size: 12px; color: #6b7280;">Employees</div>
                <div style="font-size: 18px; font-weight: 700; color: #111827;">${employees}</div>
              </div>
              <div style="border: 1px solid #e7e7ee; border-radius: 10px; padding: 12px;">
                <div style="font-size: 12px; color: #6b7280;">Days</div>
                <div style="font-size: 18px; font-weight: 700; color: #111827;">${days}</div>
              </div>
              <div style="border: 1px solid #e7e7ee; border-radius: 10px; padding: 12px;">
                <div style="font-size: 12px; color: #6b7280;">Updates</div>
                <div style="font-size: 18px; font-weight: 700; color: #111827;">${updated}</div>
              </div>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              If you didn’t request this, please contact the admin team.
            </p>
          </div>
        </div>
      </div>
    `;
}

const createReportController = async (req,res) => {
    const response = await createReports({...req.body,['createdBy']:req.headers.data.id})
        .then((data) => new reportResponse("report created successfully", { data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response) 
}

const getReportsController = async (req,res) => {
    const response = await getReports(req.query.page,req.headers.data.id)
        .then((data) => new reportResponse("reports fetched successfully", { data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response) 
}

const viewFileController = async (req,res) => {
    const response = await viewFileData(req.query.location)
        .then((data) => new reportResponse("file data fetched successfully", { data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response) 
}

const generateReportsController = async (req,res) => {
    const response = await generateCSVReport(req.body,req.headers.data)
        .then((data) => new reportResponse("reports created successfully", { data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response) 
}

const getReportKeysController = async (req,res) => {
    const response = await getReportKeys()
        .then((keys) => new reportResponse("reports keys fetched successfully", { keys }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response) 
}

const refreshReportsController = async (req,res) => {
    const response = await refreshReports(req.query.id)
        .then((data) => new reportResponse("reports refreshed successfully", { data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response) 
}

const deleteReportsController = async (req,res) => {
    const response = await deleteReports(req.query.id)
        .then((data) => new reportResponse("report deleted successfully", { data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response) 
}

const getTotalNumberOfReportsController = async (req,res) => {
    const response = await getTotalNumberOfReports(req.headers.data.id)
        .then((data) => new reportResponse("reports fetched successfully", { count:data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response) 
}

const generateCsvReportController = async (req,res) => {
    const response = await generateCsvReportFunction(req.body,req.headers.data.id)
        .then((data) => new reportResponse("reports generated successfully", { data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getCsvReportController = async (req,res) => {
    const response = await getCsvReportsFunction()
        .then((data) => new reportResponse("reports fetched successfully", { data }, false))
        .catch((err) => new reportResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const generateWorkHoursForEmployeeDayController = async (req, res) => {
    const employeeId = req.body && req.body.employeeId ? String(req.body.employeeId) : null;
    const date = req.body && req.body.date ? String(req.body.date) : null; // expected DD-MM-YYYY
    const concurrency = req.body && req.body.concurrency != null ? req.body.concurrency : 2;

    if (!employeeId || !date) {
        const response = new reportResponse("employeeId and date are required", null, true);
        return res.status(400).json(response);
    }

    const response = await logOutAllEmployees({
        startDate: date,
        endDate: date,
        concurrency,
        employeeIds: [employeeId],
        // Optional: pass through verification payload if present
        verifyWorkHours: req.body && req.body.verifyWorkHours ? req.body.verifyWorkHours : undefined
    })
        .then(async (generation) => new reportResponse("Work hours generated successfully", { generation }, false))
        .catch((err) => new reportResponse(err.message, null, true));

    res.status(response.failed ? 400 : 200).json(response);
}

const generateWorkHoursController = async (req, res) => {
    const user = req.headers && req.headers.data ? req.headers.data : {};
    const rangeLabel = formatRangeLabel({
        startDate: req.body && req.body.startDate,
        endDate: req.body && req.body.endDate,
        daysBack: req.body && req.body.daysBack
    });

    const response = await logOutAllEmployees(req.body)
        .then(async (generation) => {
            let email = { sent: false };
            try {
                if (user && user.email) {
                    const subject = `Work hours generated (${rangeLabel})`;
                    const html = await buildWorkHoursGeneratedEmailHtml({
                        name: user.name,
                        rangeLabel,
                        generation
                    });
                    const info = await sendEmail(user.email, subject, html);
                    email = { sent: true, messageId: info && info.messageId ? info.messageId : undefined };
                }
            } catch (e) {
                email = { sent: false, error: e && e.message ? e.message : String(e) };
            }
            return new reportResponse("Work hours generated successfully", { generation, email }, false);
        })
        .catch((err) => new reportResponse(err.message, null, true));

    res.status(response.failed ? 400 : 200).json(response);
}

module.exports = {
    createReportController,
    getReportsController,
    refreshReportsController,
    deleteReportsController,
    getReportKeysController,
    getTotalNumberOfReportsController,
    generateCsvReportController,
    getCsvReportController,
    generateReportsController,
    viewFileController,
    generateWorkHoursController,
    generateWorkHoursForEmployeeDayController
}