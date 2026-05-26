const { employeeModel } = require('../../../Models/Employee');
const { timesheet: { timeSheetActivityModel } } = require('../../../Models/Extractor/index');
const { getWorkedSessionsForDay } = require('../General/data');

const pad2 = (n) => String(n).padStart(2, '0');

const parseDdMmYyyy = (value) => {
  if (value instanceof Date) return value;
  if (typeof value !== 'string') return undefined;
  const match = value.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return undefined;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!day || !month || !year) return undefined;
  return new Date(year, month - 1, day);
};

const parseDateMaybe = (value) => {
  const asDdMmYyyy = parseDdMmYyyy(value);
  if (asDdMmYyyy) return asDdMmYyyy;

  if (value instanceof Date) return value;
  if (typeof value !== 'string') return undefined;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
};

const buildDateStrings = ({ startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const dateStrings = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = pad2(d.getDate());
    const month = pad2(d.getMonth() + 1);
    const year = d.getFullYear();
    dateStrings.push(`${day}-${month}-${year}`);
  }
  return dateStrings;
};

/**
 * Generates worked-hours logs for active employees for a given date range.
 *
 * @param {object} options
 * @param {Date|string} [options.startDate]
 * @param {Date|string} [options.endDate]
 * @param {number} [options.daysBack=3]
 * @param {number} [options.concurrency=1]
 * @param {string[]|string} [options.employeeIds] - limit generation to specific employees
 * @returns {Promise<{ updated: number, employees: number, days: number, dateStrings: string[] }>}
 */
async function generateWorkHours({ startDate, endDate, daysBack = 3, concurrency = 1, employeeIds } = {}) {
  const now = endDate ? parseDateMaybe(endDate) : new Date();
  const end = now instanceof Date && !Number.isNaN(now.getTime()) ? now : new Date();

  const start =
    startDate ? parseDateMaybe(startDate) : new Date(end.getFullYear(), end.getMonth(), end.getDate() - (Number(daysBack) - 1));

  const dateStrings = buildDateStrings({ startDate: start, endDate: end });
  let empIds;
  if (employeeIds) {
    empIds = (Array.isArray(employeeIds) ? employeeIds : [employeeIds]).map((id) => String(id));
  } else {
    const employees = await employeeModel.find({ active: true }).select('_id').lean();
    empIds = employees.map((e) => e._id.toString());
  }

  let updated = 0;

  const safeConcurrency = Math.max(1, Number(concurrency) || 1);
  for (let i = 0; i < empIds.length; i += safeConcurrency) {
    const chunk = empIds.slice(i, i + safeConcurrency);

    // Important: do not mutate a shared `updated` counter inside concurrent async work.
    // Return a per-employee count and sum after Promise.all completes.
    const counts = await Promise.all(
      chunk.map(async (employeeId) => {
        let localUpdated = 0;
        for (const dateStr of dateStrings) {
          const logs = await getWorkedSessionsForDay(dateStr, employeeId);
          await timeSheetActivityModel.updateOne(
            { date: dateStr, employeeId },
            { $set: { logs } },
            { upsert: true }
          );
          localUpdated += 1;
        }
        return localUpdated;
      })
    );

    updated += counts.reduce((sum, n) => sum + n, 0);
  }

  return { updated, employees: empIds.length, days: dateStrings.length, dateStrings };
}

module.exports = { generateWorkHours };

