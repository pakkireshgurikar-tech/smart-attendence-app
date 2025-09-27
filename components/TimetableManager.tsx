import React, { useState } from 'react';
import type { Timetable } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface TimetableManagerProps {
  timetable: Timetable;
  setTimetable: (timetable: Timetable) => void;
}

const TimetableManager: React.FC<TimetableManagerProps> = ({ timetable, setTimetable }) => {
  const [error, setError] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setError('Invalid file type. Please upload a .json file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') {
          throw new Error("Failed to read file content.");
        }
        const parsedTimetable = JSON.parse(content);
        
        // Basic validation
        if (typeof parsedTimetable !== 'object' || parsedTimetable === null || Array.isArray(parsedTimetable)) {
            throw new Error("JSON must be an object with days as keys.");
        }

        setTimetable(parsedTimetable);
        setError('');
        alert('Timetable uploaded and saved successfully!');
      } catch (err) {
        setError('Failed to parse JSON. Please check the file format.');
        console.error(err);
      }
    };
    reader.onerror = () => {
        setError('Failed to read the file.');
    }
    reader.readAsText(file);

    // Reset file input value to allow re-uploading the same file name
    event.target.value = '';
  };

  return (
    <div className="animate-fade-in space-y-8">
      <h2 className="text-3xl font-bold text-onSurface mb-6">Manage Timetable</h2>

      <Card>
        <h3 className="text-xl font-bold mb-2">Upload New Timetable</h3>
        <p className="text-onSurfaceSecondary mb-4">
          Upload a <code>.json</code> file to replace the current weekly schedule. The file should have days of the week as keys (e.g., "Monday", "Tuesday").
        </p>
        <div className="mt-4">
          <label htmlFor="timetable-upload" className="cursor-pointer bg-primary text-onPrimary font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-primary-light transition-all duration-200 ease-in-out">
            Select .json File
          </label>
          <input
            id="timetable-upload"
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
      </Card>

      <Card>
        <h3 className="text-xl font-bold mb-4">Current Timetable</h3>
        {Object.keys(timetable).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(timetable).map(([day, periods]) => (
              <div key={day} className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-bold text-primary mb-3">{day}</h4>
                <ul className="space-y-2">
                  {Array.isArray(periods) && periods.map((period, index) => (
                    <li key={index} className="flex justify-between text-sm items-center border-b border-gray-200 pb-1">
                      <span className="text-onSurfaceSecondary">{period.time}</span>
                      <span className="font-semibold text-onSurface text-right">{period.subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-onSurfaceSecondary">No timetable has been uploaded yet.</p>
        )}
      </Card>
    </div>
  );
};

export default TimetableManager;
