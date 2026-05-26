const { employeeModel, employeeLogsModel } = require("../../../Models/Employee");

async function runEmployeeLogs(employees, { date = new Date(), useLocalDate = true } = {}) {
  if (!Array.isArray(employees) || employees.length === 0) {
    return { logsUpdated: 0, saves: 0, logouts: 0, errors: [] };
  }

  const d = new Date(date);
  const logDate = useLocalDate ? d.toLocaleDateString("en-CA") : d.toISOString().split("T")[0];

  const toInt = (v) => {
    const n = Number.parseInt(v ?? 0, 10);
    return Number.isFinite(n) ? n : 0;
  };

  const bulkOps = [];
  const savePromises = [];
  const errors = [];

  for (const emp of employees) {
    const employeeId = emp && (emp._id ?? emp.id);
    if (employeeId === undefined || employeeId === null) {
      errors.push({ type: "missing_id", emp });
      continue;
    }

    const loginMinutes = toInt(emp.todayLoged ?? emp.todayLogged ?? emp.loginMinutes);
    const taskMinutes = toInt(emp.taskTime);

    bulkOps.push({
      updateOne: {
        filter: { employeeId, logDate },
        update: { $set: { loginMinutes, taskMinutes } },
        upsert: true,
      },
    });

    try {
      if (typeof emp === "object") {
        emp.loginTime = 0;
        emp.todayLoged = 0;
        emp.online = false;
        emp.taskTime = 0;
      }

      if (typeof emp.save === "function") {
        savePromises.push(emp.save().catch((err) => ({ error: err, id: employeeId })));
      } else if (typeof employeeModel !== "undefined" && employeeModel.updateOne) {
        savePromises.push(
          employeeModel
            .updateOne(
              { _id: employeeId },
              { $set: { loginTime: 0, todayLoged: 0, online: false, taskTime: 0 } }
            )
            .catch((err) => ({ error: err, id: employeeId }))
        );
      } else {
        savePromises.push(Promise.resolve({ skipped: true, id: employeeId }));
      }
    } catch (err) {
      errors.push({ type: "reset_failed", id: employeeId, error: err });
    }
  }

  if (bulkOps.length > 0) {
    try {
      await employeeLogsModel.bulkWrite(bulkOps);
    } catch (err) {
      errors.push({ type: "bulkWrite_failed", error: err });
    }
  }

  const saveResults = savePromises.length ? await Promise.allSettled(savePromises) : [];
  let savesOk = 0;
  for (const r of saveResults) {
    if (r.status === "fulfilled") {
      const val = r.value;
      if (val && val.error) {
        errors.push({ type: "save_op_error", detail: val });
      } else {
        savesOk++;
      }
    } else {
      errors.push({ type: "save_rejected", reason: r.reason });
    }
  }

  return {
    logDate,
    logsUpdated: bulkOps.length,
    saves: savesOk,
    logouts: 0,
    errors,
  };
}

module.exports = runEmployeeLogs;
