const { ErrorResponse, BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const {sendEmailToken}  = require('../services/email.services')
const USER = require('../models/user.model');
const { log } = require('winston');
const { checkTokenLogin } = require('./otp.services');
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const { createUser } = require('../models/repositories/user.repo');
const { getInfoData } = require("../utils");
const { createTokenPair } = require('../auth/authUtils');
const { KeyTokenServices } = require('./keyToken.services');

const createNewUSer = async ({
    email = null, 
    captcha = null
}) => {
    // 1. Check email exits in dbs
    const user = await USER.findOne({email}).lean()

    // 2. If user exits

    if(user) {
        return  ErrorResponse("User already exits !");
    }

    // 3. send token via email to user
    const result = await sendEmailToken({email})
   
    return {
        message: 'Verify email user',
        metadata: result
    }

}

const checkLoginEmailTokenServices = async ({
    token
}) => {
    try {
        const {opt_email: email, opt_token } = await checkTokenLogin({token});
        if(!email) throw new ErrorResponse('Email not found')
        
        const user = await USER.findOne({usr_email: email}).lean();
        if(user) throw new ErrorResponse('Email already exit.');

        // registry new user
        const passwordHash = await bcrypt.hash(email, 10)
        /***
         *  usr_id: { type: Number, require: true},
            usr_slug: { type: String, require: true},
            usr_name: {type: String, default: ''},
            usr_password: { type: String, default: ''},
            usr_salf: {type: String, default: ''},
            usr_email: { type: String, require: true},
            usr_phone: {type: String, default: ''},
            usr_sex: {type: String, default: ''},
            usr_avata: { type: String, default: ''},
            usr_date_of_birth: {type: Date, default: null},
            usr_role: { type: Schema.Types.ObjectId, ref: 'Role'},
            usr_status: {
                type: String, enum: ['pending', 'block', 'active'], default: 'pending'
            } 
         */
        const newUser = await createUser({
            usr_id: 1,
            usr_slug: 'a-b-c',
            usr_name: email,
            usr_email: email,
            usr_password: passwordHash,
            usr_role: '66729b590352bac26afcb081'
        })

        if (newUser) {
               
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                // save collection keystore

                const keyStore = await KeyTokenServices.createKeyToken({
                    userId: newUser.usr_id,
                    publicKey,
                    privateKey
                })
               
                if (!keyStore) {
                    throw new BadRequestError('Create keyStore error!');
                }

                // create token pair
                const tokens = await createTokenPair({userId: newUser._id, email}, publicKey, privateKey);

                return {
                    user: getInfoData({object: newUser, fields: ['usr_id', 'usr_name', 'usr_email']}),
                    tokens
                }
                
        }
    } catch (error) {
        throw new Error(error)
    }

}


module.exports = {
    createNewUSer,
    checkLoginEmailTokenServices
}