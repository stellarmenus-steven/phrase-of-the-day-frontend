import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const DebugInfo: React.FC = () => {
  const { language, learningLevel } = useLanguage();
  
  // Get raw localStorage values
  const rawLanguage = localStorage.getItem('spanish-app-language');
  const rawLevel = localStorage.getItem('spanish-app-learning-level');
  
  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div><strong>Debug Info:</strong></div>
      <div>Language (context): {language}</div>
      <div>Language (localStorage): {rawLanguage || 'not set'}</div>
      <div>Level (context): {learningLevel}</div>
      <div>Level (localStorage): {rawLevel || 'not set'}</div>
      <div>API URL: /api/v1/phrases?level={learningLevel}</div>
    </div>
  );
};
