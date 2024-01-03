'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenServices {
    
    static createKeyToken = async ({ userId, publicKey }) => {
       try {
        const publicKeyString = publicKey.toString();
        console.log("🚀 ~ file: keyToken.services.js:10 ~ KeyTokenServices ~ createKeyToken= ~ publicKeyString:", publicKeyString)
        const tokens = await keytokenModel.create({
            user: userId,
            publicKey: publicKeyString
        })
        return tokens ? tokens.publicKey : null

       } catch (error) {
        return error
       }
    }
}

module.exports = KeyTokenServices