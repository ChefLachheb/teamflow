import React, { useState, useEffect, useRef } from 'react';
import { Notification } from '../types';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-10 border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">Notifications</div>
          <ul className="overflow-y-auto max-h-80">
            {notifications.length === 0 && (
                <li className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">Aucune notification</li>
            )}
            {notifications.map(notification => (
              <li key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700/50 text-sm ${!notification.read ? 'bg-mauve-50 dark:bg-mauve-900/40' : ''}`}>
                <p className="text-gray-700 dark:text-gray-300">{notification.message}</p>
              </li>
            ))}
          </ul>
          {unreadCount > 0 && (
             <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <button onClick={onMarkAsRead} className="w-full text-center text-sm font-medium text-mauve-600 dark:text-mauve-400 hover:text-mauve-700 dark:hover:text-mauve-300 py-1">
                    Tout marquer comme lu
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};