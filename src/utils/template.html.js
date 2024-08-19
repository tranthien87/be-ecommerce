
const Mailgen = require('mailgen');


const templateHtmlEmailToken = () => {

    const mailGenerator = new Mailgen({
        theme: 'salted',
        product: {
            // Appears in header & footer of e-mails
            name: 'ShopDev',
            link: 'https://mailgen.js/'
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    });
    const email = {
        body: {
            greeting: 'Dear',
            name: `{{email}}`,
            intro: 'Welcome to Shop Dev! We\'re very excited to have you on board.',
            action: {
                instructions: 'Click here to confim your email',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your email',
                    link: `{{link_verify}}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    const emailBody = mailGenerator.generate(email);
    
    return emailBody;
}

module.exports = {
    templateHtmlEmailToken
}