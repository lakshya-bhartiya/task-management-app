const Task = require('./model.task');

class TaskService {
  // Create new task
  async createTask(userId, taskData) {
    const task = new Task({
      ...taskData,
      userId
    });
    await task.save();
    return task;
  }

  // Get all tasks for a user with filters
  async getTasks(userId, filters = {}) {
    const query = { userId };

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Date filters
    if (filters.dueDateFrom || filters.dueDateTo) {
      query.dueDate = {};
      if (filters.dueDateFrom) {
        query.dueDate.$gte = new Date(filters.dueDateFrom);
      }
      if (filters.dueDateTo) {
        query.dueDate.$lte = new Date(filters.dueDateTo);
      }
    }

    // Check for overdue tasks
    if (filters.isOverdue === 'true') {
      query.isOverdue = true;
    }

    const tasks = await Task.find(query).sort({ order: 1, createdAt: -1 });
    return tasks;
  }

  // Get single task by ID
  async getTaskById(userId, taskId) {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  // Update task
  async updateTask(userId, taskId, updateData) {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  // Delete task
  async deleteTask(userId, taskId) {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  // Bulk reorder tasks
  async reorderTasks(userId, tasksData) {
    const bulkOps = tasksData.map(task => ({
      updateOne: {
        filter: { _id: task.id, userId },
        update: { $set: { order: task.order } }
      }
    }));

    await Task.bulkWrite(bulkOps);
    return { message: 'Tasks reordered successfully' };
  }

  // Get task statistics
  async getStatistics(userId) {
    const tasks = await Task.find({ userId });

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      overdue: tasks.filter(t => t.isOverdue && t.status !== 'completed').length,
      byPriority: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      byCategory: {}
    };

    // Group by category
    tasks.forEach(task => {
      if (!stats.byCategory[task.category]) {
        stats.byCategory[task.category] = 0;
      }
      stats.byCategory[task.category]++;
    });

    return stats;
  }

  // Get unique categories
  async getCategories(userId) {
    const categories = await Task.distinct('category', { userId });
    return categories;
  }

  // Get unique tags
  async getTags(userId) {
    const tasks = await Task.find({ userId }).select('tags');
    const tagsSet = new Set();
    tasks.forEach(task => {
      task.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }

  // Update overdue status for all tasks
  async updateOverdueTasks(userId) {
    const now = new Date();
    await Task.updateMany(
      {
        userId,
        dueDate: { $lt: now },
        status: { $ne: 'completed' }
      },
      { $set: { isOverdue: true } }
    );
  }

  async bulkDeleteTasks(userId, taskIds) {
    const result = await Task.deleteMany({
      _id: { $in: taskIds },
      userId
    });

    return {
      message: 'Tasks deleted successfully',
      deletedCount: result.deletedCount
    };
  }

  // NEW: Bulk update status
  async bulkUpdateStatus(userId, taskIds, status) {
    const result = await Task.updateMany(
      {
        _id: { $in: taskIds },
        userId
      },
      { $set: { status } }
    );

    return {
      message: 'Tasks updated successfully',
      modifiedCount: result.modifiedCount
    };
  }
}

module.exports = new TaskService();