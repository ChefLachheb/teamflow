import React from 'react';
import { Task, TaskStatus, User } from '../types';

interface ReportsViewProps {
  tasks: Task[];
  users: User[];
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: JSX.Element;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl flex items-center space-x-4 border border-gray-200 dark:border-gray-700/50">
        <div className="p-3 rounded-full bg-mauve-100 dark:bg-mauve-900/50 text-mauve-600 dark:text-mauve-400">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);


interface ChartData {
    name: string;
    value: number;
}

const statusToColor: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'fill-gray-500',
  [TaskStatus.IN_PROGRESS]: 'fill-blue-500',
  [TaskStatus.DONE]: 'fill-green-500',
};


const TaskStatusBarChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
    const chartHeight = 200;
    const barWidth = 40;
    const barMargin = 30;
    const svgWidth = data.length * (barWidth + barMargin);

    return (
        <div className="w-full flex justify-center">
            <svg width={svgWidth} height={chartHeight + 40} className="font-sans">
                <g>
                    {data.map((d, i) => {
                        const barHeight = (d.value / maxValue) * chartHeight;
                        const x = i * (barWidth + barMargin);
                        const y = chartHeight - barHeight;
                        return (
                            <g key={d.name}>
                                <rect 
                                    x={x} 
                                    y={y} 
                                    width={barWidth} 
                                    height={barHeight} 
                                    className={`${statusToColor[d.name as TaskStatus]} transition-all duration-300`}
                                    rx="4"
                                />
                                <text x={x + barWidth / 2} y={chartHeight + 15} textAnchor="middle" className="text-xs fill-gray-500 dark:fill-gray-400 font-medium">
                                    {d.name}
                                </text>
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-sm fill-gray-800 dark:fill-gray-200 font-bold">
                                    {d.value}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

const UserProductivity: React.FC<{ users: User[], tasks: Task[] }> = ({ users, tasks }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 mt-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Productivité par Membre</h2>
            <div className="space-y-4">
                {users.map(user => {
                    const userTasks = tasks.filter(t => t.assigneeId === user.id);
                    const completed = userTasks.filter(t => t.status === TaskStatus.DONE).length;
                    const total = userTasks.length;
                    const timeLogged = userTasks.reduce((acc, t) => acc + t.timeLogged, 0);
                    const estimatedTime = userTasks.reduce((acc, t) => acc + t.estimatedTime, 0);
                    const productivityRatio = estimatedTime > 0 ? (timeLogged / estimatedTime) * 100 : 0;

                    return (
                        <div key={user.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover mr-4" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{completed} / {total} tâches terminées</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className="font-semibold text-gray-900 dark:text-gray-100">{timeLogged.toFixed(1)}h / <span className="text-gray-500 dark:text-gray-400">{estimatedTime}h</span></p>
                                     <p className={`text-sm font-bold ${productivityRatio > 100 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                                        {productivityRatio > 0 ? `${productivityRatio.toFixed(0)}% d'estimation` : `N/A`}
                                     </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tasks, users }) => {
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const doneTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const overdueTasks = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== TaskStatus.DONE).length;
  const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO).length;

  const chartData: ChartData[] = [
      { name: TaskStatus.TODO, value: todoTasks },
      { name: TaskStatus.IN_PROGRESS, value: inProgressTasks },
      { name: TaskStatus.DONE, value: doneTasks },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Aperçu du Projet</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            title="Total des Tâches" 
            value={totalTasks}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} 
        />
         <StatCard 
            title="En Cours" 
            value={inProgressTasks}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" /></svg>}
        />
        <StatCard 
            title="Terminées" 
            value={doneTasks}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
            title="En Retard" 
            value={overdueTasks}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Répartition des Tâches par Statut</h2>
        <TaskStatusBarChart data={chartData} />
      </div>

      <UserProductivity users={users} tasks={tasks} />
    </div>
  );
};