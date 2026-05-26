class CommunicationResponse{
    constructor(message,response,failed){
        this.message= message;
        this.response=response;
        this.failed=failed;
        this.code = 0
    }
}
module.exports=CommunicationResponse