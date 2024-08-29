const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const InventoryController = require('../../controllers/inventory.controller');
const { newUser, checkRegisterEmailToken } = require('../../controllers/user.controller');




router.post('/new_user', asyncHanler(newUser));

router.get('/welcome-back', asyncHanler(checkRegisterEmailToken));

module.exports = router