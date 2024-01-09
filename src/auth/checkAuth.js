
const {findApiKey} =  require('../services/apiKey.services')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {

        const objKey = req.headers[HEADER.API_KEY]?.toString();
        
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error"
            });
        }

        const key = await findApiKey(objKey);
    
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error"
            });
        }
        req.objKey = key;
        return next();

    } catch (error) {
            console.error(error)
    }
}

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req?.objKey?.permissions) {
        return res.status(403).json({
            message: 'Permission denied!'
        })
    }
    if (!req.objKey.permissions.includes(permission)) {
        return res.status(403).json({
            message: 'Permission denied!'
        }) 
    }
    return next();
  }
}

const asyncHanler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = { apiKey , permissions, asyncHanler}