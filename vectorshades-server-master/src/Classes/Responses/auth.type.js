class authResponse {
    constructor(message , response , validated) {
        this.message = message
        this.response = response 
        this.validated = validated
        this.code = 0
    }
}

module.exports = authResponse