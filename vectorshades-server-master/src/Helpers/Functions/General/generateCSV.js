const {writeFileSync} = require("fs");

async function generateCSV(model) {
    const data = await model.find({}); // Fetch all documents from the collection

    if (!data || data.length === 0) {
        return;
    }

    const keys = Object.keys(data[0]._doc); // Get keys from the first document
    const csvContent = [keys.join(',')]; // Add headers to the CSV content

    data.forEach(doc => {
        const values = keys.map(key => {
            const value = doc._doc[key];

            if (value instanceof Date) {
                return new Date(value).toLocaleDateString().replaceAll(",","-")
            } else if (typeof value === 'object') {
                return "{}"; // Convert objects to strings
            }else if(typeof value ==='string'){
                return value.replace(/(\r\n|\n|\r)/gm, " ").replaceAll(",","-")
            } else {
                return value
            }
        });

        csvContent.push(values.join(','));
    });

    return csvContent.join('\n')
}


function formatDate(date) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return date.toLocaleDateString(undefined, options);
}

module.exports = generateCSV;