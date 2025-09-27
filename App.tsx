import React, { useState, useEffect } from 'react';
import './index.css';
import type { AppView, Admin, Teacher, Student, PersonalizedTask, Timetable, StudentProfile, AttendanceRecord, MarkAttendanceResult } from './types';
import { ADMIN_REGISTRATION_SECRET_KEY, MOCK_SCHEDULE } from './constants';

// Components
import Welcome from './components/Welcome';
import Login from './components/Login';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import TeacherStudentApp from './components/TeacherStudentApp';

// Utility to get data from localStorage
const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

const generatePassword = () => Math.random().toString(36).slice(-8);

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('welcome');
  const [currentUser, setCurrentUser] = usePersistentState<Teacher | Student | Admin | null>('currentUser', null);

  // --- Data Stores ---
  const [admins, setAdmins] = usePersistentState<Admin[]>('admins', []);
  const [teachers, setTeachers] = usePersistentState<Teacher[]>('teachers', []);
  const [students, setStudents] = usePersistentState<Student[]>('students', []);
  const [tasks, setTasks] = usePersistentState<PersonalizedTask[]>('tasks', []);
  const [timetable, setTimetable] = usePersistentState<Timetable>('timetable', {});
  const [attendance, setAttendance] = usePersistentState<AttendanceRecord[]>('attendance', []);
  
  // --- Authentication ---
  const handleAdminLogin = (credentials: { email: string; pass: string }) => {
    const admin = admins.find(a => a.email.trim() === credentials.email.trim() && a.password === credentials.pass);
    if (admin) {
      setCurrentUser(admin);
      setView('app');
      return true;
    }
    return false;
  };

  const handleUserLogin = (credentials: { uniqueId: string; pass: string }) => {
    const user = [...teachers, ...students].find(u => u.uniqueId.trim() === credentials.uniqueId.trim() && u.password === credentials.pass);
    if (user) {
      setCurrentUser(user);
      setView('app');
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setView('welcome');
  };
  
  // --- Registration ---
  const handleAdminRegister = (credentials: { email: string; pass: string; secret: string }) => {
    if (credentials.secret.trim() !== ADMIN_REGISTRATION_SECRET_KEY) return false;
    if (admins.some(a => a.email.trim() === credentials.email.trim())) return false;
    
    const newAdmin: Admin = {
      id: Date.now(),
      email: credentials.email,
      password: credentials.pass,
    };
    setAdmins(prev => [...prev, newAdmin]);
    return true;
  };
  
  const handleRegisterTeacher = (teacherData: { name: string; subject: string; }) => {
    const newTeacher: Teacher = {
      id: Date.now(),
      name: teacherData.name,
      subject: teacherData.subject,
      uniqueId: `T-${Date.now().toString().slice(-6)}`,
      password: generatePassword(),
      role: 'teacher',
    };
    setTeachers(prev => [...prev, newTeacher]);
    return { uniqueId: newTeacher.uniqueId, password: newTeacher.password };
  };
  
  const handleRegisterStudent = (studentData: { name: string; teacherId: number; age: number; rollNo: string; gender: 'Male' | 'Female' | 'Other' }) => {
    const uniqueId = `S-${Date.now().toString().slice(-6)}`;
    const newStudent: Student = {
      id: Date.now(),
      name: studentData.name,
      teacherId: studentData.teacherId,
      uniqueId: uniqueId,
      password: generatePassword(),
      role: 'student',
      age: studentData.age,
      rollNo: studentData.rollNo,
      gender: studentData.gender,
      qrCodeData: uniqueId, // QR code will contain the unique ID
      profile: {
        interests: 'Not set',
        strengths: 'Not set',
        careerGoals: 'Not set',
      },
    };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  // --- Data Management ---
  const handleRemoveStudent = (studentId: number, teacherId: number) => {
    setStudents(prev => prev.filter(s => !(s.id === studentId && s.teacherId === teacherId)));
  };

  const handleAddPersonalizedTask = (task: Omit<PersonalizedTask, 'id' | 'assignedBy'>) => {
    if (currentUser && 'role' in currentUser && currentUser.role === 'teacher') {
      const newTask: PersonalizedTask = {
        ...task,
        id: Date.now(),
        assignedBy: currentUser.id,
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const handleUpdateTeacher = (teacherId: number, data: { name: string; subject: string; }) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, ...data } : t));
    if (currentUser?.id === teacherId) {
        setCurrentUser(prev => prev ? {...prev, ...data} as Teacher : null);
    }
  };

  const handleUpdateStudent = (studentId: number, profile: StudentProfile) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, profile } : s));
    if (currentUser?.id === studentId) {
        setCurrentUser(prev => prev ? {...prev, profile} as Student : null);
    }
  };

  const markStudentAttendance = (scannedId: string): MarkAttendanceResult => {
    const student = students.find(s => s.uniqueId === scannedId.trim());
    if (!student) {
      return { success: false, message: "Invalid QR Code: Student not found." };
    }
    
    const today = new Date().toISOString().split('T')[0];
    const hasAttendedToday = attendance.some(record => {
        const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
        return record.studentId === student.id && recordDate === today;
    });

    if (hasAttendedToday) {
      return { success: false, message: `${student.name} is already marked present today.` };
    }
    
    const newRecord: AttendanceRecord = {
        studentId: student.id,
        timestamp: new Date().toISOString(),
    };
    setAttendance(prev => [...prev, newRecord]);
    return { success: true, student };
  };

  const renderContent = () => {
    if (view === 'app' && currentUser) {
      if ('email' in currentUser) { // It's an Admin
        return <AdminDashboard admin={currentUser} teachers={teachers} registerTeacher={handleRegisterTeacher} onLogout={handleLogout} />;
      }
      if ('role' in currentUser && (currentUser.role === 'teacher' || currentUser.role === 'student')) {
        const student = currentUser as Student; // For role === 'student' case
        const studentsForTeacher = students.filter(s => s.teacherId === currentUser.id);
        const tasksForTeacher = tasks.filter(t => t.assignedBy === currentUser.id);
        const tasksForStudent = tasks.filter(t => t.assignedBy === student.teacherId);
        const attendanceForStudent = attendance.filter(a => a.studentId === student.id);
        
        return (
          <TeacherStudentApp
            user={currentUser as Teacher | Student}
            students={currentUser.role === 'teacher' ? studentsForTeacher : []}
            tasks={currentUser.role === 'teacher' ? tasksForTeacher : tasksForStudent}
            timetable={timetable}
            schedule={MOCK_SCHEDULE}
            attendance={attendance}
            studentAttendanceHistory={currentUser.role === 'student' ? attendanceForStudent : []}
            onLogout={handleLogout}
            registerStudent={handleRegisterStudent}
            removeStudent={handleRemoveStudent}
            addPersonalizedTask={handleAddPersonalizedTask}
            setTimetable={setTimetable}
            onUpdateTeacher={handleUpdateTeacher}
            onUpdateStudent={handleUpdateStudent}
            markStudentAttendance={markStudentAttendance}
          />
        );
      }
    }

    switch (view) {
      case 'studentLogin':
        return <Login mode="student" onUserLogin={handleUserLogin} onBack={() => setView('welcome')} />;
      case 'teacherLogin':
        return <Login mode="teacher" onUserLogin={handleUserLogin} onBack={() => setView('welcome')} />;
      case 'adminLogin':
        return <Login mode="admin" onAdminLogin={handleAdminLogin} onBack={() => setView('welcome')} onNavigateToRegister={() => setView('adminRegister')} />;
      case 'adminRegister':
        return <AdminRegister onRegister={handleAdminRegister} onNavigateToLogin={() => setView('adminLogin')} />;
      case 'welcome':
      default:
        return <Welcome onNavigate={(v) => setView(v)} />;
    }
  };

  return <div className="App">{renderContent()}</div>;
};

export default App;