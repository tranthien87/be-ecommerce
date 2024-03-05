
const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

router.get('/search/:keysearch', asyncHanler(productController.getListSearchProduct))

router.use(authenticationV2)

router.post('/', asyncHanler(productController.createNewProduct));
router.put('/publish/:id', asyncHanler(productController.publishProductByShop));
router.put('/unpublish/:id', asyncHanler(productController.unPublishProductByShop));
// QUERY //
router.get('/drafts/all', asyncHanler(productController.getListDraffProduct))
router.get('/publish/all', asyncHanler(productController.getListPublicProduct))


module.exports = router