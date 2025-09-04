import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ReportsView } from './components/ReportsView';
import { CalendarView } from './components/CalendarView';
import { ProjectsView } from './components/ProjectsView';
import { TeamsView } from './components/TeamsView';
import { SettingsView } from './components/SettingsView';
import { CollaboratorsView } from './components/CollaboratorsView';
import { AddTaskModal } from './components/AddTaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { Task, User, Notification, TaskStatus, AppView, Project, Team } from './types';
import { INITIAL_TASKS, USERS, INITIAL_NOTIFICATIONS, PROJECTS, TEAMS, AVATAR_OPTIONS } from './constants';
import { ProjectDetailView } from './components/ProjectDetailView';
import { AddProjectModal } from './components/AddProjectModal';
import { AddCollaboratorModal } from './components/AddCollaboratorModal';
import { TeamDetailView } from './components/TeamDetailView';
import { AddEditTeamModal } from './components/AddEditTeamModal';

const viewTitles: Record<AppView, string> = {
  dashboard: 'Tableau de bord',
  projects: 'Projets',
  calendar: 'Calendrier',
  teams: 'Équipes',
  reports: 'Rapports',
  collaborators: 'Collaborateurs',
  settings: 'Paramètres',
};

type AppTheme = 'light' | 'dark';

interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<{
    config: ConfirmationState;
    onClose: () => void;
}> = ({ config, onClose }) => {
    if (!config.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn" onClick={onClose}>
            <div 
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-title"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn" 
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 id="confirmation-title" className="text-lg leading-6 font-bold text-gray-900 dark:text-gray-100 mt-4">{config.title}</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{config.message}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                    <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">
                        Annuler
                    </button>
                    <button onClick={() => { config.onConfirm(); onClose(); }} type="button" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [users, setUsers] = useState<User[]>(USERS);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddCollaboratorModalOpen, setIsAddCollaboratorModalOpen] = useState(false);
  
  const [theme, setTheme] = useState<AppTheme>('dark');
  
  const [confirmation, setConfirmation] = useState<ConfirmationState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddEditTeamModalOpen, setIsAddEditTeamModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleSignIn = () => {
    if (users.length > 0) {
      // Pour une application de démonstration, nous connectons le premier utilisateur.
      // Dans une application réelle, cela serait un écran de connexion.
      setCurrentUser(users[0]);
    } else {
      // Si aucun utilisateur n'existe, ouvrez le modal pour créer le premier.
      setIsAddCollaboratorModalOpen(true);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'timeLogged' | 'status'> & { id?: string }) => {
    if (taskToEdit && taskData.id) {
      // Update existing task
      setTasks(tasks.map(t => t.id === taskData.id ? { ...t, ...taskData, assigneeId: taskData.assigneeId } as Task : t));
    } else {
      // Add new task
      const taskToAdd: Task = {
        ...taskData,
        id: `t${Date.now()}`,
        timeLogged: 0,
        status: TaskStatus.TODO,
      };
      setTasks([taskToAdd, ...tasks]);
    }
    setIsAddEditModalOpen(false);
    setTaskToEdit(null);
  };
  
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleUpdateTimeLogged = (taskId: string, newTimeLogged: number) => {
    const newTasks = tasks.map(task =>
        task.id === taskId ? { ...task, timeLogged: newTimeLogged } : task
    );
    setTasks(newTasks);

    if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, timeLogged: newTimeLogged });
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
     const taskToDelete = tasks.find(t => t.id === taskId);
     if (!taskToDelete) return;
     setConfirmation({
        isOpen: true,
        title: 'Supprimer la Tâche',
        message: `Êtes-vous sûr de vouloir supprimer la tâche : "${taskToDelete.title}" ? Cette action est irréversible.`,
        onConfirm: () => {
            setTasks(tasks.filter(task => task.id !== taskId));
            setSelectedTask(null);
        }
     });
  };
  
  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(null); // Close detail view
    setTaskToEdit(task);
    setIsAddEditModalOpen(true);
  };

  const handleMarkNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const openAddTaskModal = () => {
    setTaskToEdit(null);
    setIsAddEditModalOpen(true);
  }

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p${Date.now()}`,
    };
    setProjects([newProject, ...projects]);
    setIsAddProjectModalOpen(false);
  };

  const handleSaveCollaborator = (newUserData: Omit<User, 'id' | 'notificationSettings'>) => {
    const newUser: User = {
        ...newUserData,
        id: `u${Date.now()}`,
        notificationSettings: { email: true, projectUpdates: true, taskAssignments: true } // Default settings
    };
    
    const isFirstUser = users.length === 0;

    setUsers(prevUsers => [newUser, ...prevUsers]);
    setIsAddCollaboratorModalOpen(false);

    // Si c'était le premier utilisateur créé, connectez-le automatiquement.
    if (isFirstUser) {
      setCurrentUser(newUser);
    }
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };
  
  const handleDeleteUsers = (userIds: string[]) => {
    const message = userIds.length > 1 
      ? `Êtes-vous sûr de vouloir supprimer ${userIds.length} collaborateurs ? Leurs tâches deviendront non assignées.`
      : `Êtes-vous sûr de vouloir supprimer ce collaborateur ? Ses tâches deviendront non assignées.`;

    setConfirmation({
        isOpen: true,
        title: 'Supprimer Collaborateur(s)',
        message: message,
        onConfirm: () => {
            setUsers(prevUsers => prevUsers.filter(u => !userIds.includes(u.id)));
            setTasks(prevTasks => prevTasks.map(task => 
                userIds.includes(task.assigneeId || '') ? { ...task, assigneeId: null } : task
            ));
            setProjects(prevProjects => prevProjects.map(project => ({
                ...project,
                memberIds: project.memberIds.filter(id => !userIds.includes(id))
            })));
            setTeams(prevTeams => prevTeams.map(team => ({
                ...team,
                memberIds: team.memberIds.filter(id => !userIds.includes(id))
            })));
        }
    });
  };

  const handleSaveTeam = (teamData: Omit<Team, 'id'> & { id?: string }) => {
    if (teamToEdit && teamData.id) {
      // Update
      const updatedTeam = { ...teamToEdit, ...teamData };
      setTeams(teams.map(t => t.id === teamData.id ? updatedTeam : t));
      if (selectedTeam && selectedTeam.id === teamData.id) {
        setSelectedTeam(updatedTeam);
      }
    } else {
      // Add
      const newTeam: Team = {
        ...teamData,
        id: `team${Date.now()}`
      };
      setTeams([newTeam, ...teams]);
    }
    setIsAddEditTeamModalOpen(false);
    setTeamToEdit(null);
  };

  const handleDeleteTeam = (teamId: string) => {
    const teamToDelete = teams.find(t => t.id === teamId);
    if (!teamToDelete) return;
    setConfirmation({
      isOpen: true,
      title: 'Supprimer l\'Équipe',
      message: `Êtes-vous sûr de vouloir supprimer l'équipe : "${teamToDelete.name}" ? Cette action est irréversible.`,
      onConfirm: () => {
        setTeams(teams.filter(t => t.id !== teamId));
        setSelectedTeam(null);
      }
    });
  };

  const handleOpenAddTeamModal = () => {
    setTeamToEdit(null);
    setIsAddEditTeamModalOpen(true);
  };

  const handleOpenEditTeamModal = (team: Team) => {
    setTeamToEdit(team);
    setIsAddEditTeamModalOpen(true);
  };


  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderView = () => {
    const viewProps = {
        key: currentView,
        className: 'animate-fadeIn'
    };
    
    switch(currentView) {
      case 'dashboard':
        return (
          <div {...viewProps}>
            <div className="p-6">
                <Dashboard 
                  tasks={filteredTasks} 
                  users={users} 
                  projects={projects}
                  onAddTask={openAddTaskModal} 
                  onUpdateTaskStatus={updateTaskStatus}
                  onSelectTask={setSelectedTask}
                />
            </div>
          </div>
        );
      case 'projects':
        return (
            <div {...viewProps}>
                 {selectedProject ? (
                    <ProjectDetailView 
                        project={selectedProject}
                        tasks={tasks.filter(t => t.projectId === selectedProject.id)}
                        users={users}
                        onBack={() => setSelectedProject(null)}
                        onUpdateTaskStatus={updateTaskStatus}
                    />
                ) : (
                     <ProjectsView 
                        projects={projects} 
                        tasks={tasks} 
                        users={users}
                        onSelectProject={setSelectedProject}
                        onAddProject={() => setIsAddProjectModalOpen(true)}
                    />
                )}
            </div>
        );
      case 'reports':
        return <div {...viewProps}><ReportsView tasks={tasks} users={users} /></div>;
      case 'calendar':
        return <div {...viewProps}><CalendarView tasks={filteredTasks} onSelectTask={setSelectedTask} /></div>;
      case 'teams':
        return (
            <div {...viewProps}>
                {selectedTeam ? (
                    <TeamDetailView
                        team={selectedTeam}
                        users={users}
                        tasks={tasks}
                        onBack={() => setSelectedTeam(null)}
                        onEdit={() => handleOpenEditTeamModal(selectedTeam)}
                        onDelete={() => handleDeleteTeam(selectedTeam.id)}
                    />
                ) : (
                    <TeamsView
                        teams={teams}
                        users={users}
                        tasks={tasks}
                        onSelectTeam={setSelectedTeam}
                        onAddTeam={handleOpenAddTeamModal}
                    />
                )}
            </div>
        );
      case 'collaborators':
        return <div {...viewProps}><CollaboratorsView users={users} tasks={tasks} onAddCollaborator={() => setIsAddCollaboratorModalOpen(true)} onDeleteUsers={handleDeleteUsers} /></div>;
      case 'settings':
        return <div {...viewProps}>{currentUser ? <SettingsView user={currentUser} onUpdateUser={handleUpdateUser} theme={theme} onThemeChange={setTheme} avatarOptions={AVATAR_OPTIONS} /> : null}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={viewTitles[currentView]}
          notifications={notifications} 
          currentUser={currentUser}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
          setView={setCurrentView}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {renderView()}
        </main>
      </div>
      
      {isAddEditModalOpen && (
        <AddTaskModal
          onClose={() => {
            setIsAddEditModalOpen(false);
            setTaskToEdit(null);
          }}
          onSaveTask={handleSaveTask}
          users={users}
          taskToEdit={taskToEdit}
          projects={projects}
        />
      )}

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          user={users.find(u => u.id === selectedTask.assigneeId)}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
          onEdit={handleOpenEditModal}
          onUpdateTimeLogged={handleUpdateTimeLogged}
        />
      )}

      {isAddProjectModalOpen && (
        <AddProjectModal
          onClose={() => setIsAddProjectModalOpen(false)}
          onSave={handleSaveProject}
          users={users}
        />
      )}

      {isAddCollaboratorModalOpen && (
        <AddCollaboratorModal
          onClose={() => setIsAddCollaboratorModalOpen(false)}
          onSave={handleSaveCollaborator}
          avatarOptions={AVATAR_OPTIONS}
        />
      )}

      {isAddEditTeamModalOpen && (
          <AddEditTeamModal
            onClose={() => {
                setIsAddEditTeamModalOpen(false);
                setTeamToEdit(null);
            }}
            onSave={handleSaveTeam}
            users={users}
            teamToEdit={teamToEdit}
          />
      )}

      <ConfirmationModal 
        config={confirmation}
        onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default App;