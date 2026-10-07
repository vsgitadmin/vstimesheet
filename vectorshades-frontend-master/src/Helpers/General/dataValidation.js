function validateCreateEmployeeBody(actualBody) {
  const reference = {
    firstName: "<firstName>",
    lastName: "<lastName>",
    age: "<age>",
    gender: "<gender>",
    location: "<location>",
    city: "<city>",
    designation: "<designation>",
    department: "<department>",
    startTime: "<startTime>",
    endTime: "<endTime>",
    uid: "<uid>",
    role: "<role>",
    joining: "<joining>",
    personalEmail: "email@example.com",
    email: "email@example.com",
    aadhar: "<aadhar>",
    pan: "<pan>",
    salary: "<salary>",
    experience: "<experience>",
    basicDetails: {
      city: "<city>",
      gender: "<gender>",
      designation: "<designation>",
      department: "<department>",
      startTime: "<startTime>",
      endTime: "<endTime>",
      age: "<age>",
      pan: "<pan>",
      aadhar: "<aadhar>",
      salary: "<salary>",
      experience: "<experience>",
      uid: "<uid>",
      leavetypes: ["EL", "PL", "OD", "COMP_1"]
    }
  };

  function findMissing(expected, actual, prefix = "") {
    const missing = [];
    if (expected !== null && typeof expected === "object" && !Array.isArray(expected)) {
      for (const key of Object.keys(expected)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (
          actual === null ||
          typeof actual !== "object" ||
          !(key in actual) ||
          actual[key] === undefined ||
          actual[key] === null ||
          (typeof actual[key] === "string" && actual[key].trim() === "")
        ) {
          missing.push(path);
          continue;
        }
        const expVal = expected[key];
        const actVal = actual[key];
        if (expVal !== null && typeof expVal === "object" && !Array.isArray(expVal)) {
          missing.push(...findMissing(expVal, actVal, path));
        } else if (Array.isArray(expVal)) {
          if (!Array.isArray(actVal)) missing.push(path);
        }
      }
    }
    return missing;
  }

  const missing = findMissing(reference, actualBody);
  if (missing.length === 0) return { valid: true };
  return { valid: false, missing, message: `Invalid data: missing fields -> ${missing.join(", ")}` };
}


module.exports = {
    validateCreateEmployeeBody
}