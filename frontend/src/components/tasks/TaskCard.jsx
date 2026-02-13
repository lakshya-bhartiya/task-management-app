import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoCalendarOutline, 
  IoTimeOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoCheckmarkCircle,
  IoEllipsisVertical
} from 'react-icons/io5';
import { formatDate, getDueDateLabel, truncateText } from '../../utils/helpers';
import { PRIORITY_COLORS, STATUS_COLORS, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.action-button') || e.target.closest('.menu-button')) {
      return;
    }
    navigate(`/tasks/${task._id}`);
  };

  const isOverdue = task.isOverdue && task.status !== 'completed';

  return (
    <div
      onClick={handleCardClick}
      className="card hover:shadow-md transition-shadow cursor-pointer relative"
    >
      {/* Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="menu-button p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <IoEllipsisVertical className="text-gray-600 dark:text-gray-400" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="action-button flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <IoCreateOutline />
                Edit
              </button>
              {task.status !== 'completed' && (
                <button
                  onClick={() => {
                    onStatusChange(task._id, 'completed');
                    setShowMenu(false);
                  }}
                  className="action-button flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <IoCheckmarkCircle />
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => {
                  onDelete(task._id);
                  setShowMenu(false);
                }}
                className="action-button flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <IoTrashOutline />
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="pr-8">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {truncateText(task.description, 100)}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`badge ${STATUS_COLORS[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          {task.category && (
            <span className="badge badge-gray">
              {task.category}
            </span>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <IoCalendarOutline />
              <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                {getDueDateLabel(task.dueDate)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <IoTimeOutline />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;