import React from 'react';
import { AudioButton } from './AudioButton';
import { useAudio } from '../hooks/useAudio';
import { useLanguage } from '../contexts/LanguageContext';
import type { Example } from '../types/phrase';

interface ExampleCardProps {
  example: Example;
  index: number;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({ example, index }) => {
  const { playText, isPlaying } = useAudio();
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-3 py-1 rounded-full">
          {t('examples.example')} {index + 1}
        </span>
        <AudioButton
          text={example.spanish}
          isPlaying={isPlaying}
          onPlay={playText}
          size="sm"
        />
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-lg font-semibold text-gray-800 mb-1">
            {example.spanish}
          </p>
          <p className="text-gray-600">
            {example.english}
          </p>
        </div>
        
      </div>
    </div>
  );
};