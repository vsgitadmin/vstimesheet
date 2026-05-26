const sendMail = require("../ThirdParty/email")

const sendEmployeeActivationReviewMail = (body) => {
    try{
        sendMail(body.mail,`VectorShades activation review request`,
        `
        <div style="width: 100%;height: 20rem;text-align: center;font-family: Arial, Helvetica, sans-serif;margin: 0;padding: 0;">
            <h1 >Dear ${body.name}</h1>
            <p>Kindly find the requested changes by the HR regarding the employee activation</p>
            <div>
              <h4>${body.message}</h4>
            </div>
          </div>
        </div>`
        )
        return true
    }catch(err) {throw err}
}

module.exports = sendEmployeeActivationReviewMail