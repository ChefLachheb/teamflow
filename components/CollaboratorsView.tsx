import React, { useState } from 'react';
import { User, Task } from '../types';

interface CollaboratorsViewProps {
    users: User[];
    tasks: Task[];
    onAddCollaborator: () => void;
    onDeleteUsers: (userIds: string[]) => void;
}

const UserCard: React.FC<{ user: User; taskCount: number; isSelected: boolean; onSelect: () => void; delay: number }> = ({ user, taskCount, isSelected, onSelect, delay }) => {
    return (
        <div 
            onClick={onSelect}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 border flex flex-col items-center text-center transition-all duration-300 cursor-pointer relative transform hover:-translate-y-1 animate-fadeInUp
            ${isSelected ? 'border-mauve-500 ring-2 ring-mauve-500' : 'border-gray-200 dark:border-gray-700/50 hover:border-mauve-500 dark:hover:border-mauve-600 hover:shadow-lg'}`}
             style={{ '--delay': `${delay}ms` } as React.CSSProperties}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-mauve-600 rounded-full flex items-center justify-center animate-scaleIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
            )}
            <img 
                src={user.avatarUrl} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-100 dark:border-gray-700"
            />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{user.name}</h3>
            <p className="text-sm text-mauve-600 dark:text-mauve-400 font-medium mb-1">{user.role}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
            <div className="mt-auto bg-gray-100 dark:bg-gray-700/50 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {taskCount} {taskCount === 1 ? 'tâche assignée' : 'tâches assignées'}
            </div>
        </div>
    );
};

export const CollaboratorsView: React.FC<CollaboratorsViewProps> = ({ users, tasks, onAddCollaborator, onDeleteUsers }) => {
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    
    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
            ? prev.filter(id => id !== userId)
            : [...prev, userId]
        );
    };

    const handleDelete = () => {
        if (selectedUserIds.length > 0) {
            onDeleteUsers(selectedUserIds);
            setSelectedUserIds([]);
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 h-10">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tous les Collaborateurs</h1>
                 <div className="relative">
                    {selectedUserIds.length === 0 ? (
                        <button
                            key="add"
                            onClick={onAddCollaborator}
                            className="bg-mauve-600 hover:bg-mauve-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 animate-fadeIn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                            Ajouter un collaborateur
                        </button>
                    ) : (
                        <div key="delete" className="flex items-center space-x-4 animate-fadeIn">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedUserIds.length} sélectionné(s)</span>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user, index) => {
                    const userTasks = tasks.filter(t => t.assigneeId === user.id);
                    return (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            taskCount={userTasks.length} 
                            isSelected={selectedUserIds.includes(user.id)}
                            onSelect={() => toggleUserSelection(user.id)}
                            delay={index * 100}
                        />
                    );
                })}
            </div>
        </div>
    );
};