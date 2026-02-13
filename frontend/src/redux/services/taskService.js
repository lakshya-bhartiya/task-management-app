import axiosInstance from '../../api/axios';
import {
  setLoading,
  setTasks,
  setCurrentTask,
  addTask,
  updateTask,
  removeTask,
  setStatistics,
  setCategories,
  setTags,
  setError,
} from '../slices/taskSlice';
import toast from 'react-hot-toast';

export const fetchTasks = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Build query string
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const response = await axiosInstance.get(`/tasks?${queryParams.toString()}`);
    
    if (response.data.success) {
      dispatch(setTasks(response.data.data));
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch tasks';
    dispatch(setError(message));
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTaskById = (taskId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.get(`/tasks/${taskId}`);
    
    if (response.data.success) {
      dispatch(setCurrentTask(response.data.data));
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch task';
    dispatch(setError(message));
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const createTask = (taskData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post('/tasks', taskData);
    
    if (response.data.success) {
      dispatch(addTask(response.data.data));
      toast.success(response.data.message);
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create task';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateTaskById = (taskId, taskData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
    
    if (response.data.success) {
      dispatch(updateTask(response.data.data));
      toast.success(response.data.message);
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update task';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteTaskById = (taskId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    
    if (response.data.success) {
      dispatch(removeTask(taskId));
      toast.success(response.data.message);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete task';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const reorderTasks = (tasksData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/tasks/reorder', { tasks: tasksData });
    
    if (response.data.success) {
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to reorder tasks';
    toast.error(message);
    return { success: false, message };
  }
};

export const bulkDeleteTasks = (taskIds) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post('/tasks/bulk-delete', { taskIds });
    
    if (response.data.success) {
      // Remove all deleted tasks from state
      taskIds.forEach(id => dispatch(removeTask(id)));
      toast.success(`${response.data.deletedCount} tasks deleted`);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete tasks';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const bulkUpdateStatus = (taskIds, status) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post('/tasks/bulk-update-status', { taskIds, status });
    
    if (response.data.success) {
      toast.success(`${response.data.modifiedCount} tasks updated`);
      // Refresh tasks
      dispatch(fetchTasks());
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update tasks';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchStatistics = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/tasks/statistics');
    
    if (response.data.success) {
      dispatch(setStatistics(response.data.data));
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch statistics';
    return { success: false, message };
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/tasks/categories');
    
    if (response.data.success) {
      dispatch(setCategories(response.data.data));
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch categories';
    return { success: false, message };
  }
};

export const fetchTags = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/tasks/tags');
    
    if (response.data.success) {
      dispatch(setTags(response.data.data));
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch tags';
    return { success: false, message };
  }
};