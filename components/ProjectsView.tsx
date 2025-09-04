import React from 'react';
import { Project, Task, User, TaskStatus } from '../types';

interface ProjectsViewProps {
    projects: Project[];
    tasks: Task[];
    users: User[];
    onSelectProject: (project: Project) => void;
    onAddProject: () => void;
}

const ProjectCard: React.FC<{ project: Project; tasks: Task[]; users: User[]; onSelect: (project: Project) => void; delay: number; }> = ({ project, tasks, users, onSelect, delay }) => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const completedTasks = projectTasks.filter(t => t.status === TaskStatus.DONE).length;
    const totalTasks = projectTasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const teamMembers = users.filter(u => project.memberIds.includes(u.id));

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 flex flex-col hover:border-mauve-500 dark:hover:border-mauve-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 animate-fadeInUp"
            style={{ '--delay': `${delay}ms` } as React.CSSProperties}
        >
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
            </div>

            <div className="mb-4">
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

            <div className="flex -space-x-2 mb-4">
                {teamMembers.slice(0, 4).map(member => (
                    <img 
                        key={member.id} 
                        src={member.avatarUrl} 
                        alt={member.name} 
                        title={member.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800" 
                    />
                ))}
                {teamMembers.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800">
                        +{teamMembers.length - 4}
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-auto">
                <button onClick={() => onSelect(project)} className="text-xs font-semibold text-mauve-600 dark:text-mauve-400 hover:text-mauve-700 dark:hover:text-mauve-300">Voir Détails</button>
            </div>
        </div>
    );
};

const EmptyState: React.FC<{ onAddProject: () => void }> = ({ onAddProject }) => (
    <div className="text-center py-20 animate-fadeIn">
        <svg className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Aucun projet pour le moment</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Commencez par créer votre premier projet.</p>
        <div className="mt-6">
            <button
                onClick={onAddProject}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-mauve-600 hover:bg-mauve-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mauve-500"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Créer un Projet
            </button>
        </div>
    </div>
);

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, tasks, users, onSelectProject, onAddProject }) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tous les Projets</h1>
                <button
                    onClick={onAddProject}
                    className="bg-mauve-600 hover:bg-mauve-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Créer un Projet
                </button>
            </div>
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} tasks={tasks} users={users} onSelect={onSelectProject} delay={index * 100} />
                    ))}
                </div>
            ) : (
                <EmptyState onAddProject={onAddProject} />
            )}
        </div>
    );
};