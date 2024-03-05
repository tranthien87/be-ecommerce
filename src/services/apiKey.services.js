const apiKeyModel = require("../models/apiKey.model")
const crypto = require('crypto')

const findApiKey = async (key) => {
    // create new apiKey 
    // const newkey = await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] });
    // console.log(newkey);
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
}

module.exports = {
    findApiKey
}