const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//     service:'hotmail',
//     auth:{
//         user:"vsmanagement.dev@outlook.com",
//         pass:"Devtest123!"
//     }
// })

const sendEmail = async (to,title,html) => {
    // const options = {
    //     from:"vsmanagement.dev@outlook.com",
    //     to:to,
    //     subject:title,
    //     html:html
    // }
    // const email = await transporter.sendMail(options)
    // return email.response
    return null
}

module.exports = sendEmail