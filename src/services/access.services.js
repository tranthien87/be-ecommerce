const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const { log } = require("console")
const crypto = require('crypto')

const rolesShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {

    static signUp = async (email, password, name) => {
        try {
            // step 1: check email is exit
            const holderShop = shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already register'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = shopModel.create({name, email, passwordHash, roles: [rolesShop.SHOP]})

            if (newShop) {
                // generare private key and public keys
                const { privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })
                console.log({ privateKey, publicKey}); // save collection keystore
            }
            
            
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: error

            }
        }
    }
}
module.exports = AccessService