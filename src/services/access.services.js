const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const { log } = require("console")
const crypto = require('crypto')
const KeyTokenServices = require("./keyToken.services")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailueError } = require("../core/error.response")
const { SuccessResponse, CREATED, OK } = require("../core/success.response")
const { findByEmail } = require("./shop.services")
const { StatusCodes } = require("http-status-codes")

const rolesShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {

    static login = async ({email, password, refreshToken = {}}) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!')
        }

        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailueError('Authentication error!')
        }
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey);
        await KeyTokenServices.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })

        return {
            shop: getInfoData({object: foundShop, fields: ['_id', 'name', 'email']}),
            tokens
        }
    }

    static signUp = async ({name, email, password}) => {
        
            // step 1: check email is exit
            const holderShop = await shopModel.findOne({ email }).lean();
        
            if (holderShop) {
               throw new BadRequestError('Error: Shop already exited!', StatusCodes.CONFLICT)
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
                    throw new BadRequestError('Error: keyStore error!')
                    // return  {
                    //     code: 'xxx',
                    //     message: 'keyStore error'
                    // }
                }

                // create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey);

                return {
                    shop: getInfoData({object: newShop, fields: ['_id', 'name', 'email']}),
                    tokens
                }
                // return new CREATED({
                //     message: 'Created!',
                //     statusCode: 201,
                //     metadata: {
                //         shop: getInfoData({object: newShop, fields: ['_id', 'name', 'email']}),
                //         tokens
                //     }
                // })
                
            }

            return {
                code: 200, // error--- code 201
                metadata: null
            }

          
            
    }
}
module.exports = AccessService