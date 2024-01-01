const express = require('express')
const { route } = require('..')
const router = express.Router()

const AccessControler = require('../../controllers/access.controller');


router.post('/shop/signup', AccessControler.signUp)

module.exports = router