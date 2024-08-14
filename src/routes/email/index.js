const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const InventoryController = require('../../controllers/inventory.controller');
const { authenticationV2 } = require('../../auth/checkAuth');
const { newTemplate } = require('../../controllers/email.controller');




router.post('/new_template', asyncHanler(newTemplate));



module.exports = router