const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/checkAuth');

const notificationController = require('../../controllers/notification.controller');


router.use(authenticationV2)

router.get('', asyncHanler(notificationController.getListNotiByuser));

module.exports = router