import React, { useState, useEffect } from 'react';
import { User, NotificationSettings } from '../types';

type SettingsTab = 'profile' | 'notifications' | 'appearance';
type AppTheme = 'light' | 'dark';

interface SettingsViewProps {
    user: User;
    onUpdateUser: (user: User) => void;
    theme: AppTheme;
    onThemeChange: (theme: AppTheme) => void;
    avatarOptions: string[];
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            active
            ? 'bg-mauve-600 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; label: string; description: string; }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50">
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                enabled ? 'bg-mauve-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
        </button>
    </div>
);


export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser, theme, onThemeChange, avatarOptions }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [formData, setFormData] = useState({
        name: user.name,
        role: user.role,
        email: user.email,
        avatarUrl: user.avatarUrl,
    });
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(user.notificationSettings);

    useEffect(() => {
        setFormData({
            name: user.name,
            role: user.role,
            email: user.email,
            avatarUrl: user.avatarUrl,
        });
        setNotificationSettings(user.notificationSettings);
    }, [user]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleAvatarChange = (url: string) => {
        setFormData(prev => ({...prev, avatarUrl: url}));
    }

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({ ...user, ...formData });
        alert('Profil enregistré !');
    };
    
    const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
        const newSettings = { ...notificationSettings, [key]: value };
        setNotificationSettings(newSettings);
        onUpdateUser({ ...user, notificationSettings: newSettings });
    };

    const renderContent = () => {
        const contentProps = {
            key: activeTab,
            className: 'animate-fadeIn'
        };

        switch (activeTab) {
            case 'profile':
                return (
                    <div {...contentProps}>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Informations Personnelles</h3>
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Photo de profil</label>
                                    <div className="flex items-center space-x-6">
                                        <img src={formData.avatarUrl} alt={formData.name} className="w-20 h-20 rounded-full object-cover" />
                                        <div className="grid grid-cols-4 gap-2">
                                            {avatarOptions.map(url => (
                                                <button key={url} type="button" onClick={() => handleAvatarChange(url)} className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${formData.avatarUrl === url ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-mauve-500' : 'hover:scale-110'}`}>
                                                    <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nom complet</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"/>
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Rôle</label>
                                        <input type="text" id="role" name="role" value={formData.role} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"/>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Adresse e-mail</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"/>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="submit" className="px-6 py-2 bg-mauve-600 text-white font-semibold rounded-lg hover:bg-mauve-700">Enregistrer les modifications</button>
                            </div>
                        </form>
                    </div>
                );
            case 'notifications':
                 return (
                    <div {...contentProps}>
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Préférences de Notification</h3>
                            <ToggleSwitch 
                                label="Notifications par e-mail"
                                description="Recevoir un résumé des activités par e-mail."
                                enabled={notificationSettings.email}
                                onChange={(val) => handleNotificationChange('email', val)}
                            />
                            <ToggleSwitch 
                                label="Mises à jour de projet"
                                description="Être notifié des changements majeurs sur vos projets."
                                enabled={notificationSettings.projectUpdates}
                                onChange={(val) => handleNotificationChange('projectUpdates', val)}
                            />
                            <ToggleSwitch 
                                label="Assignations de tâches"
                                description="Recevoir une notification lorsqu'une tâche vous est assignée."
                                enabled={notificationSettings.taskAssignments}
                                onChange={(val) => handleNotificationChange('taskAssignments', val)}
                            />
                        </div>
                    </div>
                 );
            case 'appearance':
                return (
                    <div {...contentProps}>
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Thème de l'Application</h3>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all ${theme === 'light' ? 'border-mauve-500' : 'border-gray-200 dark:border-gray-700'}`}
                                    style={{backgroundColor: 'var(--theme-ui-colors-background)'}}
                                >
                                    <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => onThemeChange('light')} className="h-4 w-4 text-mauve-600 focus:ring-mauve-500"/>
                                    <span className="ml-3 font-medium text-gray-800">Clair</span>
                                </label>
                                <label className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all ${theme === 'dark' ? 'border-mauve-500' : 'border-gray-200 dark:border-gray-700'}`}
                                    style={{backgroundColor: '#1f2937'}}
                                >
                                    <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => onThemeChange('dark')} className="h-4 w-4 text-mauve-600 focus:ring-mauve-500 bg-gray-700 border-gray-600" />
                                    <span className="ml-3 font-medium text-white">Sombre</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Profil & Paramètres</h1>
            <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>Profil</TabButton>
                <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>Notifications</TabButton>
                <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')}>Apparence</TabButton>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};