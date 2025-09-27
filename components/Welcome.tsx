import React from 'react';
import Button from './ui/Button';
import { UserIcon, DashboardIcon } from './icons';

interface WelcomeProps {
  onNavigate: (view: 'studentLogin' | 'teacherLogin' | 'adminLogin') => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="text-center p-10 max-w-2xl mx-auto animate-fade-in bg-surface/90 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="inline-block bg-primary p-4 rounded-2xl mb-6 shadow-lg">
          <DashboardIcon className="w-12 h-12 text-onPrimary" />
        </div>
        <h1 className="text-5xl font-extrabold text-onSurface mb-4">
          Smart Curriculum & Attendance
        </h1>
        <p className="text-lg text-onSurfaceSecondary mb-10">
          Streamlining education with intelligent tools for attendance, scheduling, and personalized learning.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={() => onNavigate('studentLogin')} className="px-8 py-4 text-lg w-full flex items-center justify-center gap-2">
                <UserIcon className="w-6 h-6"/>
                Student Portal
            </Button>
            <Button onClick={() => onNavigate('teacherLogin')} className="px-8 py-4 text-lg w-full flex items-center justify-center gap-2 !bg-secondary hover:!bg-green-600">
                <UserIcon className="w-6 h-6"/>
                Teacher Portal
            </Button>
            <div className="sm:col-span-2">
                <Button onClick={() => onNavigate('adminLogin')} className="bg-onSurface hover:bg-onSurface/80 px-8 py-4 text-lg w-full">
                    Admin Portal
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;