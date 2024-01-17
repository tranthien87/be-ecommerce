const express = require('express')
const router = express.Router()

const AccessControler = require('../../controllers/access.controller');
const asyncHanler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

router.post('/shop/signup', asyncHanler(AccessControler.signUp))
router.post('/shop/login', asyncHanler(AccessControler.login))

// authentication logout
router.use(authentication)

router.post('/shop/logout', asyncHanler(AccessControler.logout))
router.post('/shop/handlerRefreshToken', asyncHanler(AccessControler.handlerRefreshToken))
module.exports = router