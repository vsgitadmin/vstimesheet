const getCommonKeys=((array1,arrayy2)=>{
    return array1.filter((data)=>arrayy2.some((data2=>data2.point==data.point)))
})
module.exports=getCommonKeys