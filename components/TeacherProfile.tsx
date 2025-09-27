import React, { useState, useEffect } from 'react';
import type { Teacher } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface TeacherProfileProps {
    teacher: Teacher;
    onUpdate: (teacherId: number, data: { name: string; subject: string; }) => void;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher, onUpdate }) => {
    const [name, setName] = useState(teacher.name);
    const [subject, setSubject] = useState(teacher.subject);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setName(teacher.name);
        setSubject(teacher.subject);
    }, [teacher]);

    const handleSave = () => {
        onUpdate(teacher.id, { name, subject });
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleCancel = () => {
        setName(teacher.name);
        setSubject(teacher.subject);
        setIsEditing(false);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-onSurface mb-6">My Profile</h2>
            <Card className="max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-onSurfaceSecondary">Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            readOnly={!isEditing}
                            className={`w-full p-2 border rounded-md mt-1 ${!isEditing ? 'bg-gray-100' : ''}`}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-onSurfaceSecondary">Subject</label>
                        <input 
                            type="text" 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)} 
                            readOnly={!isEditing}
                            className={`w-full p-2 border rounded-md mt-1 ${!isEditing ? 'bg-gray-100' : ''}`}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-onSurfaceSecondary">Unique ID</label>
                        <input 
                            type="text" 
                            value={teacher.uniqueId} 
                            readOnly
                            className="w-full p-2 border rounded-md mt-1 bg-gray-100 font-mono"
                        />
                    </div>
                    {successMessage && <p className="text-green-600 font-semibold">{successMessage}</p>}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        {isEditing ? (
                            <>
                                <Button onClick={handleCancel} className="!bg-gray-500 hover:!bg-gray-600">Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TeacherProfile;