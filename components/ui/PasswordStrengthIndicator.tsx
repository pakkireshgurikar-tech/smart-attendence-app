import React from 'react';

interface PasswordStrengthIndicatorProps {
  score: number; // 0-4
}

const strengthLevels = [
  { label: '', color: 'bg-transparent', textColor: 'text-transparent' }, // Score 0
  { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' },      // Score 1
  { label: 'Medium', color: 'bg-orange-500', textColor: 'text-orange-500' }, // Score 2
  { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' }, // Score 3
  { label: 'Very Strong', color: 'bg-green-600', textColor: 'text-green-600' },// Score 4
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ score }) => {
  // Ensure score is within bounds
  const validScore = Math.max(0, Math.min(score, 4));
  const currentStrength = strengthLevels[validScore];

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 grid grid-cols-4 gap-1 h-1.5">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className={`rounded-full transition-colors ${
                    index < validScore ? currentStrength.color : 'bg-gray-200'
                    }`}
                ></div>
            ))}
        </div>
        <p className={`w-20 text-right text-xs font-semibold ${currentStrength.textColor}`}>
            {currentStrength.label}
        </p>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
