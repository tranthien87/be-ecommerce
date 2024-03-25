const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');

const CheckoutController = require('../../controllers/checkout.controller');


router.post('/review', asyncHanler(CheckoutController.checkout));



module.exports = router