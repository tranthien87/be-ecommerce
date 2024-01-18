'use strict'

const { filter } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

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

    static findByUserId = async (userId) => {
        return keytokenModel.findOne({ user: new Types.ObjectId(userId)});
    }

    static removeKeyById = async (userId) => {
        const result = await keytokenModel.deleteOne({ _id: new Types.ObjectId(userId)})
        return result
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokenUsed: refreshToken}).lean();
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken});
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({user: new Types.ObjectId(userId)})

    }
}

module.exports = {KeyTokenServices}