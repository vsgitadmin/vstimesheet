const extractKeys = (form,keys) => {
    let obj = {}
    keys.forEach(key => {
        obj[`${key}`] = form.target[key].value
    });
    return obj
}

module.exports = extractKeys