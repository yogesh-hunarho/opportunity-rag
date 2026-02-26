import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from './ui/button';

const GeminiApiGuide = () => {
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      id: 1,
      title: 'Go to Google AI Studio',
      description: 'Open your web browser and navigate to the official Google AI Studio portal.',
      action: (
        <a 
          href="https://aistudio.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
        >
          Open AI Studio (opens in new tab)
        </a>
      )
    },
    {
      id: 2,
      title: 'Sign In',
      description: 'Sign in using your Google Account. If you do not have one, you will need to create it first.'
    },
    {
      id: 3,
      title: 'Navigate to "Get API key"',
      description: 'Look at the left-hand navigation menu and click on the "Get API key" tab.'
    },
    {
      id: 4,
      title: 'Create the API Key',
      description: 'Click the "Create API key" button. You can choose to generate it in a new Google Cloud project or select an existing one.'
    },
    {
      id: 5,
      title: 'Copy and Secure',
      description: 'Copy the generated key. Never share this key publicly we never store your key when you refresh the page your key will be lost.'
    }
  ];

  const toggleStep = (id) => {
    setCompletedSteps((prev) => 
      prev.includes(id) ? prev.filter(stepId => stepId !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <div className="mb-6">
        <Link href="/">
            <Button variant={"outline"} size={"sm"} className='cursor-pointer mb-4'>Back to Home</Button>
        </Link>
        <h2 className="text-2xl font-bold text-foreground">How to get a Gemini API Key</h2>
        {/* <p className="text-gray-600 mt-2">
          Follow these steps to generate your free API key from Google AI Studio and start building.
        </p> */}
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          
          return (
            <div 
              key={step.id} 
              className={`p-4 rounded-md border transition-colors ${
                isCompleted ? 'bg-secondary border-green-500/50' : 'bg-card border-border'
              }`}
            >
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => toggleStep(step.id)}
                  className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-blue-500'
                  }`}
                  aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                  {isCompleted && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isCompleted ? 'text-primary' : 'text-foreground'}`}>
                    Step {step.id}: {step.title}
                  </h3>
                  <p className={`mt-1 text-sm ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {step.description}
                  </p>
                  {step.action && <div className="mt-2">{step.action}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
        <h4 className="text-sm font-bold text-yellow-800">Security Warning</h4>
        <p className="text-sm text-yellow-700 mt-1">
          Always use environment variables (e.g., <code>REACT_APP_GEMINI_API_KEY</code> or <code>VITE_GEMINI_API_KEY</code>) to store your key in React applications. Do not hardcode it directly into your components.
        </p>
      </div> */}
    </div>
  );
};

export default GeminiApiGuide;