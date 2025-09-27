import React, { useState } from 'react';
import type { User, Teacher, Student, TeacherView, StudentView, Timetable, PersonalizedTask, ScheduleEntry, StudentProfile, AttendanceRecord, MarkAttendanceResult } from '../types';
import Sidebar from './Sidebar';
import Header from './Header';
import TeacherDashboard from './TeacherDashboard';
import StudentRoster from './StudentRoster';
import AttendanceManager from './AttendanceManager';
import TimetableManager from './TimetableManager';
import TaskManager from './TaskManager';
import TeacherProfile from './TeacherProfile';
import StudentDashboard from './StudentDashboard';
import StudentProfileComponent from './StudentProfile';

interface TeacherStudentAppProps {
  user: Teacher | Student;
  students: Student[];
  tasks: PersonalizedTask[];
  timetable: Timetable;
  schedule: ScheduleEntry[];
  attendance: AttendanceRecord[];
  studentAttendanceHistory: AttendanceRecord[];
  onLogout: () => void;
  registerStudent: (studentData: { name: string; teacherId: number; age: number; rollNo: string; gender: 'Male' | 'Female' | 'Other' }) => Student;
  removeStudent: (studentId: number, teacherId: number) => void;
  addPersonalizedTask: (task: Omit<PersonalizedTask, 'id' | 'assignedBy'>) => void;
  setTimetable: (timetable: Timetable) => void;
  onUpdateTeacher: (teacherId: number, data: { name: string; subject: string; }) => void;
  onUpdateStudent: (studentId: number, profile: StudentProfile) => void;
  markStudentAttendance: (scannedId: string) => MarkAttendanceResult;
}

const TeacherStudentApp: React.FC<TeacherStudentAppProps> = (props) => {
  const [currentView, setCurrentView] = useState<TeacherView | StudentView>('dashboard');

  const renderTeacherContent = () => {
    const teacher = props.user as Teacher;
    switch (currentView as TeacherView) {
      case 'dashboard':
        return <TeacherDashboard students={props.students} setView={setCurrentView} />;
      case 'students':
        return <StudentRoster teacher={teacher} students={props.students} registerStudent={props.registerStudent} removeStudent={props.removeStudent} />;
      case 'attendance':
        return <AttendanceManager students={props.students} attendance={props.attendance} markStudentAttendance={props.markStudentAttendance} />;
      case 'timetable':
        return <TimetableManager timetable={props.timetable} setTimetable={props.setTimetable} />;
      case 'tasks':
        return <TaskManager tasks={props.tasks} addPersonalizedTask={props.addPersonalizedTask} />;
      case 'profile':
        return <TeacherProfile teacher={teacher} onUpdate={props.onUpdateTeacher} />;
      default:
        return <TeacherDashboard students={props.students} setView={setCurrentView} />;
    }
  };

  const renderStudentContent = () => {
    const student = props.user as Student;
    switch (currentView as StudentView) {
      case 'dashboard':
        return <StudentDashboard student={student} tasks={props.tasks} timetable={props.timetable} attendanceHistory={props.studentAttendanceHistory} />;
      case 'profile':
        return <StudentProfileComponent student={student} schedule={props.schedule} onUpdate={props.onUpdateStudent} />;
      default:
        return <StudentDashboard student={student} tasks={props.tasks} timetable={props.timetable} attendanceHistory={props.studentAttendanceHistory} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={props.user} currentView={currentView} setView={setCurrentView} onLogout={props.onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={props.user} onLogout={props.onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-8">
          {props.user.role === 'teacher' ? renderTeacherContent() : renderStudentContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherStudentApp;