import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface RegionBadgeProps {
  region: 'spain' | 'latinAmerica';
  usage: {
    en: string;
    es: string;
  };
  notes: {
    en: string;
    es: string;
  };
}

export const RegionBadge: React.FC<RegionBadgeProps> = ({ region, usage, notes }) => {
  const { language, t } = useLanguage();
  
  const regionNames = {
    spain: t('regions.spain'),
    latinAmerica: t('regions.latinAmerica')
  };

  const usageColors = {
    'Very common': 'bg-green-100 text-green-800',
    'Muy común': 'bg-green-100 text-green-800',
    'Common': 'bg-blue-100 text-blue-800',
    'Común': 'bg-blue-100 text-blue-800',
    'Less common': 'bg-yellow-100 text-yellow-800',
    'Menos común': 'bg-yellow-100 text-yellow-800',
    'Rare': 'bg-red-100 text-red-800',
    'Raro': 'bg-red-100 text-red-800'
  };

  const currentUsage = usage[language];
  const currentNotes = notes[language];

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{regionNames[region]}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${usageColors[currentUsage as keyof typeof usageColors] || 'bg-gray-100 text-gray-800'}`}>
          {currentUsage}
        </span>
      </div>
      <p className="text-sm text-gray-600">{currentNotes}</p>
    </div>
  );
};