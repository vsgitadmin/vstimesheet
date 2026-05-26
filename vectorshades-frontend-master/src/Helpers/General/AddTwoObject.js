const sumTwoObjects = (obj1,obj2,keys) => {
    let filteredObj1 = {}
    let filteredObj2 = {}
    keys.forEach(key => filteredObj1[key] = obj1[key])
    keys.forEach(key => filteredObj2[key] = obj2[key])
    let newObj = Object.keys(filteredObj1).reduce((a, k) => {
        a[k] = Number(filteredObj1[k]) + Number(filteredObj2[k]);
        return a;
    }, {});

    return newObj
}

module.exports = sumTwoObjects

