'use strict'
const AccessService = require('../services/access.services')

class AccessControler {

    signUp = async(req,res, next) => {
        try {
            console.log('signUp Shop:::', req.body);
            return res.status(201).json(
                await AccessService.signUp(req.body)
            )
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessControler()