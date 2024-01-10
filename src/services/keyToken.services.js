'use strict'

const { filter } = require("lodash");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenServices {
    
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
       try {
        // level 0
        // const tokens = await keytokenModel.create({
        //     user: userId,
        //     publicKey, 
        //     privateKey
        // })
        // return tokens ? tokens.publicKey : null

        // level xxx
        const filter = {
            user: userId
        };
        const update = {
            publicKey,
            privateKey,
            refreshTokenUsed: [],
            refreshToken
        }
        const options = {
            upsert: true, new: true
        }
        const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

        return tokens ? tokens.publicKey : null;

       } catch (error) {
        return error
       }
    }
}

module.exports = KeyTokenServices