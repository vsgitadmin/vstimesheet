class TrainingResponse {
  constructor (message, response, ok) {
    this.message = message;
    this.response = response;
    this.ok = ok;
  }
}

module.exports = TrainingResponse;