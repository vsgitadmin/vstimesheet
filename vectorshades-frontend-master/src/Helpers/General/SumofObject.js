const sumOfArrayObjects = (array,keys) => {
    let obj = {}
    keys.forEach(key => obj[key] = 0)
    Object.keys(obj).forEach((key) => {
        const sum = array.reduce((prev,next) => prev +  Number(next[key]),0);
        obj[key] = sum;
    })
    return obj;
}

module.exports = sumOfArrayObjects