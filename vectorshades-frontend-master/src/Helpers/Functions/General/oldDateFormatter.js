
const oldDateFormatter = (dateString) => {
    if(!dateString) return `00-00-00`
    const date = new Date(`${dateString.slice(0, -1)}+00:00`);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

export default oldDateFormatter