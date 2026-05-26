
function fillOnboardingBody(actualBody = {}) {
  const reference = {
    photo_path: "",
    personal_details: {
      present_address: "",
      present_district: "",
      present_pin: "",
      present_state: "",
      present_residential_telephone: "",
      present_mobile_number: "",
      permanent_address: "",
      permanent_district: "",
      permanent_pin: "",
      permanent_state: "",
      permanent_residential_telephone: "",
      permanent_mobile_number: "",
      birth_city: "",
      DOB: "",
      NAB: "",
      NAP: "",
      is_dual_nationality: "",
      dual_nationality: "",
      passport_number: "",
      passport_place_of_issue: "",
      passport_date_of_issue: "",
      passport_date_of_expiry: "",
      pan_card_number: "",
      name_as_per_pan: "",
      aadhar_number: "",
      name_as_per_aadhar_number: "",
      gender: "",
      marital: "",
      blood_group: "",
      email: "",
      img: ""
    },
    family_details: {
      spouse: {},
      parents: [
        {
          full_name: "",
          relation: "",
          dob: "",
          phone: "",
          id: ""
        }
      ],
      parents_in_law: [],
      brothers_and_sisters: [
        {
          full_name: "",
          relation: "",
          dob: "",
          phone: "",
          id: ""
        }
      ],
      childrens: []
    },
    qualifications: [
      {
        institute: "",
        from: "",
        to: "",
        id: "",
        title: "",
        qualification: ""
      }
    ],
    other_certifications: [
      {
        certification_details: "",
        from: "",
        to: "",
        id: "",
        location: ""
      }
    ],
    employement_history: [
      {
        name_city_employer: "",
        from: "",
        to: "",
        position: "",
        gross_package: "",
        id: ""
      }
    ],
    references: [
      {
        name: "",
        address: "",
        telephone: "",
        email: "",
        id: "",
        fax: ""
      }
    ],
    emergency_contact_details: [
      {
        full_name: "",
        address: "",
        relationship: "",
        mobile_number: "",
        residence_tel: ""
      }
    ]
  };

  function isObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  function merge(ref, actual) {
    if (Array.isArray(ref)) {
      if (!Array.isArray(actual)) return [];
      const itemTemplate = ref[0];
      if (isObject(itemTemplate)) {
        return actual.map((it) => merge(itemTemplate, it || {}));
      } else {
        return actual.slice();
      }
    }

    if (isObject(ref)) {
      const result = {};
      const keys = new Set([
        ...Object.keys(ref),
        ...(isObject(actual) ? Object.keys(actual) : [])
      ]);
      for (const key of keys) {
        if (key in ref) {
          result[key] = merge(ref[key], isObject(actual) || Array.isArray(actual) ? actual[key] : actual?.[key]);
        } else {
          result[key] = actual ? actual[key] : "";
        }
      }
      return result;
    }

    // primitive in reference -> string default
    if (actual === undefined || actual === null || (typeof actual === "string" && actual.trim() === "")) {
      return "";
    }
    return actual;
  }

  return merge(reference, actualBody || {});
}

async function getWorkedSessionsForDay(dateStr, employeeId, taskId = null) {
  const { taskModel, taskActivityModel } = require("../../../Models/Projects");
  const [day, month, year] = dateStr.split('-').map(Number);
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  const query = {
    'createdBy.id': employeeId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  };

  if (taskId) {
    query.taskId = taskId;
  }


  const activities = await taskActivityModel.find(query).sort({
    taskId: 1,
    createdAt: 1,
  });

  // We need to handle a key edge case: a task can already be "In Progress" at the start of this day
  // (e.g., started yesterday evening, paused today). In that case, the first activity today might be
  // "Status Changed from In Progress to Paused" and we'd otherwise miss midnight -> pause time.
  const byTask = {};

  const statusRegex = /Status Changed from (.+?) to (.+?)(?: -|\s*$)/i;

  const relevantTaskIds = new Set();
  for (const activity of activities) {
    if (activity && activity.taskId) relevantTaskIds.add(activity.taskId.toString());
  }

  // If a specific taskId was requested, include it even if there are no in-day activities.
  if (taskId) relevantTaskIds.add(String(taskId));

  if (relevantTaskIds.size > 0) {
    const lastBeforeStart = await taskActivityModel.aggregate([
      {
        $match: {
          'createdBy.id': String(employeeId),
          taskId: { $in: Array.from(relevantTaskIds) },
          createdAt: { $lt: startOfDay },
          text: { $regex: statusRegex.source, $options: 'i' },
        },
      },
      { $sort: { taskId: 1, createdAt: -1 } },
      {
        $group: {
          _id: '$taskId',
          text: { $first: '$text' },
          createdAt: { $first: '$createdAt' },
          createdBy: { $first: '$createdBy' },
        },
      },
    ]);

    for (const doc of lastBeforeStart) {
      const tId = String(doc._id);
      const text = doc.text || '';
      const match = text.match(statusRegex);
      if (!match) continue;
      const toStatus = match[2] ? String(match[2]).trim() : '';

      if (!byTask[tId]) {
        byTask[tId] = {
          taskId: tId,
          workedMs: 0,
          startTime: null,
          endTime: null,
          currentStart: null,
          automaticLogout: false,
        };
      }

      // If the task was last moved INTO "In Progress" before this day started, then it is considered
      // in-progress at midnight; count from startOfDay until the next status change that moves out.
      if (toStatus === 'In Progress') {
        byTask[tId].currentStart = startOfDay;
        byTask[tId].startTime = startOfDay;
      }
    }
  }

  for (const activity of activities) {
    const tId = activity.taskId.toString();
    const text = activity.text || '';
    const createdAt = activity.createdAt;

    const match = text.match(statusRegex);
    if (!match) continue;

    const fromStatus = match[1].trim();
    const toStatus = match[2].trim();

    if (!byTask[tId]) {
      byTask[tId] = {
        taskId: tId,
        workedMs: 0,
        startTime: null,
        endTime: null,
        currentStart: null,
        automaticLogout: false,
      };
    }

    const taskInfo = byTask[tId];

    if (toStatus === 'In Progress') {
      if (!taskInfo.currentStart) {
        taskInfo.currentStart = createdAt;
        if (!taskInfo.startTime || createdAt < taskInfo.startTime) {
          taskInfo.startTime = createdAt;
        }
      }
    }

    if (fromStatus === 'In Progress' && taskInfo.currentStart) {
      const diffMs = createdAt.getTime() - taskInfo.currentStart.getTime();
      if (diffMs > 0) {
        taskInfo.workedMs += diffMs;
      }
      taskInfo.endTime = createdAt;
      taskInfo.currentStart = null;

      if (typeof activity.createdBy === 'string' && activity.createdBy === 'system-cron') {
        taskInfo.automaticLogout = true;
      }
    }
  }

  if (!Object.keys(byTask).length) return [];

  for (const tId of Object.keys(byTask)) {
    const taskInfo = byTask[tId];
    if (taskInfo.currentStart) {
      const diffMs = endOfDay.getTime() - taskInfo.currentStart.getTime();
      if (diffMs > 0) {
        taskInfo.workedMs += diffMs;
      }
      if (!taskInfo.endTime || endOfDay > taskInfo.endTime) {
        taskInfo.endTime = endOfDay;
      }
      taskInfo.currentStart = null;
    }
  }

  const taskIds = Object.keys(byTask);
  const tasks = await taskModel.find(
    { _id: { $in: taskIds } },
    { _id: 1, name: 1 }
  );
  const taskNameMap = tasks.reduce((acc, t) => {
    acc[t._id.toString()] = t.name;
    return acc;
  }, {});

  const result = Object.values(byTask)
    .filter(t => t.workedMs > 0)
    .map(t => ({
      name: taskNameMap[t.taskId] || '',
      taskId: t.taskId,
      workedTime: Number((t.workedMs / (1000 * 60 * 60)).toFixed(1)),
      startTime: t.startTime,
      endTime: t.endTime,
      automaticLogout: t.automaticLogout || false,
      date: dateStr,
    }));

  return result;
}



module.exports = {
  fillOnboardingBody,
  getWorkedSessionsForDay
}