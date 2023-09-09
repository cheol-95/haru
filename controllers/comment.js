const commentService = require('../services/comment');
const response = require('../utils/response');

const createComment = async (req, res) => {
  const commentId = await commentService.createComment(req.user, req.body);
  response(res, 200, { commentId });
};

const getComment = async (req, res) => {
  const comment = await commentService.getComment(req.user, req.params);
  response(res, 200, { comment });
};

const updateComment = async (req, res) => {
  const comment = await commentService.updateComment(req.user, req.params, req.body);
  response(res, 200, { comment });
}

const deleteComment = async (req, res) => {
  await commentService.deleteComment(req.user, req.params);
  response(res, 200);
}

const likeComment = async (req, res) => {
  await commentService.likeComment(req.user, req.params, req.body);
  response(res, 200);
}

module.exports = {
  getComment,
  createComment,
  updateComment,
  deleteComment,
  likeComment
};
