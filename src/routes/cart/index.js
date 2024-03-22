const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/checkAuth');
const CartController = require('../../controllers/cart.controller');


router.use(authenticationV2)


router.get('/update', asyncHanler(CartController.getListCart));
router.post('', asyncHanler(CartController.createCart));
router.post('/update', asyncHanler(CartController.updateCart));
router.delete('/update', asyncHanler(CartController.deleteProductInCart));


module.exports = router