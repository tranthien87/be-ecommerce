'use strict'
const { CREATED } = require('../core/success.response')
const AccessService = require('../services/access.services')

class AccessControler {

    signUp = async(req,res, next) => {

        return new CREATED({
            message: 'Registered OK',
            metadata:  await AccessService.signUp(req.body),
            options: {
                limited: 10
            }
        }).send(res)            
     
    }
}

module.exports = new AccessControler()