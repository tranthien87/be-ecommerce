
const { BadRequestError, AuthFailueError, NotFoundError } = require('../core/error.response');
const asyncHandler = require('../helpers/asyncHandler');
const {findApiKey} =  require('../services/apiKey.services');
const { KeyTokenServices } = require('../services/keyToken.services');
const jwt = require('jsonwebtoken')
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
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

// const authentication = asyncHandler(async (req, res, next) => {
//     /**** 
//      * 1. check userId missing ?
//      * 2. get accessToken
//      * 3. check accessToken
//      * 4. check user in bds
//      * 5. check keystrore with userID
//      * 6. ok all, return next
//     */

//     //1.
//     const userId = req.headers[HEADER.CLIENT_ID];
//     console.log("🚀 ~ authentication ~ userId:", userId)
//     if (!userId) throw new AuthFailueError('Invalid request');
//     //2.
//     const keyStore = await KeyTokenServices.findByUserId(userId);
//     console.log("🚀 ~ authentication ~ keyStrore:", keyStore)
//     if (!keyStore) throw new NotFoundError('Not found keystore');
//     //3.
//     const accessToken = req.headers[HEADER.AUTHORIZATION];
//     console.log("🚀 ~ authentication ~ accessToken:", accessToken)
//     if (!accessToken) throw new AuthFailueError('Invalid request');

//     try {
//       const decode = jwt.verify(accessToken, keyStore.publicKey);
//       console.log(decode);
//       if (decode.userId !== userId) {
//         throw new AuthFailueError('Invalid userId')
//       }

//       req.keyStore = keyStore;
//      return next()
//     } catch (error) {
//         throw error
//     }

// })
const authenticationV2 = asyncHandler(async (req, res, next) => {
    /**** 
     * 1. check userId missing ?
     * 2. get accessToken
     * 3. check accessToken
     * 4. check user in bds
     * 5. check keystrore with userID
     * 6. ok all, return next
    */

    //1.
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailueError('Invalid request');
    //2.
    const keyStore = await KeyTokenServices.findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keystore');

    if(req.headers[REFRESHTOKEN]) {
      try {
        const refreshToken = req.headers[REFRESHTOKEN];
        const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
        if(decodeUser.userId !== userId) throw new AuthFailueError('Invalid userID!');
        req.keyStore = keyStore;
        req.user = decodeUser;
        req.refreshToken = refreshToken;
        return next();
      } catch (error) {
        throw error
      }
    }
    //3. 
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailueError('Invalid request');

    try {
      const decode = jwt.verify(accessToken, keyStore.publicKey);
      if (decode.userId !== userId) {
        throw new AuthFailueError('Invalid userId')
      }

      req.keyStore = keyStore;
     return next()
    } catch (error) {
        throw error
    }

})

module.exports = { apiKey , permissions, authentication, authenticationV2 }