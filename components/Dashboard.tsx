import React, { useState, useMemo } from 'react';
import { Task, User, TaskStatus, Project, TaskPriority } from '../types';
import { TaskCard } from './TaskCard';

interface DashboardProps {
  tasks: Task[];
  users: User[];
  projects: Project[];
  onAddTask: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
}

const statusToColor: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-gray-400',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-500',
  [TaskStatus.DONE]: 'bg-green-500',
};

const TaskColumn: React.FC<{
  status: TaskStatus;
  tasks: Task[];
  users: User[];
  onDrop: (status: TaskStatus) => void;
  onDragStart: (task: Task) => void;
  onSelectTask: (task: Task) => void;
}> = ({ status, tasks, users, onDrop, onDragStart, onSelectTask }) => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDraggedOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggedOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(false);
        onDrop(status);
    };

    return (
        <div 
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex-1 transition-all duration-300 ${isDraggedOver ? 'drag-over-column' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${statusToColor[status]}`}></span>
                    <h2 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wide">{status}</h2>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">{tasks.length}</span>
            </div>
            <div className="h-full space-y-3">
                {tasks.map((task, index) => (
                    <div 
                        key={task.id} 
                        draggable 
                        onDragStart={() => onDragStart(task)} 
                        className="animate-fadeInUp"
                        style={{ '--delay': `${index * 50}ms` } as React.CSSProperties}
                    >
                        <TaskCard task={task} user={users.find(u => u.id === task.assigneeId)} onSelect={onSelectTask}/>
                    </div>
                ))}
            </div>
        </div>
    );
};


const FilterDropdown: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: {value: string; label: string}[]; }> = ({ label, value, onChange, options }) => (
    <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}:</label>
        <select
            value={value}
            onChange={onChange}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-mauve-500"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);


type SortByType = 'deadline' | 'priority' | 'title';

export const Dashboard: React.FC<DashboardProps> = ({ tasks, users, projects, onAddTask, onUpdateTaskStatus, onSelectTask }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<SortByType>('deadline');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');


  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };
  
  const handleDrop = (newStatus: TaskStatus) => {
    if (draggedTask && draggedTask.status !== newStatus) {
      onUpdateTaskStatus(draggedTask.id, newStatus);
    }
    setDraggedTask(null);
  };
  
    const priorityOrder: Record<TaskPriority, number> = {
        [TaskPriority.HIGH]: 1,
        [TaskPriority.MEDIUM]: 2,
        [TaskPriority.LOW]: 3,
    };

    const filteredAndSortedTasks = useMemo(() => {
        let result = [...tasks];

        // Filtering
        if (assigneeFilter !== 'all') {
            result = result.filter(task => task.assigneeId === assigneeFilter);
        }
        if (projectFilter !== 'all') {
            result = result.filter(task => task.projectId === projectFilter);
        }

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'deadline':
                default:
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            }
        });

        return result;
    }, [tasks, sortBy, assigneeFilter, projectFilter]);

  const tasksByStatus = (status: TaskStatus) => filteredAndSortedTasks.filter(task => task.status === status);

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Toutes les Tâches</h1>
            <button
                onClick={onAddTask}
                className="bg-mauve-600 hover:bg-mauve-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Ajouter une Tâche
            </button>
        </div>
        <div className="flex items-center space-x-6 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-6 border border-gray-200 dark:border-gray-700/50">
            <FilterDropdown 
                label="Trier par"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortByType)}
                options={[
                    { value: 'deadline', label: 'Échéance' },
                    { value: 'priority', label: 'Priorité' },
                    { value: 'title', label: 'Titre' },
                ]}
            />
             <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            <FilterDropdown 
                label="Assigné à"
                value={assigneeFilter}
                onChange={e => setAssigneeFilter(e.target.value)}
                options={[
                    { value: 'all', label: 'Tous' },
                    ...users.map(u => ({ value: u.id, label: u.name }))
                ]}
            />
            <FilterDropdown 
                label="Projet"
                value={projectFilter}
                onChange={e => setProjectFilter(e.target.value)}
                options={[
                    { value: 'all', label: 'Tous les projets' },
                    ...projects.map(p => ({ value: p.id, label: p.name }))
                ]}
            />
             {(assigneeFilter !== 'all' || projectFilter !== 'all') && (
                <button 
                    onClick={() => { setAssigneeFilter('all'); setProjectFilter('all'); }} 
                    className="ml-auto text-sm font-semibold text-mauve-600 dark:text-mauve-400 hover:underline"
                >
                    Réinitialiser
                </button>
            )}
        </div>
        <div className="flex space-x-4">
          {Object.values(TaskStatus).map(status => (
            <TaskColumn 
              key={status}
              status={status}
              tasks={tasksByStatus(status)}
              users={users}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onSelectTask={onSelectTask}
            />
          ))}
        </div>
    </div>
  );
};
