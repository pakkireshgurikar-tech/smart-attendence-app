import React, { useState, useEffect } from 'react';
import type { Student, ScheduleEntry, SuggestedTask, DailyRoutine, StudentProfile as StudentProfileType } from '../types';
import { getTaskSuggestions, generateDailyRoutine } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { LightBulbIcon, CalendarIcon } from './icons';

interface StudentProfileProps {
    student: Student;
    schedule: ScheduleEntry[];
    onUpdate: (studentId: number, profile: StudentProfileType) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, schedule, onUpdate }) => {
    // State for editable profile fields
    const [profile, setProfile] = useState<StudentProfileType>(student.profile);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // State for AI features
    const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
    const [dailyRoutine, setDailyRoutine] = useState<DailyRoutine[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [isLoadingRoutine, setIsLoadingRoutine] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setProfile(student.profile);
    }, [student]);

    const handleProfileChange = (field: keyof StudentProfileType, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onUpdate(student.id, profile);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const fetchTaskSuggestions = async () => {
        setIsLoadingTasks(true);
        setError('');
        try {
            const tasks = await getTaskSuggestions(student.profile);
            setSuggestedTasks(tasks);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoadingTasks(false);
        }
    };

    const fetchDailyRoutine = async () => {
        setIsLoadingRoutine(true);
        setError('');
        try {
            const routine = await generateDailyRoutine(student.profile, schedule);
            setDailyRoutine(routine);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoadingRoutine(false);
        }
    };
    
    useEffect(() => {
        fetchTaskSuggestions();
        fetchDailyRoutine();
    }, [student.profile, schedule]); // Re-fetch AI data when the saved profile changes

    return (
        <div className="animate-fade-in space-y-8">
            <h2 className="text-3xl font-bold text-onSurface">My Profile & AI Assistant</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                     <Card>
                        <h3 className="text-xl font-bold mb-4">Your Profile for AI</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-onSurfaceSecondary">Interests</label>
                                <textarea value={profile.interests} onChange={e => handleProfileChange('interests', e.target.value)} readOnly={!isEditing} className={`w-full p-2 border rounded-md mt-1 ${!isEditing ? 'bg-gray-100' : ''}`} rows={3}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-onSurfaceSecondary">Strengths</label>
                                <textarea value={profile.strengths} onChange={e => handleProfileChange('strengths', e.target.value)} readOnly={!isEditing} className={`w-full p-2 border rounded-md mt-1 ${!isEditing ? 'bg-gray-100' : ''}`} rows={3}></textarea>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-onSurfaceSecondary">Career Goals</label>
                                <textarea value={profile.careerGoals} onChange={e => handleProfileChange('careerGoals', e.target.value)} readOnly={!isEditing} className={`w-full p-2 border rounded-md mt-1 ${!isEditing ? 'bg-gray-100' : ''}`} rows={3}></textarea>
                            </div>
                        </div>
                        {successMessage && <p className="text-green-600 font-semibold mt-4">{successMessage}</p>}
                        <div className="flex justify-end space-x-4 pt-4 mt-4 border-t">
                             {isEditing ? (
                                <>
                                    <Button onClick={() => setIsEditing(false)} className="!bg-gray-500 hover:!bg-gray-600">Cancel</Button>
                                    <Button onClick={handleSave}>Save Changes</Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                            )}
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center"><LightBulbIcon className="w-6 h-6 mr-2 text-primary" />AI Task Suggestions</h3>
                            <Button onClick={fetchTaskSuggestions} disabled={isLoadingTasks} className="!py-1 !px-3 text-sm">
                                {isLoadingTasks ? <Spinner /> : 'Regenerate'}
                            </Button>
                        </div>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {isLoadingTasks ? (
                             <div className="text-center p-8"><Spinner /></div>
                        ) : suggestedTasks.length > 0 ? (
                            <ul className="space-y-3">
                                {suggestedTasks.map((task, index) => (
                                    <li key={index} className="p-3 bg-primary/5 rounded-lg">
                                        <h4 className="font-bold text-onSurface">{task.title} <span className="text-sm font-normal text-onSurfaceSecondary">({task.duration} mins)</span></h4>
                                        <p className="text-sm text-onSurfaceSecondary mt-1">{task.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                           <p className="text-onSurfaceSecondary">No suggestions available. Try regenerating.</p>
                        )}
                    </Card>
                    <Card>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center"><CalendarIcon className="w-6 h-6 mr-2 text-primary" />AI Generated Daily Routine</h3>
                            <Button onClick={fetchDailyRoutine} disabled={isLoadingRoutine} className="!py-1 !px-3 text-sm">
                               {isLoadingRoutine ? <Spinner /> : 'Regenerate'}
                            </Button>
                        </div>
                         {isLoadingRoutine ? (
                             <div className="text-center p-8"><Spinner /></div>
                        ) : dailyRoutine.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto">
                                <ul className="space-y-2">
                                    {dailyRoutine.map((item, index) => (
                                        <li key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                                            <span className="w-32 font-semibold text-primary text-sm">{item.time}</span>
                                            <span className="flex-1 text-onSurface">{item.activity}</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                item.category === 'Class' ? 'bg-blue-100 text-blue-800' :
                                                item.category === 'Study' ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>{item.category}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                           <p className="text-onSurfaceSecondary">Could not generate a routine. Try regenerating.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
