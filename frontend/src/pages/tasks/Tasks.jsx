import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/layout/Layout';
import TaskStats from '../../components/tasks/TaskStats';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskList from '../../components/tasks/TaskList';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';
import Button from '../../components/common/Button';
import {
  fetchTasks,
  fetchStatistics,
  createTask,
  updateTaskById,
  deleteTaskById,
  bulkDeleteTasks,
  bulkUpdateStatus,
  fetchCategories,
  fetchTags,
} from '../../redux/services/taskService';
import {
  IoAdd,
  IoTrashOutline,
  IoCheckmarkDoneOutline,
} from 'react-icons/io5';
import Swal from 'sweetalert2';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, statistics, filters, loading } = useSelector((state) => state.task);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    loadTasksData();
  }, []);

  const loadTasksData = async () => {
    await dispatch(fetchStatistics());
    await dispatch(fetchCategories());
    await dispatch(fetchTags());
    await dispatch(fetchTasks(filters));
  };

  const handleFilterChange = async (newFilters) => {
    await dispatch(fetchTasks(newFilters));
  };

  const handleCreateTask = async (taskData) => {
    const result = await dispatch(createTask(taskData));
    if (result.success) {
      setIsCreateModalOpen(false);
      loadTasksData();
    }
  };

  const handleEditTask = async (taskData) => {
    const result = await dispatch(updateTaskById(selectedTask._id, taskData));
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedTask(null);
      loadTasksData();
    }
  };

  const handleDeleteTask = async (taskId) => {
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
      const deleteResult = await dispatch(deleteTaskById(taskId));
      if (deleteResult.success) {
        loadTasksData();
      }
    }
  };

  const handleStatusChange = async (taskId, status) => {
    await dispatch(updateTaskById(taskId, { status }));
    loadTasksData();
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;

    const result = await Swal.fire({
      title: `Delete ${selectedTasks.length} tasks?`,
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      const deleteResult = await dispatch(bulkDeleteTasks(selectedTasks));
      if (deleteResult.success) {
        setSelectedTasks([]);
        setIsSelectionMode(false);
        loadTasksData();
      }
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return;

    const result = await dispatch(bulkUpdateStatus(selectedTasks, 'completed'));
    if (result.success) {
      setSelectedTasks([]);
      setIsSelectionMode(false);
      loadTasksData();
    }
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              All Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and organize your tasks
            </p>
          </div>
          <div className="flex gap-2">
            {isSelectionMode ? (
              <>
                {selectedTasks.length > 0 && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      icon={<IoCheckmarkDoneOutline />}
                      onClick={handleBulkComplete}
                    >
                      Mark Complete ({selectedTasks.length})
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<IoTrashOutline />}
                      onClick={handleBulkDelete}
                    >
                      Delete ({selectedTasks.length})
                    </Button>
                  </>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedTasks([]);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {tasks.length > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsSelectionMode(true)}
                  >
                    Select
                  </Button>
                )}
                <Button
                  variant="primary"
                  icon={<IoAdd />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  New Task
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Statistics */}
        <TaskStats statistics={statistics} />

        {/* Filters */}
        <TaskFilters onFilterChange={handleFilterChange} />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />

        {/* Create Task Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Task"
          size="lg"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={loading}
          />
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          title="Edit Task"
          size="lg"
        >
          <TaskForm
            initialValues={selectedTask}
            onSubmit={handleEditTask}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }}
            loading={loading}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Tasks;