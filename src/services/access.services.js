const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const { log } = require("console")
const crypto = require('crypto')
const {KeyTokenServices} = require("./keyToken.services")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailueError, ForbiddenError } = require("../core/error.response")
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
    static handlerRefreshToken = async (refreshToken) => {
        // check refreshToken was used
        const refreshTokenUsed = await KeyTokenServices.findByRefreshTokenUsed(refreshToken);
        console.log("🚀 ~ AccessService ~ handlerRefreshToken= ~ refreshTokenUsed:", refreshTokenUsed)
        if (refreshTokenUsed) {
            const {userId, email } = await verifyJWT(refreshToken, refreshTokenUsed.privateKey);
            console.log("🚀 ~ AccessService ~ handlerRefreshToken= ~ email:", email)
            console.log("🚀 ~ AccessService ~ handlerRefreshToken= ~ userId:", userId)
            await KeyTokenServices.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened! Pls re-login')
        }

        const holderToken = await KeyTokenServices.findByRefreshToken(refreshToken);
        console.log("🚀 ~ AccessService ~ handlerRefreshToken= ~ holderToken:", holderToken)
        if (!holderToken) {
            throw new AuthFailueError('Shop not registered')
        }
        const {userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        
        const foundShop = findByEmail({email});
        console.log("🚀 ~ AccessService ~ handlerRefreshToken= ~ foundShop:", foundShop)
        if (!foundShop) {
            throw new AuthFailueError('Shop not registered')
        }
        // create new pair tokens
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey);
        console.log("🚀 ~ AccessService ~ handlerRefreshToken= ~ tokens:", tokens)
        // update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })
        return {
            user: { userId, email},
            tokens
        }
    }

    static login = async ({email, password, refreshToken = {}}) => {

        const foundShop = await findByEmail({ email });
        
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!')
        }

        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailueError('Password incorrect!')
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
    static logout = async ({keyStore}) => {
        return await KeyTokenServices.removeKeyById(keyStore._id)
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
                    throw new BadRequestError('Create keyStore error!');
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