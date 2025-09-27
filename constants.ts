import type { ScheduleEntry } from './types';

// This secret key is required for new admin registrations.
// In a real application, this should be a secure, environment-specific variable.
export const ADMIN_REGISTRATION_SECRET_KEY = 'mahesh123';

// Mock schedule data for a student, used for AI routine generation.
// In a real app, this would be part of the student's data.
export const MOCK_SCHEDULE: ScheduleEntry[] = [
    {
        day: 'Monday',
        periods: [
            { time: '09:00 - 10:00', subject: 'Mathematics' },
            { time: '10:00 - 11:00', subject: 'Physics' },
            { time: '11:00 - 12:00', subject: 'Free Period' },
            { time: '12:00 - 13:00', subject: 'Lunch' },
            { time: '13:00 - 14:00', subject: 'Computer Science' },
            { time: '14:00 - 15:00', subject: 'Free Period' },
        ],
    },
    // ... add other days if needed
];