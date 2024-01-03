'use strict'

const jwt = require('jsonwebtoken')


const createTokenPair = async (payload, publicKey ,privateKey) => {
    try {
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256', 
            expiresIn: '7 days'
        })
        jwt.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.log('Error verify token::', error);
            } else {
                console.log('Verify token :: decode::', decode);
            }
        })
        return {
            accessToken, refreshToken
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createTokenPair
}