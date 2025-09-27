import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { UserIcon } from './icons';
import { checkPasswordStrength } from '../utils';
import PasswordStrengthIndicator from './ui/PasswordStrengthIndicator';

interface AdminRegisterProps {
  onRegister: (credentials: { email: string; pass: string; secret: string }) => boolean;
  onNavigateToLogin: () => void;
}

const AdminRegister: React.FC<AdminRegisterProps> = ({ onRegister, onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const success = onRegister({ email, pass: password, secret: secretKey });

    if (success) {
      alert('Registration successful! Please log in.');
      onNavigateToLogin();
    } else {
      setError('Invalid secret key or email already exists. Registration failed.');
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
            <h2 className="text-2xl font-bold text-center text-onSurface mb-2">Admin Registration</h2>
            <p className="text-center text-onSurfaceSecondary mb-6">Create a new administrator account.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-onSurface mb-1">Email Address</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-onSurface mb-1">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={e => {
                            setPassword(e.target.value);
                            const { score } = checkPasswordStrength(e.target.value);
                            setPasswordStrength(score);
                        }} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required 
                    />
                    {password.length > 0 && <PasswordStrengthIndicator score={passwordStrength} />}
                </div>
                <div>
                    <label htmlFor="confirmPassword"className="block text-sm font-medium text-onSurface mb-1">Confirm Password</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="secretKey"className="block text-sm font-medium text-onSurface mb-1">Secret Key</label>
                    <input type="password" id="secretKey" value={secretKey} onChange={e => setSecretKey(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Enter the registration key" required />
                </div>
                {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
                <Button type="submit" className="w-full !mt-6">Register</Button>
            </form>
        </Card>
        <p className="text-center text-sm text-onSurfaceSecondary mt-6">
            Already have an account?{' '}
            <button onClick={onNavigateToLogin} className="font-semibold text-primary hover:underline">
                Login here
            </button>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;