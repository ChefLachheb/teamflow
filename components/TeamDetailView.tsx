import React from 'react';
import { Team, User, Task, TaskStatus } from '../types';

interface TeamDetailViewProps {
    team: Team;
    users: User[];
    tasks: Task[];
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const TeamDetailView: React.FC<TeamDetailViewProps> = ({ team, users, tasks, onBack, onEdit, onDelete }) => {
    const teamMembers = users.filter(u => team.memberIds.includes(u.id));

    const assignedTasks = tasks
        .filter(task => task.assigneeId && team.memberIds.includes(task.assigneeId))
        .sort((a, b) => {
            if (a.status === TaskStatus.DONE && b.status !== TaskStatus.DONE) return 1;
            if (a.status !== TaskStatus.DONE && b.status === TaskStatus.DONE) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });

    const statusConfig: Record<TaskStatus, { classes: string }> = {
        [TaskStatus.TODO]: { classes: 'bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-300' },
        [TaskStatus.IN_PROGRESS]: { classes: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' },
        [TaskStatus.DONE]: { classes: 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400' },
    };


    return (
        <div className="p-6 animate-fadeIn">
            <div className="mb-6">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-mauve-600 dark:text-mauve-400 hover:text-mauve-700 dark:hover:text-mauve-300 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Retour aux équipes
                </button>
                 <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{team.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-3xl">{team.description}</p>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0 mt-2">
                        <button onClick={onEdit} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">
                            Modifier
                        </button>
                        <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Membres de l'Équipe ({teamMembers.length})</h2>
                {teamMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover"/>
                                <div className="ml-3">
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{member.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a3 3 0 01-5 0m0 0a3 3 0 015 0m0 0V3a3 3 0 013-3h1a3 3 0 013 3v1.143m-6 0a3 3 0 00-5 0" /></svg>
                        <p className="mt-4 text-sm font-semibold">Aucun membre dans cette équipe.</p>
                    </div>
                )}
            </div>

            <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Tâches Assignées ({assignedTasks.length})</h2>
                 <div className="space-y-3">
                    {assignedTasks.length > 0 ? (
                        assignedTasks.map(task => {
                            const assignee = users.find(u => u.id === task.assigneeId);
                            return (
                                <div key={task.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                    <div className="flex-grow pr-4">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Échéance: {new Date(task.deadline).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4 flex-shrink-0">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[task.status].classes}`}>
                                            {task.status}
                                        </span>
                                        {assignee && (
                                            <div className="relative group">
                                                <img src={assignee.avatarUrl} alt={assignee.name} className="w-8 h-8 rounded-full object-cover" />
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                                    {assignee.name}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                         <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="mt-4 text-sm font-semibold">Aucune tâche assignée à cette équipe.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};