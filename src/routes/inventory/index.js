const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const InventoryController = require('../../controllers/inventory.controller');
const { authenticationV2 } = require('../../auth/checkAuth');


router.use(authenticationV2)

router.post('/', asyncHanler(InventoryController.addStock));



module.exports = router