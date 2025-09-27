import React from 'react';
import type { User } from '../types';
import { UserIcon, LogoutIcon } from './icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-surface border-b border-gray-200">
      <div>
        <h2 className="text-2xl font-bold text-onSurface">
          Welcome, {user.name.split(' ')[0]}!
        </h2>
        <p className="text-onSurfaceSecondary">Here's your overview for today.</p>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-full">
                <UserIcon className="w-6 h-6 text-onSurfaceSecondary"/>
            </div>
            <div className='text-right'>
                <p className="font-semibold text-sm text-onSurface">{user.name}</p>
                <p className="text-xs text-onSurfaceSecondary capitalize">{user.role}</p>
            </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 text-onSurfaceSecondary hover:text-primary transition-colors duration-200"
          aria-label="Logout"
        >
          <LogoutIcon className="w-6 h-6" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
