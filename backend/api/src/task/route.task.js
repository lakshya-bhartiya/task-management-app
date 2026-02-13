const express = require('express');
const router = express.Router();
const taskController = require('./controller.task');
const validate = require('../../middleware/middleware.validation');
const authMiddleware = require('../../middleware/authHelper');
const {
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema,
  bulkDeleteSchema,
  bulkUpdateStatusSchema
} = require('../../validations/validation.task');

router.use(authMiddleware);

// Task CRUD
router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/statistics', taskController.getStatistics);
router.get('/categories', taskController.getCategories);
router.get('/tags', taskController.getTags);
router.get('/:id', taskController.getTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Bulk operations
router.post('/reorder', validate(reorderTasksSchema), taskController.reorderTasks);
router.post('/bulk-delete', validate(bulkDeleteSchema), taskController.bulkDeleteTasks);
router.post('/bulk-update-status', validate(bulkUpdateStatusSchema), taskController.bulkUpdateStatus);

module.exports = router;