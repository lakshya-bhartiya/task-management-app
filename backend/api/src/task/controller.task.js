const taskService = require('./service.task');

class TaskController {
  // Create task
  async createTask(req, res) {
    try {
      const task = await taskService.createTask(req.user.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all tasks
  async getTasks(req, res) {
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        category: req.query.category,
        tags: req.query.tags ? req.query.tags.split(',') : undefined,
        search: req.query.search,
        dueDateFrom: req.query.dueDateFrom,
        dueDateTo: req.query.dueDateTo,
        isOverdue: req.query.isOverdue
      };

      const tasks = await taskService.getTasks(req.user.userId, filters);
      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get single task
  async getTask(req, res) {
    try {
      const task = await taskService.getTaskById(req.user.userId, req.params.id);
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update task
  async updateTask(req, res) {
    try {
      const task = await taskService.updateTask(
        req.user.userId,
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete task
  async deleteTask(req, res) {
    try {
      await taskService.deleteTask(req.user.userId, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Reorder tasks
  async reorderTasks(req, res) {
    try {
      const result = await taskService.reorderTasks(
        req.user.userId,
        req.body.tasks
      );
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get statistics
  async getStatistics(req, res) {
    try {
      const stats = await taskService.getStatistics(req.user.userId);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get categories
  async getCategories(req, res) {
    try {
      const categories = await taskService.getCategories(req.user.userId);
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get tags
  async getTags(req, res) {
    try {
      const tags = await taskService.getTags(req.user.userId);
      res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkDeleteTasks(req, res) {
    try {
      const result = await taskService.bulkDeleteTasks(
        req.user.userId,
        req.body.taskIds
      );
      res.status(200).json({
        success: true,
        message: result.message,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // NEW: Bulk update status
  async bulkUpdateStatus(req, res) {
    try {
      const result = await taskService.bulkUpdateStatus(
        req.user.userId,
        req.body.taskIds,
        req.body.status
      );
      res.status(200).json({
        success: true,
        message: result.message,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new TaskController();