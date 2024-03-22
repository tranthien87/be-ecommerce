const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/checkAuth');
const DiscountController = require('../../controllers/discount.controller');

router.get('/amount', asyncHanler(DiscountController.getDiscountAmount))
router.get('/list-product-code', asyncHanler(DiscountController.getAllProductWithDiscountCode))

router.use(authenticationV2)

router.post('', asyncHanler(DiscountController.createDiscountCode));
router.get('/list-discount', asyncHanler(DiscountController.getAllDiscountCode))



module.exports = router