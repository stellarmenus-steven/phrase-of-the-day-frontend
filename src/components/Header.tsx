import React from 'react';
import { HamburgerMenu } from './HamburgerMenu';
import initialPhraseData from '../data/phrases.json';
import type { PhraseData } from '../types/phrase';

interface HeaderProps {
  onRestart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRestart }) => {
  const phraseData = initialPhraseData as PhraseData;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">

          <h1 className="text-xl font-bold text-gray-800">Spanish Phrase of the Day</h1>
        </div>
        
        <HamburgerMenu onRestart={onRestart} />
      </div>
    </header>
  );
};