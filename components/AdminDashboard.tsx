import React, { useState } from 'react';
import type { Admin, Teacher } from '../types';
import Header from './Header';
import Card from './ui/Card';
import Button from './ui/Button';

interface AdminDashboardProps {
  admin: Admin;
  teachers: Teacher[];
  registerTeacher: (teacherData: { name: string; subject: string; }) => { uniqueId: string; password: string };
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, teachers, registerTeacher, onLogout }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [newCredentials, setNewCredentials] = useState<{uniqueId: string; password: string} | null>(null);
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
    setNewCredentials(null);
    if (!name || !subject) {
        setError('Please fill out all fields.');
        return;
    }
    const creds = registerTeacher({ name, subject });
    setNewCredentials(creds);
    // Reset form
    setName('');
    setSubject('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* FIX: Added role: 'admin' to satisfy the User type required by the Header component. */}
      <Header user={{...admin, name: 'Administrator', role: 'admin'}} onLogout={onLogout} />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4">Register New Teacher</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-onSurface mb-1">Teacher Full Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-onSurface mb-1">Teaching Subject</label>
                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">Register Teacher</Button>
            </form>
            {newCredentials && (
                <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                    <h3 className="font-bold">Teacher Registered Successfully!</h3>
                    <p>Please provide the following credentials to the teacher:</p>
                    <p className="mt-2 font-mono"><strong>Unique ID:</strong> {newCredentials.uniqueId}</p>
                    <p className="font-mono"><strong>Password:</strong> {newCredentials.password}</p>
                </div>
            )}
          </Card>
          <Card>
             <h2 className="text-2xl font-bold mb-4">Registered Teachers ({teachers.length})</h2>
             <div className="max-h-96 overflow-y-auto">
                {teachers.length === 0 ? (
                    <p className="text-onSurfaceSecondary">No teachers have been registered yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {teachers.map(teacher => (
                            <li key={teacher.id} className="py-4">
                                <div>
                                    <p className="font-semibold text-onSurface">{teacher.name}</p>
                                    <p className="text-sm text-onSurfaceSecondary">Subject: {teacher.subject}</p>
                                </div>
                                <div className="font-mono text-sm mt-2 p-3 bg-gray-100 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="truncate"><strong>ID:</strong> {teacher.uniqueId}</span>
                                        <button onClick={() => handleCopy(teacher.uniqueId, `id-${teacher.id}`)} className="text-xs font-semibold text-primary hover:underline ml-4 flex-shrink-0 w-12 text-right">
                                            {copiedText === `id-${teacher.id}` ? 'COPIED' : 'COPY'}
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="truncate"><strong>Pass:</strong> {teacher.password}</span>
                                        <button onClick={() => handleCopy(teacher.password, `pass-${teacher.id}`)} className="text-xs font-semibold text-primary hover:underline ml-4 flex-shrink-0 w-12 text-right">
                                            {copiedText === `pass-${teacher.id}` ? 'COPIED' : 'COPY'}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
             </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;