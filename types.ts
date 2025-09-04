export interface NotificationSettings {
    email: boolean;
    projectUpdates: boolean;
    taskAssignments: boolean;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  email: string;
  notificationSettings: NotificationSettings;
}

export enum TaskStatus {
  TODO = 'À Faire',
  IN_PROGRESS = 'En Cours',
  DONE = 'Terminé',
}

export enum TaskPriority {
  LOW = 'Basse',
  MEDIUM = 'Moyenne',
  HIGH = 'Haute',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  timeLogged: number; // in hours
  estimatedTime: number; // in hours
  projectId: string;
}

export interface Notification {
  id:string;
  message: string;
  read: boolean;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    memberIds: string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
}

export type AppView = 'dashboard' | 'projects' | 'calendar' | 'teams' | 'reports' | 'collaborators' | 'settings';