
const createJobActivity = async(model,body)=>{
    try{
        const jobActivity = new model(body).save()
        return jobActivity
    }catch(err){
        console.log(err);
        throw err
    }
}
module.exports={createJobActivity}