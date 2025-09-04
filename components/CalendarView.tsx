import React, { useState } from 'react';
import { Task, TaskPriority } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'bg-red-500',
  [TaskPriority.MEDIUM]: 'bg-yellow-500',
  [TaskPriority.LOW]: 'bg-green-500',
};

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const startDayOfWeek = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1; // 0=Lundi, 6=Dimanche
  const daysInMonth = endOfMonth.getDate();

  const days = [];
  // Days from previous month
  for (let i = 0; i < startDayOfWeek; i++) {
    const day = new Date(startOfMonth);
    day.setDate(day.getDate() - (startDayOfWeek - i));
    days.push({ date: day, isCurrentMonth: false });
  }

  // Days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    days.push({ date: day, isCurrentMonth: true });
  }

  // Days from next month
  const remainingCells = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingCells; i++) {
    const day = new Date(endOfMonth);
    day.setDate(day.getDate() + i);
    days.push({ date: day, isCurrentMonth: false });
  }
  
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
        // Adjust for timezone differences by comparing dates as strings
        const taskDeadline = new Date(task.deadline);
        return taskDeadline.toDateString() === day.toDateString();
    });
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const today = new Date();
  const isToday = (day: Date) => 
    day.getDate() === today.getDate() &&
    day.getMonth() === today.getMonth() &&
    day.getFullYear() === today.getFullYear();


  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">
          {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex items-center space-x-2">
          <button onClick={goToPrevMonth} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={goToNextMonth} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {weekDays.map(day => (
            <div key={day} className="text-center py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-6">
          {days.map(({ date, isCurrentMonth }, index) => {
            const tasksOnDay = getTasksForDay(date);
            return (
              <div key={index} className={`p-2 border-r border-b border-gray-200 dark:border-gray-700 h-32 flex flex-col ${!isCurrentMonth ? 'bg-gray-100/50 dark:bg-gray-800/50' : ''} [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0`}>
                <div className={`flex justify-end text-sm font-semibold mb-1 ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''} ${isToday(date) ? 'text-mauve-600 dark:text-mauve-400' : ''}`}>
                   <span className={`${isToday(date) ? 'bg-mauve-500 text-white rounded-full flex items-center justify-center w-6 h-6' : 'w-6 h-6'}`}>
                     {date.getDate()}
                   </span>
                </div>
                <div className="overflow-y-auto space-y-1 pr-1 -mr-1">
                  {tasksOnDay.map(task => (
                    <button key={task.id} onClick={() => onSelectTask(task)} className="w-full text-left p-1.5 rounded-md text-xs font-medium text-white transition-colors duration-200 bg-mauve-600/90 dark:bg-mauve-800/70 hover:bg-mauve-700 dark:hover:bg-mauve-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-mauve-500">
                       <div className="flex items-center">
                         <span className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${priorityColors[task.priority]}`}></span>
                         <span className="truncate">{task.title}</span>
                       </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
