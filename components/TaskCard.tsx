import React from 'react';
import { Task, User, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
  user?: User;
  onSelect: (task: Task) => void;
}

const priorityConfig: Record<TaskPriority, { icon: JSX.Element; classes: string }> = {
  [TaskPriority.HIGH]: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4z" clipRule="evenodd" transform="rotate(180 10 10)"/></svg>,
    classes: 'text-red-500 dark:text-red-400',
  },
  [TaskPriority.MEDIUM]: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" /></svg>,
    classes: 'text-yellow-500 dark:text-yellow-400',
  },
  [TaskPriority.LOW]: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4z" clipRule="evenodd" /></svg>,
    classes: 'text-green-500 dark:text-green-400',
  },
};

const DeadlineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);

const DriveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.189 8.544l-3.303-5.72a.8.8 0 00-.69-.404H8.804a.8.8 0 00-.69.404L4.81 8.544a.8.8 0 00.69 1.196h12.998a.8.8 0 00.691-1.196zM8.13 10.5l-4.246 7.355A.8.8 0 004.575 19h4.849l4.246-7.355a.8.8 0 00-1.38-.795zM15.87 10.5l-4.246 7.355a.8.8 0 001.38.795l4.246-7.355H20.1a.8.8 0 00.691-1.196l-1.618-2.804H15.87z"/></svg>
);

export const TaskCard: React.FC<TaskCardProps> = ({ task, user, onSelect }) => {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'Terminé';
  const progress = task.estimatedTime > 0 ? (task.timeLogged / task.estimatedTime) * 100 : 0;

  return (
    <button onClick={() => onSelect(task)} className="w-full text-left bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md mb-4 cursor-grab active:cursor-grabbing border border-gray-200 dark:border-gray-600/50 hover:border-mauve-500 dark:hover:border-mauve-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-mauve-500 hover:shadow-lg transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm pr-2">{task.title}</h3>
        <div className="relative group flex-shrink-0">
             {user ? (
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
            ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-2 border-gray-300 dark:border-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {user ? user.name : 'Non assigné'}
            </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progression</span>
            <span>{task.timeLogged}h / {task.estimatedTime}h</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
            <div className="bg-mauve-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
            <span className={`flex items-center gap-1 ${priorityConfig[task.priority].classes}`}>
                {priorityConfig[task.priority].icon}
                <span>{task.priority}</span>
            </span>
            <span className={`flex items-center ${isOverdue ? 'text-red-500 dark:text-red-400 font-semibold' : ''}`}>
              <DeadlineIcon /> {new Date(task.deadline).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
            </span>
        </div>
        <div className="flex items-center text-gray-400 dark:text-gray-500 hover:text-mauve-500 dark:hover:text-mauve-400" title="Fichiers liés">
            <DriveIcon />
            <span className="ml-1 text-xs font-semibold">3</span>
        </div>
      </div>
    </button>
  );
};