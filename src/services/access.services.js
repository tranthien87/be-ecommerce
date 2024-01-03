const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const { log } = require("console")
const crypto = require('crypto')
const KeyTokenServices = require("./keyToken.services")
const { createTokenPair } = require("../auth/authUtils")

const rolesShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {

    static signUp = async ({name, email, password}) => {
        
        try {
            // step 1: check email is exit
            const holderShop = await shopModel.findOne({ email }).lean();
            console.log("🚀 ~ file: access.services.js:21 ~ AccessService ~ signUp= ~ holderShop:", holderShop)
        
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already register'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({name, email, password: passwordHash, roles: [rolesShop.SHOP]})

            if (newShop) {
                // generare private key and public keys
                const { privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem',
                      },
                      privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem',

                      },
                })
                // save collection keystore
                console.log("🚀 ~ file: access.services.js:37 ~ AccessService ~ signUp= ~ privateKey, publicKey:", privateKey, publicKey)

                const publicKeyString = await KeyTokenServices.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })
                console.log("🚀 ~ file: access.services.js:43 ~ AccessService ~ signUp= ~ publicKeyString:", publicKeyString)
               
                if (!publicKeyString) {
                    return  {
                        code: 'xxx',
                        message: 'Public key string error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // create token pair
                const tokens = await createTokenPair({userId: (await newShop)._id, email}, publicKeyObject, privateKey)
                console.log("🚀 ~ file: access.services.js:50 ~ AccessService ~ signUp= ~ tokens:", tokens)

                return {
                    code: 201, // created new instance --- code 201
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }
                
            }

            return {
                code: 200, // error--- code 201
                metadata: null
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