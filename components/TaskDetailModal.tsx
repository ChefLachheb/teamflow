import React, { useState, useEffect } from 'react';
import { Task, User, TaskPriority, TaskStatus } from '../types';

interface TaskDetailModalProps {
  task: Task;
  user?: User;
  onClose: () => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onUpdateTimeLogged: (taskId: string, time: number) => void;
}

const priorityConfig: Record<TaskPriority, { classes: string }> = {
  [TaskPriority.HIGH]: { classes: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400' },
  [TaskPriority.MEDIUM]: { classes: 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' },
  [TaskPriority.LOW]: { classes: 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400' },
};

const statusConfig: Record<TaskStatus, { classes: string }> = {
    [TaskStatus.TODO]: { classes: 'bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-300' },
    [TaskStatus.IN_PROGRESS]: { classes: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' },
    [TaskStatus.DONE]: { classes: 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400' },
};


export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, user, onClose, onDelete, onEdit, onUpdateTimeLogged }) => {
    const [editableTime, setEditableTime] = useState<string | number>(task.timeLogged);

    useEffect(() => {
        setEditableTime(task.timeLogged);
    }, [task.timeLogged]);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableTime(e.target.value);
    };

    const handleTimeBlur = () => {
        let newTime = parseFloat(String(editableTime));
        if (isNaN(newTime) || newTime < 0) {
            newTime = 0;
        }
        
        if (newTime !== task.timeLogged) {
            onUpdateTimeLogged(task.id, newTime);
        }
        setEditableTime(newTime);
    };

    const progress = task.estimatedTime > 0 ? ((Number(editableTime) || 0) / task.estimatedTime) * 100 : 0;
    const isOverdue = new Date(task.deadline) < new Date() && task.status !== TaskStatus.DONE;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20 animate-fadeIn" onClick={onClose}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="taskDetailModalTitle"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 animate-scaleIn" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 id="taskDetailModalTitle" className="text-2xl font-bold text-gray-900 dark:text-gray-100">{task.title}</h2>
                <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[task.status].classes}`}>{task.status}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityConfig[task.priority].classes}`}>{task.priority}</span>
                </div>
            </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">{task.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="text-gray-500 dark:text-gray-400 font-medium mb-1">Assigné à</div>
                {user ? (
                    <div className="flex items-center">
                        <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-gray-800 dark:text-gray-200">{user.name}</span>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-gray-500 dark:text-gray-300 italic">Non assigné</span>
                    </div>
                )}
            </div>
            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="text-gray-500 dark:text-gray-400 font-medium mb-1">Échéance</div>
                <span className={`text-gray-800 dark:text-gray-200 ${isOverdue ? 'text-red-500 dark:text-red-400 font-bold' : ''}`}>
                    {new Date(task.deadline).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>
        </div>

        <div className="mb-6">
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <span>Progression</span>
                 <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={editableTime}
                        onChange={handleTimeChange}
                        onBlur={handleTimeBlur}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        className="w-20 p-1 text-right font-semibold bg-gray-100 dark:bg-gray-700/50 rounded-md border border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-mauve-500 text-gray-800 dark:text-gray-200"
                        min="0"
                        step="0.5"
                        aria-label="Heures enregistrées"
                    />
                    <span className="text-gray-500 dark:text-gray-400">h / {task.estimatedTime}h</span>
                </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-mauve-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={() => onDelete(task.id)} className="px-4 py-2 bg-red-100 dark:bg-red-600/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-600/70">Supprimer</button>
          <button onClick={() => onEdit(task)} className="px-4 py-2 bg-mauve-600 text-white rounded-lg hover:bg-mauve-700">Modifier</button>
        </div>
      </div>
    </div>
  );
};
