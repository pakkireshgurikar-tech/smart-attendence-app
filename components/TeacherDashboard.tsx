import React from 'react';
import type { Student, TeacherView } from '../types';
import Card from './ui/Card';
import { UserIcon, CheckCircleIcon, CalendarIcon, LightBulbIcon } from './icons';

interface TeacherDashboardProps {
  students: Student[];
  setView: (view: TeacherView) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">{icon}</div>
        <div>
            <p className="text-sm font-medium text-onSurfaceSecondary">{title}</p>
            <p className="text-2xl font-bold text-onSurface">{value}</p>
        </div>
    </Card>
);


const QuickAccessCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
    <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer" onClick={onClick}>
        <div className="flex items-center text-primary mb-2">
            {icon}
            <h4 className="font-bold text-lg ml-2">{title}</h4>
        </div>
        <p className="text-sm text-onSurfaceSecondary">{description}</p>
    </Card>
);

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ students, setView }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-onSurface">Teacher Dashboard</h2>
        <p className="text-onSurfaceSecondary mt-1">Overview of your class and quick access to tools.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Students" value={students.length.toString()} icon={<UserIcon className="w-8 h-8"/>} />
        {/* Placeholder stats */}
        <StatCard title="Overall Attendance" value="92%" icon={<CheckCircleIcon className="w-8 h-8"/>} />
        <StatCard title="Next Class" value="10:00 AM" icon={<CalendarIcon className="w-8 h-8"/>} />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Management Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAccessCard 
                title="Manage Students" 
                description="Add or remove students from your roster." 
                icon={<UserIcon className="w-6 h-6"/>}
                onClick={() => setView('students')}
            />
            <QuickAccessCard 
                title="Take Attendance" 
                description="Start a new attendance session using QR codes." 
                icon={<CheckCircleIcon className="w-6 h-6"/>}
                onClick={() => setView('attendance')}
            />
             <QuickAccessCard 
                title="Set Timetable" 
                description="Upload or modify the weekly class schedule." 
                icon={<CalendarIcon className="w-6 h-6"/>}
                onClick={() => setView('timetable')}
            />
             <QuickAccessCard 
                title="Suggest Tasks" 
                description="Assign personalized tasks to students." 
                icon={<LightBulbIcon className="w-6 h-6"/>}
                onClick={() => setView('tasks')}
            />
        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;
