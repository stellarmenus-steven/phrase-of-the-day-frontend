import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { ExampleCard } from '../components/ExampleCard';
import { ProgressBar } from '../components/ProgressBar';
import { useLanguage } from '../contexts/LanguageContext';
import type { Phrase } from '../types/phrase';

interface ExamplesPageProps {
  phrase: Phrase;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
}

export const ExamplesPage: React.FC<ExamplesPageProps> = ({
  phrase,
  onNext,
  currentStep,
  totalSteps,
}) => {
  const { t } = useLanguage();

  // Precompute the suffix once (avoids repeating "is used in everyday conversations")
  const suffix = t('examples.subtitle', { phrase: '' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-4 pt-[100px]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('examples.title')}
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            {t('examples.subtitle', { phrase: phrase.phrase }).replace(suffix, '')}{' '}
            <strong>"{phrase.phrase}"</strong>{' '}
            {suffix.trim()}
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {phrase.examples.map((example, index) => (
            <ExampleCard key={index} example={example} index={index} />
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {t('examples.similarPhrases')}
          </h3>
          <div className="flex flex-wrap gap-3">
            {phrase.similarPhrases.map((similarPhrase, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {similarPhrase}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onNext}
            className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-bold text-lg mb-20
                     transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl
                     flex items-center space-x-3 mx-auto"
          >
            <span>{t('examples.testKnowledge')}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </div>
  );
};
