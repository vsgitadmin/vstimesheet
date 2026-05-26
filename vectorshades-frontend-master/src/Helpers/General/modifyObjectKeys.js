const modifyObjectKeys = (object,key,value) => {
    let obj = object
    obj[key] = value
    return obj
}

module.exports = modifyObjectKeys