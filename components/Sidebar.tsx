
import React from 'react';
import type { User, TeacherView, StudentView } from '../types';
import { DashboardIcon, UserIcon, CheckCircleIcon, CalendarIcon, LightBulbIcon, UserCircleIcon, LogoutIcon } from './icons';

interface SidebarProps {
  user: User;
  currentView: TeacherView | StudentView;
  setView: (view: any) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-primary text-onPrimary shadow-md' : 'text-onSurfaceSecondary hover:bg-gray-200'
    }`}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, setView, onLogout }) => {
  const teacherNavItems = [
    { view: 'dashboard', icon: <DashboardIcon className="w-6 h-6" />, label: 'Dashboard' },
    { view: 'students', icon: <UserIcon className="w-6 h-6" />, label: 'Students' },
    { view: 'attendance', icon: <CheckCircleIcon className="w-6 h-6" />, label: 'Attendance' },
    { view: 'timetable', icon: <CalendarIcon className="w-6 h-6" />, label: 'Timetable' },
    { view: 'tasks', icon: <LightBulbIcon className="w-6 h-6" />, label: 'Tasks' },
    { view: 'profile', icon: <UserCircleIcon className="w-6 h-6" />, label: 'Profile' },
  ];
  
  const studentNavItems = [
    { view: 'dashboard', icon: <DashboardIcon className="w-6 h-6" />, label: 'Dashboard' },
    { view: 'profile', icon: <UserCircleIcon className="w-6 h-6" />, label: 'My Profile' },
  ];

  const navItems = user.role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-surface p-6 flex flex-col h-screen border-r border-gray-200">
      <div className="flex items-center space-x-3 mb-10">
        <div className="p-3 bg-primary rounded-xl shadow-lg">
          <DashboardIcon className="w-8 h-8 text-onPrimary" />
        </div>
        <h1 className="text-xl font-bold text-onSurface">SmartCampus</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.view}
            onClick={() => setView(item.view)}
          />
        ))}
      </nav>
      
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-onSurfaceSecondary hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
        >
          <LogoutIcon className="w-6 h-6" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
