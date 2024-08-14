
const {SuccessResponse} = require('../core/success.response')
const { newTemplate } = require('../services/template.services')
class EmailController {
    newTemplate = async (req, res, next) => {
        return new SuccessResponse({
            message: 'New Template Created',
            metadata: await newTemplate(req.body)
        }).send(res)
    }
}
module.exports = new EmailController()