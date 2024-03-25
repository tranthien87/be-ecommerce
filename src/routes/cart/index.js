const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');

const CartController = require('../../controllers/cart.controller');

router.get('/', asyncHanler(CartController.getListCart));
router.post('', asyncHanler(CartController.createCart));
router.post('/update', asyncHanler(CartController.updateCart));
router.delete('/', asyncHanler(CartController.deleteProductInCart));


module.exports = router