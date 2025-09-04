import React from 'react';
import { Project, Task, User, TaskStatus } from '../types';

interface ProjectDetailViewProps {
    project: Project;
    tasks: Task[];
    users: User[];
    onBack: () => void;
    onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskItem: React.FC<{ task: Task; onToggleCompletion: () => void; }> = ({ task, onToggleCompletion }) => {
    const isDone = task.status === TaskStatus.DONE;

    return (
        <div className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <input 
                type="checkbox" 
                checked={isDone}
                onChange={onToggleCompletion}
                className="h-5 w-5 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-mauve-600 focus:ring-mauve-500 cursor-pointer flex-shrink-0"
            />
            <span className={`ml-4 flex-grow ${isDone ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                {task.title}
            </span>
        </div>
    );
};


export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, tasks, users, onBack, onUpdateTaskStatus }) => {
    const teamMembers = users.filter(u => project.memberIds.includes(u.id));

    const handleTaskStatusToggle = (task: Task) => {
        const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
        onUpdateTaskStatus(task.id, newStatus);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-mauve-600 dark:text-mauve-400 hover:text-mauve-700 dark:hover:text-mauve-300 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Retour aux projets
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-3xl">{project.description}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Tâches du Projet</h2>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                           {tasks.length > 0 ? (
                               tasks
                                .sort((a,b) => (a.status === TaskStatus.DONE ? 1 : -1) - (b.status === TaskStatus.DONE ? 1 : -1) || new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                                .map(task => (
                                    <TaskItem key={task.id} task={task} onToggleCompletion={() => handleTaskStatusToggle(task)} />
                                ))
                           ) : (
                               <div className="text-gray-400 dark:text-gray-500 text-center py-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                <p className="mt-4 text-sm font-semibold">Aucune tâche pour ce projet.</p>
                                <p className="text-xs">Créez-en une depuis le tableau de bord.</p>
                               </div>
                           )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Membres de l'Équipe</h2>
                        <div className="space-y-4">
                            {teamMembers.map(member => (
                                <div key={member.id} className="flex items-center">
                                    <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover"/>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{member.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                            {teamMembers.length === 0 && (
                                <p className="text-gray-400 dark:text-gray-500 text-sm">Aucun membre assigné à ce projet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};