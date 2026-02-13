const cron = require('node-cron');
const Task = require('../src/task/model.task');

// Run every hour to check overdue tasks
const updateOverdueTasks = cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const result = await Task.updateMany(
      {
        dueDate: { $lt: now },
        status: { $ne: 'completed' },
        isOverdue: false
      },
      { $set: { isOverdue: true } }
    );
    
    console.log(`✅ Overdue tasks updated: ${result.modifiedCount} tasks`);
  } catch (error) {
    console.error('❌ Error updating overdue tasks:', error.message);
  }
});

module.exports = { updateOverdueTasks };
