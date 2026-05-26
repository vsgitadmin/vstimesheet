 const arrayDiff = ((array1,arrayy2) => {
   return array1.filter((data) => {
        const filtered = arrayy2.filter((new_data) => new_data.point == data.point)
        if (filtered.length == 0) return data.point
    })
})
module.exports=arrayDiff