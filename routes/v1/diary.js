const express = require('express');

const { idCompare } = require('../../middlewares/auth');
const asyncWrap = require('../../utils/errors/wrap');
const diaryValid = require('../../middlewares/validators/diary');
const diaryController = require('../../controllers/diary');
// const studyValid = require('../../middlewares/validators/study');
// const studyController = require('../../controllers/study');
// const applyValid = require('../../middlewares/validators/apply');
// const applyController = require('../../controllers/apply');
// const projectValid = require('../../middlewares/validators/project');
// const projectController = require('../../controllers/project');
// const alertValid = require('../../middlewares/validators/alert');
// const alertController = require('../../controllers/alert');

const router = express.Router();

router.get('/haru', asyncWrap(diaryController.getHaru)); // add input validation

router.get('/:id', diaryValid.getDiary, asyncWrap(diaryController.getDiary));
router.post('/', diaryValid.createDiary, asyncWrap(diaryController.createDiary));
router.put('/:id', asyncWrap(diaryController.updateDiary)); // add input validation
router.delete('/:id', asyncWrap(diaryController.deleteDiary)); // add input validation

// router.put('/:id/alert', idCompare, diaryValid.updateAlert, asyncWrap(diaryController.updateAlert));
// router.put('/:id/accessToken', idCompare, diaryValid.updateAccessToken, asyncWrap(diaryController.updateAccessToken));
// router.put('/:id/pushToken', idCompare, diaryValid.updatePushToken, asyncWrap(diaryController.updatePushToken));

module.exports = router;