const {NotFoundError} = require('../core/error.response')
const transport = require('../dbs/init.nodemailer')
const {replacePlaceholder} = require('../utils');
const {newOtp} = require('./otp.services')
const {getTemplate} = require('./template.services')

const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject
}) => {
    try {
        
        const emailOptions = {
            form: process.env.EMAIL,
            to: toEmail,
            subject,
            html
        }

        const info = await transport.sendMail(emailOptions);
       
        return info;
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
                link_verify: `http://localhost:3056/cgp/welcome-back/${token.opt_token}`,
                email
            }
        )
        // 4. send email
        const info = await sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Registry email confirm from ShopDev',
        })

        return info;

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    sendEmailToken
}