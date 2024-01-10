const express = require('express')
const { route } = require('..')
const router = express.Router()

const AccessControler = require('../../controllers/access.controller');
const { asyncHanler } = require('../../auth/checkAuth');


router.post('/shop/signup', asyncHanler(AccessControler.signUp))
router.post('/shop/login', asyncHanler(AccessControler.login))

module.exports = router