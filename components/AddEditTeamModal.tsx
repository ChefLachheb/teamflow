import React, { useState, useEffect } from 'react';
import { Team, User } from '../types';

interface AddEditTeamModalProps {
  onClose: () => void;
  onSave: (team: Omit<Team, 'id'> & { id?: string }) => void;
  users: User[];
  teamToEdit?: Team | null;
}

const UserSelector: React.FC<{ user: User; isSelected: boolean; onToggle: () => void; }> = ({ user, isSelected, onToggle }) => (
    <div 
        onClick={onToggle}
        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-mauve-100 dark:bg-mauve-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
    >
        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
        <div className="flex-grow">
            <p className="font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-mauve-500 border-mauve-400' : 'border-gray-400 dark:border-gray-500'}`}>
            {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
    </div>
);

export const AddEditTeamModal: React.FC<AddEditTeamModalProps> = ({ onClose, onSave, users, teamToEdit }) => {
  const isEditing = !!teamToEdit;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing) {
      setName(teamToEdit.name);
      setDescription(teamToEdit.description);
      setMemberIds(teamToEdit.memberIds);
    }
  }, [teamToEdit, isEditing]);

  const toggleTeamMember = (userId: string) => {
    setMemberIds(prev => 
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
        alert('Veuillez donner un nom à l\'équipe.');
        return;
    }
    onSave({ id: teamToEdit?.id, name, description, memberIds });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20 animate-fadeIn" onClick={onClose}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="addEditTeamModalTitle"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl border border-gray-200 dark:border-gray-700 animate-scaleIn" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="addEditTeamModalTitle" className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Modifier l\'Équipe' : 'Créer une Nouvelle Équipe'}</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'Équipe</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"></textarea>
          </div>

          <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Membres</label>
             <div className="max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg space-y-2 border border-gray-200 dark:border-gray-700">
                {users.map(user => (
                    <UserSelector 
                        key={user.id}
                        user={user}
                        isSelected={memberIds.includes(user.id)}
                        onToggle={() => toggleTeamMember(user.id)}
                    />
                ))}
             </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-mauve-600 text-white rounded-lg hover:bg-mauve-700">{isEditing ? 'Enregistrer' : 'Créer l\'Équipe'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
