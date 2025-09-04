import React, { useState, useEffect, useRef } from 'react';
import { NotificationBell } from './NotificationBell';
import { AppView, Notification, User } from '../types';
import { GoogleSignInButton } from './GoogleSignInButton';

interface HeaderProps {
    title: string;
    notifications: Notification[];
    currentUser: User | null;
    onSignIn: () => void;
    onSignOut: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onMarkNotificationsAsRead: () => void;
    setView: (view: AppView) => void;
}

const UserProfile: React.FC<{ user: User; onSignOut: () => void; setView: (view: AppView) => void; }> = ({ user, onSignOut, setView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigateToSettings = (e: React.MouseEvent) => {
        e.preventDefault();
        setView('settings');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-3">
                <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="text-sm text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">{user.role}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-10 border border-gray-200 dark:border-gray-700">
                    <ul>
                        <li>
                            <a href="#" onClick={navigateToSettings} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Profil</a>
                        </li>
                        <li>
                            <button onClick={onSignOut} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Se déconnecter
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ title, notifications, currentUser, onSignIn, onSignOut, searchTerm, onSearchChange, onMarkNotificationsAsRead, setView }) => {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      </div>
      <div className="flex items-center space-x-5">
        <div className="relative">
          <input
            type="search"
            placeholder="Rechercher des tâches..."
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 transition-shadow bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        
        <NotificationBell notifications={notifications} onMarkAsRead={onMarkNotificationsAsRead} />

        {currentUser ? (
          <UserProfile user={currentUser} onSignOut={onSignOut} setView={setView} />
        ) : (
          <GoogleSignInButton onClick={onSignIn} />
        )}
      </div>
    </header>
  );
};