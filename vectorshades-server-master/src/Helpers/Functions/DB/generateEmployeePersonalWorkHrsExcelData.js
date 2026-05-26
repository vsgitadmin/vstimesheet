function generateProductionHoursExcelDataFromValidated(timesheetData) {
    if (!timesheetData || !timesheetData.activities || timesheetData.activities.length === 0) {
        return [];
    }

    const rows = [];
    
    // Extract all unique dates from all activities
    const allDates = new Set();
    timesheetData.activities.forEach(activity => {
        activity.entries.forEach(entry => {
            if (entry.date) {
                allDates.add(entry.date);
            }
        });
    });
    
    const sortedDates = Array.from(allDates).sort();
    const dateHeaders = sortedDates.map(date => {
        return new Date(date).toLocaleDateString("en-GB").split("/").join("-");
    });

    // Prepare headers
    const headers = [
        "ID",
        "Name",
        "Project",
        "Activity Code",
        "Activity Name",
        "Is Billable",
        ...dateHeaders,
        "Total"
    ];
    rows.push(headers);

    // Process each activity
    timesheetData.activities.forEach(activity => {
        const row = [
            timesheetData.employeeId,
            timesheetData.employeeName,
            timesheetData.projectName,
            activity.activityCode,
            activity.activityName,
            activity.isBillable
        ];

        let totalHours = 0;
        
        // Add hours for each date
        sortedDates.forEach(date => {
            const entry = activity.entries.find(e => e.date === date);
            const hours = entry ? Number(entry.hours.toFixed(2)) : 0;
            row.push(hours);
            totalHours += hours;
        });

        // Add total
        row.push(Number(totalHours.toFixed(2)));
        rows.push(row);
    });

    // Add totals row
    const totalsRow = new Array(6).fill(""); // Empty cells for first 6 columns
    totalsRow.push("TOTALS");
    
    const dateTotals = new Array(sortedDates.length).fill(0);
    
    // Calculate totals for each date
    timesheetData.activities.forEach(activity => {
        activity.entries.forEach(entry => {
            const dateIndex = sortedDates.indexOf(entry.date);
            if (dateIndex >= 0) {
                dateTotals[dateIndex] += entry.hours || 0;
            }
        });
    });
    
    // Add date totals and grand total
    dateTotals.forEach(total => {
        totalsRow.push(Number(total.toFixed(2)));
    });
    totalsRow.push(Number(dateTotals.reduce((sum, val) => sum + val, 0).toFixed(2)));
    
    rows.push(totalsRow);

    return rows;
}

module.exports = generateProductionHoursExcelDataFromValidated;
