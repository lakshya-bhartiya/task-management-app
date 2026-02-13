const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow(''),
  status: Joi.string().valid('todo', 'in-progress', 'completed').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  category: Joi.string().max(50).default('General'),
  tags: Joi.array().items(Joi.string().max(30)),
  dueDate: Joi.date().allow(null),
  order: Joi.number().default(0)
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().max(1000).allow(''),
  status: Joi.string().valid('todo', 'in-progress', 'completed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  category: Joi.string().max(50),
  tags: Joi.array().items(Joi.string().max(30)),
  dueDate: Joi.date().allow(null),
  order: Joi.number()
}).min(1);

const reorderTasksSchema = Joi.object({
  tasks: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      order: Joi.number().required()
    })
  ).required()
});

// NEW: Bulk operations schemas
const bulkDeleteSchema = Joi.object({
  taskIds: Joi.array().items(Joi.string()).min(1).required()
});

const bulkUpdateStatusSchema = Joi.object({
  taskIds: Joi.array().items(Joi.string()).min(1).required(),
  status: Joi.string().valid('todo', 'in-progress', 'completed').required()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema,
  bulkDeleteSchema,
  bulkUpdateStatusSchema
};