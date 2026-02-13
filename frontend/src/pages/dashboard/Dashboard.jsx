import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/layout/Layout';
import TaskStats from '../../components/tasks/TaskStats';
import TaskList from '../../components/tasks/TaskList';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  fetchTasks,
  fetchStatistics,
  createTask,
  updateTaskById,
  deleteTaskById,
  fetchCategories,
} from '../../redux/services/taskService';
import { IoAdd, IoTrendingUpOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, statistics, loading } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await dispatch(fetchStatistics());
    await dispatch(fetchCategories());
    // Load only recent tasks (limit 6)
    await dispatch(fetchTasks({}));
  };

  const handleCreateTask = async (taskData) => {
    const result = await dispatch(createTask(taskData));
    if (result.success) {
      setIsCreateModalOpen(false);
      loadDashboardData();
    }
  };

  const handleEditTask = async (taskData) => {
    const result = await dispatch(updateTaskById(selectedTask._id, taskData));
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedTask(null);
      loadDashboardData();
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
        loadDashboardData();
      }
    }
  };

  const handleStatusChange = async (taskId, status) => {
    await dispatch(updateTaskById(taskId, { status }));
    loadDashboardData();
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // Prepare chart data
  const chartData = statistics ? [
    { name: 'To Do', value: statistics.todo, color: '#6b7280' },
    { name: 'In Progress', value: statistics.inProgress, color: '#3b82f6' },
    { name: 'Completed', value: statistics.completed, color: '#10b981' },
  ].filter(item => item.value > 0) : [];

  const priorityData = statistics ? [
    { name: 'High', value: statistics.byPriority.high, color: '#ef4444' },
    { name: 'Medium', value: statistics.byPriority.medium, color: '#f59e0b' },
    { name: 'Low', value: statistics.byPriority.low, color: '#10b981' },
  ].filter(item => item.value > 0) : [];

  // Get recent tasks (limit 6)
  const recentTasks = tasks.slice(0, 6);

  return (
    <Layout>
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your tasks today
            </p>
          </div>
          <Button
            variant="primary"
            icon={<IoAdd />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Task
          </Button>
        </div>

        {/* Statistics */}
        <TaskStats statistics={statistics} />

        {/* Charts */}
        {statistics && (statistics.total > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Task Status Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Task Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Priority Distribution Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Priority Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Tasks
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/tasks')}
              icon={<IoTrendingUpOutline />}
            >
              View All
            </Button>
          </div>
          <TaskList
            tasks={recentTasks}
            loading={loading}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </div>

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

export default Dashboard;