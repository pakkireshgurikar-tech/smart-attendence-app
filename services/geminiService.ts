
import { GoogleGenAI, Type } from "@google/genai";
import type { StudentProfile, ScheduleEntry, SuggestedTask, DailyRoutine } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const taskSuggestionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'The concise title of the task.' },
      description: { type: Type.STRING, description: 'A brief explanation of the task and why it is relevant.' },
      duration: { type: Type.INTEGER, description: 'Estimated time in minutes to complete the task.' }
    },
    required: ["title", "description", "duration"],
  }
};

const dailyRoutineSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            time: { type: Type.STRING, description: 'The time slot for the activity (e.g., "09:00 - 10:00").' },
            activity: { type: Type.STRING, description: 'The name of the activity or subject.' },
            category: { type: Type.STRING, description: 'The category of the activity (e.g., "Class", "Study", "Break").' }
        },
        required: ["time", "activity", "category"],
    }
};

export const getTaskSuggestions = async (profile: StudentProfile): Promise<SuggestedTask[]> => {
  const prompt = `Based on the following student profile, suggest 3 productive and personalized academic tasks they can do during a 1-hour free period. The tasks must align with their long-term goals.

  Student Profile:
  - Interests: ${profile.interests}
  - Strengths: ${profile.strengths}
  - Career Goals: ${profile.careerGoals}
  
  Provide tasks that are actionable and can be started immediately.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: taskSuggestionSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const tasks = JSON.parse(jsonText) as SuggestedTask[];
    return tasks;
  } catch (error) {
    console.error("Error fetching task suggestions:", error);
    throw new Error("Failed to get suggestions from AI. Please try again.");
  }
};

export const generateDailyRoutine = async (profile: StudentProfile, schedule: ScheduleEntry[]): Promise<DailyRoutine[]> => {
    // FIX: Safely get Monday's schedule with optional chaining and a fallback.
    const mondaySchedule = schedule.find(d => d.day === 'Monday')?.periods
        ?.map(p => `- ${p.time}: ${p.subject}`)
        .join('\n') ?? 'No classes scheduled for Monday.';
    
    const prompt = `Create a personalized and productive daily routine for a student for Monday. The routine should integrate their fixed class schedule with their personal goals and productive activities during free time.
    
    Student Profile:
    - Interests: ${profile.interests}
    - Strengths: ${profile.strengths}
    - Career Goals: ${profile.careerGoals}

    Fixed Schedule for Monday:
    ${mondaySchedule}

    Generate a detailed plan for the day from 8 AM to 8 PM. Fill in the "Free Period" and other open slots with activities that align with the student's profile. Include short breaks. Structure the output as a JSON array of objects.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: dailyRoutineSchema,
          temperature: 0.5,
        },
      });
  
      const jsonText = response.text.trim();
      const routine = JSON.parse(jsonText) as DailyRoutine[];
      return routine;
    } catch (error) {
      console.error("Error generating daily routine:", error);
      throw new Error("Failed to generate routine from AI. Please try again.");
    }
  };
