import React, { useState } from 'react';
import type { PersonalizedTask } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface TaskManagerProps {
  tasks: PersonalizedTask[];
  addPersonalizedTask: (task: Omit<PersonalizedTask, 'id' | 'assignedBy'>) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, addPersonalizedTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    addPersonalizedTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
     <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-onSurface mb-6">Suggest Academic Tasks</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <h3 className="text-xl font-bold mb-4">Create a New Task</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Task Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Research Quantum Entanglement" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-md" rows={4} placeholder="Briefly describe the task and its learning goals." required />
                    </div>
                    <Button type="submit" className="w-full">Add Task Suggestion</Button>
                </form>
            </Card>
             <Card>
                <h3 className="text-xl font-bold mb-4">Existing Tasks ({tasks.length})</h3>
                 <div className="max-h-[400px] overflow-y-auto space-y-3">
                    {tasks.length > 0 ? tasks.map(task => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold">{task.title}</p>
                            <p className="text-sm text-onSurfaceSecondary">{task.description}</p>
                        </div>
                    )).reverse() : <p className="text-onSurfaceSecondary">No tasks suggested yet.</p>}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default TaskManager;
