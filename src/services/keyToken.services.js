'use strict'

const keytokenModel = require("../models/keytoken.model");

class keyTokenServices {
    static createKeyToken = async ({ userId, publicKey }) => {
       try {
        const puclicKeyString = publicKey.toString();
        const tokens = await keytokenModel.create({
            user: userId,
            publicKey: puclicKeyString
        })
        return tokens ? puclicKeyString : null

       } catch (error) {
        return error
       }
    }
}