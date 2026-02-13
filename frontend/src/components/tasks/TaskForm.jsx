import React, { useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { taskValidationSchema } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import { IoClose, IoAdd } from 'react-icons/io5';
import { TASK_STATUS, TASK_PRIORITY, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const TaskForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  // Extract only the fields we need for the form
  const getFormValues = (values) => {
    if (!values) {
      return {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        category: 'General',
        tags: [],
        dueDate: '',
      };
    }

    // Extract only allowed fields
    const formValues = {
      title: values.title || '',
      description: values.description || '',
      status: values.status || 'todo',
      priority: values.priority || 'medium',
      category: values.category || 'General',
      tags: values.tags || [],
      dueDate: values.dueDate || '',
    };

    // Format date for input
    if (formValues.dueDate) {
      const date = new Date(formValues.dueDate);
      formValues.dueDate = date.toISOString().slice(0, 16);
    }

    return formValues;
  };

  const defaultValues = getFormValues(initialValues);

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={taskValidationSchema}
      onSubmit={(values) => {
        // Convert date to ISO string
        const submitData = {
          ...values,
          dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        };
        onSubmit(submitData);
      }}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          {/* Title */}
          <Input
            label="Title"
            name="title"
            type="text"
            placeholder="Enter task title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.title}
            touched={touched.title}
            required
          />

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Enter task description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input resize-none"
            />
            {errors.description && touched.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="status" className="label">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="label">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={values.priority}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
              >
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Category"
              name="category"
              type="text"
              placeholder="Enter category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.category}
              touched={touched.category}
            />

            <Input
              label="Due Date"
              name="dueDate"
              type="datetime-local"
              value={values.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dueDate}
              touched={touched.dueDate}
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="label">Tags</label>
            <FieldArray name="tags">
              {({ push, remove }) => (
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {values.tags && values.tags.length > 0 && values.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="hover:text-primary-900 dark:hover:text-primary-100"
                        >
                          <IoClose />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a tag"
                      className="input flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value && !values.tags.includes(value)) {
                            push(value);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={(e) => {
                        const input = e.target.closest('div').querySelector('input');
                        const value = input.value.trim();
                        if (value && !values.tags.includes(value)) {
                          push(value);
                          input.value = '';
                        }
                      }}
                      icon={<IoAdd />}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </FieldArray>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              {initialValues?._id ? 'Update Task' : 'Create Task'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskForm;