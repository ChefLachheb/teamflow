import React from 'react';
import { Team, User, Task, TaskStatus } from '../types';

interface TeamsViewProps {
    teams: Team[];
    users: User[];
    tasks: Task[];
    onSelectTeam: (team: Team) => void;
    onAddTeam: () => void;
}

interface TeamCardProps {
    team: Team;
    users: User[];
    tasks: Task[];
    onSelect: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, users, tasks, onSelect }) => {
    const teamMembers = users.filter(user => team.memberIds.includes(user.id));
    const memberIds = teamMembers.map(m => m.id);
    const teamTasks = tasks.filter(task => task.assigneeId && memberIds.includes(task.assigneeId));

    const totalTasks = teamTasks.length;
    const completedTasks = teamTasks.filter(task => task.status === TaskStatus.DONE).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <button 
            onClick={onSelect}
            className="w-full h-full text-left bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 flex flex-col transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 hover:border-mauve-500 dark:hover:border-mauve-600 transform hover:-translate-y-1"
        >
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{team.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 line-clamp-2">{team.description}</p>
                
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Membres</h4>
                <div className="flex -space-x-2 mb-4">
                    {teamMembers.slice(0, 5).map(member => (
                        <img 
                            key={member.id} 
                            src={member.avatarUrl} 
                            alt={member.name} 
                            title={member.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-gray-800" 
                        />
                    ))}
                    {teamMembers.length > 5 && (
                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800">
                            +{teamMembers.length - 5}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progression</span>
                    <span className="font-semibold">{completedTasks} / {totalTasks} Tâches</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-mauve-600 to-mauve-500 h-2 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </button>
    );
};

export const TeamsView: React.FC<TeamsViewProps> = ({ teams, users, tasks, onSelectTeam, onAddTeam }) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Nos Équipes</h1>
                <button
                    onClick={onAddTeam}
                    className="bg-mauve-600 hover:bg-mauve-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Ajouter une Équipe
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {teams.map((team, index) => (
                    <div 
                        key={team.id}
                        className="animate-fadeInUp"
                        style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
                    >
                        <TeamCard team={team} users={users} tasks={tasks} onSelect={() => onSelectTeam(team)} />
                    </div>
                ))}
            </div>
        </div>
    );
};
