
const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');


router.use(authentication)

router.post('/', asyncHanler(productController.createNewProduct))


module.exports = router