const employees = require('./employee.json');
const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiI4aCIsImRhdGEiOnsiaWQiOiI4YTNkNDQzOC0wZWFhLTRhNzctYWNhZC1iNTA0OTU3OTljZmYiLCJlbWFpbCI6InR2c3JlZWpheWFAZ21haWwuY29tIiwicm9sZSI6IkhSIiwibmFtZSI6IlNyZWVqYXlhIFRWIn0sImlhdCI6MTczMDA5NzU3M30.D3VOFch92ZuPw8atf_wYbXy7HZRfoz_cI-EpetV-wp0'; // Replace with your actual token
const removeDuplicates = (employees) => {
  const uniqueEmployees = employees.reduce((acc, current) => {
    const x = acc.find(item => item['User principal name'] === current['User principal name']);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);
  return uniqueEmployees;
};
// Function to create employees
const createEmployees = async (employees) => {
  // Filter employees with "Need to create" remarks or no remarks
  const filteredEmployees = removeDuplicates(employees).slice(1)
  // Loop through each employee and send POST request
  for (let index = 0; index < filteredEmployees.length; index++) {
    const emp = filteredEmployees[index];

    // Generate UID dynamically
    const uid = `VS90${index + 1}`;

    // Create the employee object to be sent in the request
    const employeeData = {
      "firstName": emp["First name"],
      "email": emp["User principal name"],
      "role": emp.role || 'EMP', // Default role is 'EMP' if not provided
      "lastName": emp["Last name"],
      "working": true,
      "onBoarded": true,
      "designation": emp["Designation"],
      "department": "IT", // You can set department or use any dynamic value
      "personalEmail": emp["User principal name"],
      "pwd": "1234",
      "basicDetails": {
        "uid": uid,
        "city": "kochi",
        "gender": "female",
        "designation": emp["Designation"],
        "department": "Human Resources",
        "age": "20",
        "startTime": "09:00",
        "endTime": "17:00",
        "salary": 10000,
        "pan": "0000000",
        "aadhar": "12300000",
        "experience": "3"
      }
    };

    try {
      const response = await fetch('http://localhost:50000/employee/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`
        },
        body: JSON.stringify(employeeData)
      });

      if (response.status === 400) {
        const error = await response.json();
        console.error(`400 ${emp["User principal name"]} ${error.message}`);
      } else if (response.status === 200) {
        console.log(`200 ${emp["User principal name"]} created`);
      }
    } catch (err) {
      console.error(`Error creating employee ${emp["User principal name"]}: ${err.message}`);
    }
  }
};

// Call the function to create employees
createEmployees(employees);
