import React, { useState } from 'react';
import { User } from '../types';

interface AddCollaboratorModalProps {
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'notificationSettings'>) => void;
  avatarOptions: string[];
}

export const AddCollaboratorModal: React.FC<AddCollaboratorModalProps> = ({ onClose, onSave, avatarOptions }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(avatarOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !email) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    onSave({ 
        name, 
        role, 
        email, 
        avatarUrl
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20 animate-fadeIn" onClick={onClose}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="addCollabModalTitle"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 animate-scaleIn" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="addCollabModalTitle" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ajouter un Collaborateur</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
            <input type="text" id="role" value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
          </div>
           <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse e-mail</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
          </div>
           <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avatar</label>
            <div className="flex flex-wrap gap-2">
                {avatarOptions.map(url => (
                    <button key={url} type="button" onClick={() => setAvatarUrl(url)} className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${avatarUrl === url ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-mauve-500' : 'hover:scale-110'}`}>
                        <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-mauve-600 text-white rounded-lg hover:bg-mauve-700">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};
