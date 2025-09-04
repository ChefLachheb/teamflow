import React, { useState, useEffect } from 'react';
import { User, Task, TaskPriority, Project } from '../types';

interface AddTaskModalProps {
  onClose: () => void;
  onSaveTask: (task: Omit<Task, 'id' | 'status' | 'timeLogged'> & { id?: string, estimatedTime: number }) => void;
  users: User[];
  taskToEdit?: Task | null;
  projects: Project[];
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onSaveTask, users, taskToEdit, projects }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | null>(users[0]?.id || null);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [estimatedTime, setEstimatedTime] = useState(8);
  const [projectId, setProjectId] = useState(projects[0]?.id || '');

  const isEditing = !!taskToEdit;

  useEffect(() => {
    if (isEditing) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setAssigneeId(taskToEdit.assigneeId);
      setDeadline(taskToEdit.deadline);
      setPriority(taskToEdit.priority);
      setEstimatedTime(taskToEdit.estimatedTime);
      setProjectId(taskToEdit.projectId);
    }
  }, [taskToEdit, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline || !projectId) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    onSaveTask({ 
        id: taskToEdit?.id,
        title, 
        description, 
        assigneeId, 
        deadline, 
        priority,
        estimatedTime,
        projectId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20 animate-fadeIn" onClick={onClose}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="addTaskModalTitle"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 animate-scaleIn" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="addTaskModalTitle" className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Modifier la Tâche' : 'Ajouter une Nouvelle Tâche'}</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"></textarea>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projet</label>
            <div className="absolute inset-y-0 left-3 top-6 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            </div>
            <select id="project" value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required>
                {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigné à</label>
              <div className="absolute inset-y-0 left-3 top-6 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
              <select id="assignee" value={assigneeId || ''} onChange={e => setAssigneeId(e.target.value || null)} className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                <option value="">Non assigné</option>
                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Échéance</label>
              <div className="absolute inset-y-0 left-3 top-6 flex items-center pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4 mb-6">
             <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priorité</label>
              <select id="priority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
             </div>
             <div>
               <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temps Estimé (h)</label>
               <input type="number" id="estimatedTime" value={estimatedTime} onChange={e => setEstimatedTime(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
             </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-mauve-600 text-white rounded-lg hover:bg-mauve-700">{isEditing ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
