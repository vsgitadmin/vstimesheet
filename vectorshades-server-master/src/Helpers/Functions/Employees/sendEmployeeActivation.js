const sendMail = require("../ThirdParty/email")
const BACKEND_URL = process.env.BACKEND_URL
const sendEmployeeActivationMail = (body) => {
    const html =
        `
  <div style="width: 100%;height: 20rem;text-align: center;font-family: Arial, Helvetica, sans-serif;margin: 0;padding: 0;">
      <h1 >Welcome to the team ${body.firstName}</h1>
      <p>Kindly find the credential and activation link to login the dashboard</p>
      <div>
        <h4>Email : ${body.email}</h4>
        <h4>Password : ${body.pwd}</h4>
      </div>
      <a href="${BACKEND_URL || 'http://localhost:50000/'}activation?id=${body.activation}" style="margin: 0; padding: 0; border: none; color: white;background: #e64848;border-radius: 20px;text-decoration: none;padding: 15px;padding-bottom: 9px;padding-top: 9px;cursor: pointer;" href="/index.html">Activation Link</a>
    </div>
  </div>

    `
    try {
        sendMail(body.personalEmail, `VectorShades Onboarding request`,html)
        return true
    } catch (err) { console.log(err) }
}

module.exports = sendEmployeeActivationMail