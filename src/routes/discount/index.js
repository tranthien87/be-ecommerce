const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/checkAuth');
const DiscountController = require('../../controllers/discount.controller');

// router.get('/search/:keySearch', asyncHanler(productController.getListSearchProduct))
// router.get('', asyncHanler(productController.findAllProducts))
// router.get('/:product_id', asyncHanler(productController.findProduct))

router.use(authenticationV2)

router.post('', asyncHanler(DiscountController.createDiscountCode));
// router.patch('/:productId', asyncHanler(productController.updateProduct));
// router.put('/publish/:id', asyncHanler(productController.publishProductByShop));
// router.put('/unpublish/:id', asyncHanler(productController.unPublishProductByShop));
// // QUERY //
// router.get('/drafts/all', asyncHanler(productController.getListDraffProduct))
// router.get('/publish/all', asyncHanler(productController.getListPublicProduct))


module.exports = router