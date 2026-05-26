
const generateJobCSV = async (job,csv) => {
    const fs = require('fs');
    

    fs.access(`public/reports/jobs/${job._id}`, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdir(`public/reports/jobs/${job._id}`, (err) => {
                if (err) throw err;
            });
        }
    });

    setTimeout(() => {
            fs.access(`public/reports/jobs/${job._id}`, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.writeFileSync(`public/reports/jobs/${job._id}/${job.project.trim()}.xlsx`, csv, 'utf8');
        }
    });
    }, 500);


    return `public/reports/jobs/${job._id}/${job.project.trim()}.xlsx`
}

module.exports = generateJobCSV;