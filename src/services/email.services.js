const {NotFoundError} = require('../core/error.response')
const transport = require('../dbs/init.nodemailer')
const {replacePlaceholder} = require('../utils');
const {newOtp} = require('./otp.services')
const {getTemplate} = require('./template.services')

const sendEmailLinkVerify =  ({
    html,
    toEmail,
    subject = 'Xac nhan email dang ki',
    text = 'Xac nhan ...'
}) => {
    try {
        const emailOptions = {
            form: '"SHOPDEV" <anonystick@gmail.com>',
            to: toEmail,
            subject,
            text
        }

        transport.sendMail(emailOptions, (error, info) => {
            if(error) {
                return console.log(error);
            }
            console.log('Email send successful', info)
        })
    } catch (error) {
        console.error(error);
        return error;
    }

}
const sendEmailToken = async ({email = null}) => {
    try {
        // 1. get opt token
        const token = await newOtp({ email });
        // 2. get template html
        const templateEmail = await getTemplate({
            temp_name: 'HTML EMAIL TOKEN'
        })

        if (!templateEmail) {
            throw new NotFoundError('email template not found')
        }
        // 3. Replace to holder

        const content = replacePlaceholder(
            templateEmail.temp_html, 
            {
                link_verify: `http://localhost:3056/cgp/welcome-back/${token}`
            }
        )
        // 4. send email
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'vui long xac nhan dia chi email dang ki shopdev',
        })
        return 1;

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    sendEmailToken
}