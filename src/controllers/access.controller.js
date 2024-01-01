'use strict'

class AccessControler {

    signUp = async(req,res, next) => {
        try {
            console.log('signUp:::', req.body);
            return res.status(201).json({
                code: 201,
                metadata: {
                    userId: 1
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessControler()