
import React from 'react';

// FIX: Extended props with React.HTMLAttributes<HTMLDivElement> to allow passing standard div attributes like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={`bg-surface p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;