const express = require('express');
const router = express.Router();
const asyncHanler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/checkAuth');
const commentController = require('../../controllers/comment.controller');


router.use(authenticationV2)

router.post('', asyncHanler(commentController.createComment));
router.delete('', asyncHanler(commentController.deleteComment));
router.get('', asyncHanler(commentController.getCommentByParentId));

module.exports = router