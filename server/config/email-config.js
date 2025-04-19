import nodemailer from 'nodemailer';

function getTransporter() {
    const environment = process.env.NODE_ENV || 'production';
    const isTest = environment === 'test';

    let mailConfig;
    if (!isTest) {
        mailConfig = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        };
    } else {
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.TEST_EMAIL,
                pass: process.env.TEST_EMAIL_PASS,
            },
        };
    }

    return nodemailer.createTransport(mailConfig);
}

export default getTransporter;
