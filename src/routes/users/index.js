const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const InventoryController = require('../../controllers/inventory.controller');
const { newUser } = require('../../controllers/user.controller');




router.post('/new_user', asyncHanler(newUser));



module.exports = router