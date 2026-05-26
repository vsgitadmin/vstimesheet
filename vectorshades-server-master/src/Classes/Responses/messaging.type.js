class messagingResponse {
    constructor(message, response, failed,status) {
        this.message = message
        this.response = response
        this.failed = failed
        this.status = status
    }
}
module.exports = messagingResponse