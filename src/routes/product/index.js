
const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

router.get('/search/:keySearch', asyncHanler(productController.getListSearchProduct))
router.get('', asyncHanler(productController.findAllProducts))
router.get('/:product_id', asyncHanler(productController.findProduct))
router.get('/sku/get_variation', asyncHanler(productController.findOneSku))
router.get('/spu/get_spu_info', asyncHanler(productController.findOneSpu))

router.use(authenticationV2)

router.post('', asyncHanler(productController.createNewProduct));
router.post('/spu/new', asyncHanler(productController.createSpu));
router.patch('/:productId', asyncHanler(productController.updateProduct));
router.put('/publish/:id', asyncHanler(productController.publishProductByShop));
router.put('/unpublish/:id', asyncHanler(productController.unPublishProductByShop));
// QUERY //
router.get('/drafts/all', asyncHanler(productController.getListDraffProduct))
router.get('/publish/all', asyncHanler(productController.getListPublicProduct))


module.exports = router