import React from 'react';
import type { Student, PersonalizedTask, Timetable, AttendanceRecord } from '../types';
import Card from './ui/Card';
import { CalendarIcon, LightBulbIcon, CheckCircleIcon } from './icons';
import { QRCodeSVG } from 'qrcode.react';

interface StudentDashboardProps {
  student: Student;
  tasks: PersonalizedTask[];
  timetable: Timetable;
  attendanceHistory: AttendanceRecord[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, tasks, timetable, attendanceHistory }) => {
  const today = new Date().toLocaleString('en-us', {  weekday: 'long' });
  const todaysSchedule = timetable[today] || [];
  
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-onSurface">Student Dashboard</h2>
        <p className="text-onSurfaceSecondary mt-1">Your daily schedule, tasks, and attendance.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <h3 className="text-xl font-bold mb-4">Your Attendance QR Code</h3>
                <div className="flex justify-center p-2 bg-white rounded-lg">
                    <QRCodeSVG value={student.qrCodeData} size={192} />
                </div>
                <p className="text-center text-sm mt-3 text-onSurfaceSecondary">Present this to your teacher for attendance.</p>
            </Card>
            <Card>
                <h3 className="text-xl font-bold mb-4 flex items-center"><CheckCircleIcon className="w-6 h-6 mr-2 text-primary"/>Attendance History</h3>
                <div className="max-h-60 overflow-y-auto">
                    {attendanceHistory.length > 0 ? (
                        <ul className="space-y-2">
                            {[...attendanceHistory].reverse().map((record, index) => (
                                <li key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md">
                                    <span className="font-semibold text-onSurface">{new Date(record.timestamp).toLocaleDateString()}</span>
                                    <span className="text-onSurfaceSecondary">{new Date(record.timestamp).toLocaleTimeString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-onSurfaceSecondary">You have no attendance records yet.</p>
                    )}
                </div>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <h3 className="text-xl font-bold mb-4 flex items-center"><CalendarIcon className="w-6 h-6 mr-2 text-primary"/>Today's Schedule ({today})</h3>
                <div className="max-h-96 overflow-y-auto">
                    {todaysSchedule.length > 0 ? (
                        <ul className="space-y-2">
                            {todaysSchedule.map((period, index) => (
                                <li key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                                    <span className="w-32 font-semibold text-primary text-sm">{period.time}</span>
                                    <span className={`flex-1 text-onSurface ${period.subject === 'Free Period' && 'italic text-onSurfaceSecondary'}`}>{period.subject}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-onSurfaceSecondary">No classes scheduled for today in the timetable.</p>
                    )}
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold mb-4 flex items-center"><LightBulbIcon className="w-6 h-6 mr-2 text-primary"/>Suggested Tasks from Teacher</h3>
                <div className="max-h-96 overflow-y-auto">
                    {tasks.length > 0 ? (
                        <ul className="space-y-3">
                            {[...tasks].reverse().map(task => (
                                <li key={task.id} className="p-3 bg-primary/5 rounded-lg">
                                    <h4 className="font-bold text-onSurface">{task.title}</h4>
                                    <p className="text-sm text-onSurfaceSecondary mt-1">{task.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-onSurfaceSecondary">Your teacher hasn't suggested any tasks yet.</p>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;