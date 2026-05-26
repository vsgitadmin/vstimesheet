import nodemailer from 'nodemailer';

const EMAIL = 'vsconsole@vectorshades.com';
const EMAIL_PASSWORD = 'a2VzFV84a((#ABx'; // Consider securing this

const sendEmail = (to, subject, html) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `"Vectorshades Management" <${EMAIL}>`,
            to,
            subject,
            html
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    });
};

export const handler = async (event) => {
    let body;

    try {
        body = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid JSON in request body' })
        };
    }

    const { to, subject, html } = body;

    if (!to || !subject || !html) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required fields: to, subject, html' })
        };
    }

    try {
        const result = await sendEmail(to, subject, html);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully', result })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Email sending failed', error: error.message })
        };
    }
};
