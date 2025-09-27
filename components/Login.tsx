import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { UserIcon } from './icons';

interface LoginProps {
  mode: 'admin' | 'student' | 'teacher';
  onAdminLogin?: (credentials: { email: string; pass: string }) => boolean;
  onUserLogin?: (credentials: { uniqueId: string; pass: string }) => boolean;
  onBack: () => void;
  onNavigateToRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ mode, onAdminLogin, onUserLogin, onBack, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const title = mode === 'admin' ? 'Admin Login' : mode === 'student' ? 'Student Login' : 'Teacher Login';
  const subtitle = mode === 'admin' ? 'Access the administrator dashboard.' : 'Enter your assigned credentials.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let success = false;
    if (mode === 'admin' && onAdminLogin) {
      success = onAdminLogin({ email, pass: password });
    } else if ((mode === 'student' || mode === 'teacher') && onUserLogin) {
      success = onUserLogin({ uniqueId, pass: password });
    }
    
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <div className="flex justify-center mb-6">
            <div className="bg-primary p-3 rounded-xl shadow-md">
                <UserIcon className="w-8 h-8 text-onPrimary" />
            </div>
        </div>
        <Card>
            <h2 className="text-2xl font-bold text-center text-onSurface mb-2">{title}</h2>
            <p className="text-center text-onSurfaceSecondary mb-6">{subtitle}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'admin' ? (
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-onSurface mb-1">Email Address</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="uniqueId" className="block text-sm font-medium text-onSurface mb-1">Unique ID</label>
                        <input type="text" id="uniqueId" value={uniqueId} onChange={e => setUniqueId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required />
                    </div>
                )}
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-onSurface mb-1">Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required />
                </div>
                {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
                <Button type="submit" className="w-full">Login</Button>
            </form>
        </Card>
         <div className="text-center text-sm text-onSurfaceSecondary mt-6 space-y-3">
            {mode === 'admin' && onNavigateToRegister && (
                <p>
                    Need an admin account?{' '}
                    <button onClick={onNavigateToRegister} className="font-semibold text-primary hover:underline">
                        Register here
                    </button>
                </p>
            )}
            <p>
                <button onClick={onBack} className="font-semibold text-primary hover:underline">
                    &larr; Back to Welcome Screen
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;