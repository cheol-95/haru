const userService = require('../services/project');
const response = require('../utils/response');

const getProjectList = async (req, res) => {
  const projects = await userService.getProjectList(req.params);
  response(res, 200, projects);
};

const updateProject = async (req, res) => {
  await userService.updateProject(req.params, req.body);
  response(res, 200, '프로젝트가 수정되었습니다');
};

module.exports = {
  getProjectList,
  updateProject,
};
