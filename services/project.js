const projectDao = require('../dao/project');
const { customError } = require('../utils/errors/custom');

const updateProject = async ({ id }, { project_list: updateProjects }) => {
  if (updateProjects.length > 3) {
    throw customError(400, '프로젝트는 3개까지 등록 가능합니다', 101);
  }

  const updateKeys = await updateProjects.map((project) => {
    return project.id;
  });

  const oldProjectRows = await projectDao.getProjectList(id);
  for (oldProject of oldProjectRows) {
    if (!updateKeys.includes(oldProject.id)) {
      await projectDao.deleteProject(id, oldProject.id);
    }
  }

  for (project of updateProjects) {
    if (project.id) {
      const updateRows = await projectDao.updateProject(project);
      if (updateRows.affectedRows === 0) {
        throw customError(400, '프로젝트 수정에 실패했습니다', 102);
      }
    } else if (Object.keys(project).length > 0) {
      project.user_id = id;
      const createRows = await projectDao.createProject(project);
      if (createRows.length === 0) {
        throw customError(400, '프로젝트 추가에 실패했습니다', 103);
      }
    }
  }
};

const getProjectList = async ({ id }) => {
  const projectRows = await projectDao.getProjectList(id);
  return projectRows;
};

module.exports = {
  getProjectList,
  updateProject,
};
