
const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');


router.use(authenticationV2)

router.post('/', asyncHanler(productController.createNewProduct))


module.exports = router