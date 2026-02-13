import React from 'react';
import { 
  IoCheckmarkCircle, 
  IoTimeOutline, 
  IoAlertCircle,
  IoListOutline 
} from 'react-icons/io5';

const TaskStats = ({ statistics }) => {
  if (!statistics) return null;

  const stats = [
    {
      label: 'Total Tasks',
      value: statistics.total,
      icon: IoListOutline,
      color: 'text-primary-600 bg-primary-100 dark:bg-primary-900/30',
    },
    {
      label: 'Completed',
      value: statistics.completed,
      icon: IoCheckmarkCircle,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'In Progress',
      value: statistics.inProgress,
      icon: IoTimeOutline,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Overdue',
      value: statistics.overdue,
      icon: IoAlertCircle,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="text-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;