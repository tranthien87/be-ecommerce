const express = require('express')
const router = express.Router()

const AccessControler = require('../../controllers/access.controller');
const asyncHanler = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/checkAuth');

router.post('/shop/signup', asyncHanler(AccessControler.signUp))
router.post('/shop/login', asyncHanler(AccessControler.login))

// authentication middleware
router.use(authenticationV2)

router.post('/shop/logout', asyncHanler(AccessControler.logout))
router.post('/shop/handlerRefreshToken', asyncHanler(AccessControler.handlerRefreshToken))
module.exports = router