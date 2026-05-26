class cloudResponse {
    constructor(message, response, failed) {
        this.message = message
        this.response = response
        this.failed = failed
    }
}
module.exports = cloudResponse