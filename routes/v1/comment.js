const express = require('express');

// const { idCompare } = require('../../middlewares/auth');
const asyncWrap = require('../../utils/errors/wrap');
// const commentValid = require('../../middlewares/validators/comment');
const commentController = require('../../controllers/comment');

const router = express.Router();

router.post('/', asyncWrap(commentController.createComment));
router.get('/:id', asyncWrap(commentController.getComment));
router.put('/:id', asyncWrap(commentController.updateComment)); // add input validation
router.delete('/:id', asyncWrap(commentController.deleteComment)); // add input validation

router.post('/:id/like', asyncWrap(commentController.likeComment));


// router.put('/:id/alert', idCompare, commentValid.updateAlert, asyncWrap(commentController.updateAlert));
// router.put('/:id/accessToken', idCompare, commentValid.updateAccessToken, asyncWrap(commentController.updateAccessToken));
// router.put('/:id/pushToken', idCompare, commentValid.updatePushToken, asyncWrap(commentController.updatePushToken));

module.exports = router;