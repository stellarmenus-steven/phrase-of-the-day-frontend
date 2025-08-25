import React from 'react';
import { ArrowRight, Calendar, Flame, Clock, X } from 'lucide-react';
import { AudioButton } from '../components/AudioButton';
import { useAudio } from '../hooks/useAudio';
import { useLanguage } from '../contexts/LanguageContext';
import type { Phrase } from '../types/phrase';

interface HomePageProps {
  phrase: Phrase;
  onNext: () => void;
  error?: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({ phrase, onNext, error }) => {
  const { playText, isPlaying } = useAudio();
  const { language, t } = useLanguage();
  const [showError, setShowError] = React.useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center p-4 pt-20">
      {/* Show error message only on home page if API call failed */}
      {error && showError && (
        
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-md mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 mx-auto">
                <span className="text-lg">⚠️</span>
                <span className="text-sm">Using offline content</span>
              </div>
              <button
                onClick={() => setShowError(false)}
                className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200 ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4 inline-flex items-center space-x-2">
          <Clock className="w-5 h-5 text-white" />
          <span className="text-white font-medium text-lg">{phrase.date.spanish}</span>
        </div>
        
        <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8 transform hover:scale-105 transition-all duration-300">
        <div className="flex flex-col items-center text-center mb-6 md:flex-row md:items-center md:text-left">
          <AudioButton
              text={phrase.phrase}
              isPlaying={isPlaying}
              onPlay={playText}
              size="lg"
              className="mb-4 md:mb-0 md:mr-4"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {phrase.phrase}
              </h1>
              <p className="text-lg text-gray-600 italic">
                /{phrase.pronunciation}/
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              {phrase.meaning[language]}
            </h2>
            <p className="text-blue-700">
              {phrase.context[language]}
            </p>
          </div>
        </div>
        
        <button
          onClick={onNext}
          className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-xl
                   hover:bg-orange-50 transition-all duration-200 transform hover:scale-105
                   shadow-xl hover:shadow-2xl flex items-center space-x-3 mx-auto"
        >
          <span>{t('home.letsLearn')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
        
        <p className="text-white/80 mt-6 text-lg">
          {t('home.masterPhrase')}
        </p>
      </div>
    </div>
  );
};