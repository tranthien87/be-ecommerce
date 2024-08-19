const TEMPLATE = require('../models/template.model')
const { NotFoundError } = require('../core/error.response');
const { templateHtmlEmailToken } = require('../utils/template.html');


const newTemplate = async ({ temp_name }) => {
    // 1. check exit template
    // 2. create one template

    const template = await TEMPLATE.create({
        temp_name,
        temp_html: templateHtmlEmailToken()
    })
    return template;
}

const getTemplate = async ({temp_name}) => {
    const foundTemplate = await TEMPLATE.findOne({temp_name});
    if(!foundTemplate) {
        throw new NotFoundError("Temlate not fount !!")
    }
    return foundTemplate;
}


module.exports = {
    newTemplate,
    getTemplate
}