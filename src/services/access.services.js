const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const { log } = require("console")
const crypto = require('crypto')
const KeyTokenServices = require("./keyToken.services")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError } = require("../core/error.response")

const rolesShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {

    static signUp = async ({name, email, password}) => {
        
        // try {
            // step 1: check email is exit
            const holderShop = await shopModel.findOne({ email }).lean();
        
            if (holderShop) {
               throw new BadRequestError('Error: Shop already exited!')
            }
            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({name, email, password: passwordHash, roles: [rolesShop.SHOP]})

            if (newShop) {
                // generare private key and public keys
                // const { privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'spki',
                //         format: 'pem',
                //       },
                //       privateKeyEncoding: {
                //         type: 'pkcs8',
                //         format: 'pem',

                //       },
                // })
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                // save collection keystore

                const keyStore = await KeyTokenServices.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
               
                if (!keyStore) {
                    return  {
                        code: 'xxx',
                        message: 'keyStore error'
                    }
                }

                // create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

                return {
                    code: 201, // created new instance --- code 201
                    metadata: {
                        shop: getInfoData({object: newShop, fields: ['_id', 'name', 'email']}),
                        tokens
                    }
                }
                
            }

            return {
                code: 200, // error--- code 201
                metadata: null
            }
            
            
        // } catch (error) {
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: error

        //     }
        // }
    }
}
module.exports = AccessService