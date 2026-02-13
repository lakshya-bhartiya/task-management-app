import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';
import Loader from '../../components/common/Loader';
import {
  fetchTaskById,
  updateTaskById,
  deleteTaskById,
} from '../../redux/services/taskService';
import {
  IoArrowBack,
  IoCreateOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPricetagOutline,
} from 'react-icons/io5';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { PRIORITY_COLORS, STATUS_COLORS, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';
import Swal from 'sweetalert2';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTask, loading } = useSelector((state) => state.task);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [id, dispatch]);

  const handleEdit = async (taskData) => {
    const result = await dispatch(updateTaskById(id, taskData));
    if (result.success) {
      setIsEditModalOpen(false);
      dispatch(fetchTaskById(id));
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      const deleteResult = await dispatch(deleteTaskById(id));
      if (deleteResult.success) {
        navigate('/tasks');
      }
    }
  };

  const handleStatusChange = async (status) => {
    await dispatch(updateTaskById(id, { status }));
    dispatch(fetchTaskById(id));
  };

  if (loading || !currentTask) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  const isOverdue = currentTask.isOverdue && currentTask.status !== 'completed';

  return (
    <Layout>
      <div className="animate-fadeIn max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="secondary"
            icon={<IoArrowBack />}
            onClick={() => navigate('/tasks')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Details
          </h1>
        </div>

        {/* Main Card */}
        <div className="card">
          {/* Actions */}
          <div className="flex justify-end gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              icon={<IoCreateOutline />}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<IoTrashOutline />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {currentTask.title}
          </h2>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`badge ${STATUS_COLORS[currentTask.status]}`}>
              {STATUS_LABELS[currentTask.status]}
            </span>
            <span className={`badge ${PRIORITY_COLORS[currentTask.priority]}`}>
              {PRIORITY_LABELS[currentTask.priority]}
            </span>
            {currentTask.category && (
              <span className="badge badge-gray">
                {currentTask.category}
              </span>
            )}
            {isOverdue && (
              <span className="badge badge-danger">
                Overdue
              </span>
            )}
          </div>

          {/* Quick Status Change */}
          {currentTask.status !== 'completed' && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Quick Actions:
              </p>
              <div className="flex gap-2">
                {currentTask.status === 'todo' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusChange('in-progress')}
                  >
                    Start Task
                  </Button>
                )}
                {currentTask.status === 'in-progress' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusChange('completed')}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {currentTask.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {currentTask.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {currentTask.tags && currentTask.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <IoPricetagOutline />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentTask.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTask.dueDate && (
                <div className="flex items-start gap-3">
                  <IoCalendarOutline className="text-xl text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Due Date
                    </p>
                    <p className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatDateTime(currentTask.dueDate)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <IoTimeOutline className="text-xl text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Created At
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDateTime(currentTask.createdAt)}
                  </p>
                </div>
              </div>

              {currentTask.updatedAt && (
                <div className="flex items-start gap-3">
                  <IoTimeOutline className="text-xl text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last Updated
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(currentTask.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Task"
          size="lg"
        >
          <TaskForm
            initialValues={currentTask}
            onSubmit={handleEdit}
            onCancel={() => setIsEditModalOpen(false)}
            loading={loading}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default TaskDetail;