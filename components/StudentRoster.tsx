import React, { useState } from 'react';
import type { Student, Teacher } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { UserIcon } from './icons';
import { QRCodeSVG } from 'qrcode.react';

interface StudentRosterProps {
  teacher: Teacher;
  students: Student[];
  registerStudent: (studentData: { name: string; teacherId: number; age: number; rollNo: string; gender: 'Male' | 'Female' | 'Other' }) => Student;
  removeStudent: (studentId: number, teacherId: number) => void;
}

const StudentRoster: React.FC<StudentRosterProps> = ({ teacher, students, registerStudent, removeStudent }) => {
  const [newStudent, setNewStudent] = useState({ name: '', age: '', rollNo: '', gender: 'Male' as 'Male' | 'Female' | 'Other' });
  const [error, setError] = useState('');
  const [newlyRegistered, setNewlyRegistered] = useState<Student | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopiedText(key);
        setTimeout(() => setCopiedText(null), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNewlyRegistered(null);
    if (!newStudent.name || !newStudent.age || !newStudent.rollNo) {
      setError('Please fill out all fields.');
      return;
    }
    try {
        const registeredStudent = registerStudent({ 
            name: newStudent.name, 
            teacherId: teacher.id,
            age: parseInt(newStudent.age, 10),
            rollNo: newStudent.rollNo,
            gender: newStudent.gender
        });
        if (registeredStudent) {
            setNewlyRegistered(registeredStudent);
            setNewStudent({ name: '', age: '', rollNo: '', gender: 'Male' }); // Reset form
        } else {
             setError('Failed to register student. Please try again.');
        }
    } catch (err) {
        setError('An unexpected error occurred during registration.');
        console.error(err);
    }
  };
  
  const handleRemove = (studentId: number) => {
    if (window.confirm('Are you sure you want to remove this student? This action cannot be undone.')) {
        removeStudent(studentId, teacher.id);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-onSurface mb-6">Manage Student Roster</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-bold mb-4">Register New Student</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
              <input type="text" id="name" name="name" value={newStudent.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="e.g., John Doe" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="age" className="block text-sm font-medium">Age</label>
                    <input type="number" id="age" name="age" value={newStudent.age} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="e.g., 15" required />
                </div>
                <div>
                    <label htmlFor="rollNo" className="block text-sm font-medium">Roll No.</label>
                    <input type="text" id="rollNo" name="rollNo" value={newStudent.rollNo} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="e.g., CS101" required />
                </div>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
              <select id="gender" name="gender" value={newStudent.gender} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}
            <Button type="submit" className="w-full !mt-6">Register Student</Button>
          </form>
          {newlyRegistered && (
            <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                <h3 className="font-bold">Student Registered: {newlyRegistered.name}</h3>
                <p className="text-sm mb-4">Provide these credentials to the student.</p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="p-2 bg-white border rounded-md">
                        <QRCodeSVG value={newlyRegistered.qrCodeData} size={100} />
                    </div>
                    <div className="font-mono text-sm space-y-2">
                        <p><strong>ID:</strong> {newlyRegistered.uniqueId}</p>
                        <p><strong>Pass:</strong> {newlyRegistered.password}</p>
                    </div>
                </div>
            </div>
          )}
        </Card>
        <Card>
          <h3 className="text-xl font-bold mb-4">Current Roster ({students.length})</h3>
          <div className="max-h-[500px] overflow-y-auto space-y-3">
            {students.length > 0 ? [...students].reverse().map(student => (
              <div key={student.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-2 bg-primary/10 rounded-full mr-3">
                        <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">{student.name} <span className="text-sm font-normal text-onSurfaceSecondary">(Roll: {student.rollNo})</span></p>
                        <div className="font-mono text-xs text-onSurfaceSecondary space-x-3">
                            <span>ID: {student.uniqueId}</span>
                            <button onClick={() => handleCopy(student.password || '', `pass-${student.id}`)} className="text-primary hover:underline">
                                {copiedText === `pass-${student.id}` ? 'COPIED' : 'Copy Pass'}
                            </button>
                        </div>
                    </div>
                </div>
                <Button onClick={() => handleRemove(student.id)} className="!bg-red-500 hover:!bg-red-600 !px-3 !py-1 text-sm">Remove</Button>
              </div>
            )) : <p className="text-onSurfaceSecondary">No students have been added yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentRoster;