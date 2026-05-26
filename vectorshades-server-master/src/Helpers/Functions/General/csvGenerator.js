const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

const generateCSVFile = (csvData, filePath) => {

    csvData = csvData.map(({ _id, ...rest }) => rest);
    const header = csvData.length > 0 ? Object.keys(csvData[0]) : [];
    const obj = {};
    header.forEach(key => {
        obj[key] = key;
    });
    csvData.unshift(obj);
    const writer = createObjectCsvWriter({
        path: path.resolve(filePath),
        header,
        fieldDelimiter: ',',
        recordDelimiter: '\n',
    });

    // Write data to the CSV file using the writer object
    writer.writeRecords(csvData)
        .then(() => { })
        .catch((err) => {
            console.error(err);
        });
};

module.exports = generateCSVFile;


