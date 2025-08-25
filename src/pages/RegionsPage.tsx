import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { RegionBadge } from '../components/RegionBadge';
import { ProgressBar } from '../components/ProgressBar';
import { useLanguage } from '../contexts/LanguageContext';
import type { Phrase } from '../types/phrase';

interface RegionsPageProps {
  phrase: Phrase;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
}

export const RegionsPage: React.FC<RegionsPageProps> = ({
  phrase,
  onNext,
  currentStep,
  totalSteps,
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-4 pt-[100px]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('regions.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('regions.subtitle', { phrase: phrase.phrase }).replace('is used differently across Spanish-speaking regions', t('regions.subtitle').replace('{phrase}', ''))}{' '}
            <strong>"{phrase.phrase}"</strong> {t('regions.subtitle').replace('The phrase "{phrase}" ', '')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <RegionBadge
            region="spain"
            usage={phrase.regions.spain.usage}
            notes={phrase.regions.spain.notes}
          />
          <RegionBadge
            region="latinAmerica"
            usage={phrase.regions.latinAmerica.usage}
            notes={phrase.regions.latinAmerica.notes}
          />
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {t('regions.tip')}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {t('regions.tipText')}
          </p>
        </div>
        
        <div className="text-center">
          <button
            onClick={onNext}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg mb-20
                     transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl
                     flex items-center space-x-3 mx-auto"
          >
            <span>{t('regions.seeExamples')}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
        
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </div>
  );
};