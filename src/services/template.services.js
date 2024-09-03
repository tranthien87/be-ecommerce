const TEMPLATE = require('../models/template.model');
const { NotFoundError } = require('../core/error.response');
const { templateHtmlEmailToken } = require('../utils/template.html');

const newTemplate = async ({ temp_name }) => {
    // Check if the template already exists
    const existingTemplate = await TEMPLATE.findOne({ temp_name });
    if (existingTemplate) {
        throw new Error('Template already exists');
    }

    // Create a new template
    const template = await TEMPLATE.create({
        temp_name,
        temp_html: templateHtmlEmailToken()
    });

    return template;
};

const getTemplate = async ({ temp_name }) => {
    const foundTemplate = await TEMPLATE.findOne({ temp_name });
    if (!foundTemplate) {
        throw new NotFoundError('Template not found');
    }
    return foundTemplate;
};

module.exports = {
    newTemplate,
    getTemplate
};