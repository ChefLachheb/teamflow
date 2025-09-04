import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NavIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="mr-3 z-10">{children}</span>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems: { name: string; icon: JSX.Element; id: AppView }[] = [
    { id: 'dashboard', name: 'Tableau de bord', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg> },
    { id: 'projects', name: 'Projets', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg> },
    { id: 'calendar', name: 'Calendrier', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { id: 'teams', name: 'Équipes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a3 3 0 01-5 0m0 0a3 3 0 015 0m0 0V3a3 3 0 013-3h1a3 3 0 013 3v1.143m-6 0a3 3 0 00-5 0" /></svg> },
    { id: 'reports', name: 'Rapports', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: 'collaborators', name: 'Collaborateurs', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg> },
  ];
  const isSettingsActive = currentView === 'settings';
  
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-mauve-500">
            <LogoIcon />
            <span className="ml-3 text-lg font-bold">TeamFlow</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="relative">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.name} className="relative">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isActive) setView(item.id);
                  }}
                  className={`relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 z-10 ${
                    isActive
                      ? 'text-mauve-700 dark:text-mauve-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`absolute inset-0 bg-mauve-100 dark:bg-mauve-900/50 rounded-lg transition-all duration-300 transform ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} />
                  <span className={`absolute left-0 top-0 bottom-0 w-1 bg-mauve-500 rounded-r-full transition-all duration-300 transform ${isActive ? 'scale-y-100' : 'scale-y-0'}`} />
                  <NavIcon>{item.icon}</NavIcon>
                  <span className="z-10">{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-4 py-4 mt-auto">
        <a href="#" onClick={(e) => { e.preventDefault(); setView('settings'); }} className={`relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isSettingsActive
            ? 'text-mauve-700 dark:text-mauve-300'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}>
            <div className={`absolute inset-0 bg-mauve-100 dark:bg-mauve-900/50 rounded-lg transition-all duration-300 transform ${isSettingsActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} />
            <span className={`absolute left-0 top-0 bottom-0 w-1 bg-mauve-500 rounded-r-full transition-all duration-300 transform ${isSettingsActive ? 'scale-y-100' : 'scale-y-0'}`} />
            <NavIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </NavIcon>
            <span className="z-10">Paramètres</span>
        </a>
      </div>
    </aside>
  );
};