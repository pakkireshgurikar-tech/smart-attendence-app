import type { QRCodeSVG } from 'qrcode.react';

export type Role = 'admin' | 'teacher' | 'student';

export interface User {
    id: number;
    name: string;
    role: Role;
}

export interface Admin {
    id: number;
    email: string;
    password: string;
}

export interface StudentProfile {
    interests: string;
    strengths: string;
    careerGoals: string;
}

export interface Student extends User {
    role: 'student';
    uniqueId: string;
    password: string;
    teacherId: number;
    profile: StudentProfile;
    age: number;
    rollNo: string;
    gender: 'Male' | 'Female' | 'Other';
    qrCodeData: string;
}

export interface Teacher extends User {
    role: 'teacher';
    uniqueId: string;
    password: string;
    subject: string;
}

export interface PersonalizedTask {
    id: number;
    title: string;
    description: string;
    assignedBy: number; // Teacher ID
}

export interface TimetablePeriod {
    time: string;
    subject: string;
}

export interface Timetable {
    [day: string]: TimetablePeriod[];
}

export interface ScheduleEntry {
    day: string;
    periods: TimetablePeriod[];
}

export interface PasswordStrength {
    score: number;
    label: string;
}

export interface SuggestedTask {
    title: string;
    description: string;
    duration: number;
}

export interface DailyRoutine {
    time: string;
    activity: string;
    category: string;
}

export interface AttendanceRecord {
    studentId: number;
    timestamp: string; // ISO 8601 string
}

export type MarkAttendanceResult = 
    | { success: true; student: Student }
    | { success: false; message: string };

export type TeacherView = 'dashboard' | 'students' | 'attendance' | 'timetable' | 'tasks' | 'profile';
export type StudentView = 'dashboard' | 'profile';
export type AppView = 'welcome' | 'adminLogin' | 'teacherLogin' | 'studentLogin' | 'adminRegister' | 'app';