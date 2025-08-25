import React from 'react';
import { Calendar, Trophy, Repeat } from 'lucide-react';
import { AudioButton } from '../components/AudioButton';
import { useAudio } from '../hooks/useAudio';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTracking, useAnalytics } from '../hooks/useAnalytics';
import type { Phrase } from '../types/phrase';

interface CompletionPageProps {
  phrase: Phrase;
}

export const CompletionPage: React.FC<CompletionPageProps> = ({ phrase }) => {
  const { playAudio, playText, isPlaying } = useAudio();
  const { language, t } = useLanguage();
  const { trackPhraseEvent } = useAnalytics();
  
  // Track page view
  usePageTracking('Completion Page');
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center p-4 pt-4 md:pt-[100px]">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 inline-flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-medium">{t('completion.congratulations')}</span>
        </div>
        
        <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
          <div className="text-6xl mb-6">🎉</div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {t('completion.mastered')}
          </h1>
          
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <AudioButton
                audioUrl={phrase.audio?.url}
                text={phrase.phrase}
                isPlaying={isPlaying}
                onPlay={(audioUrl, text) => {
                  if (audioUrl) {
                    playAudio(audioUrl);
                  } else if (text) {
                    playText(text);
                  }
                }}
                size="lg"
              />
              <div>
                <div className="text-2xl font-bold text-gray-800">{phrase.phrase}</div>
                <div className="text-gray-600 italic">/{phrase.pronunciation}/</div>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {phrase.meaning[language]}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-semibold text-blue-800">{t('difficulty')}</div>
              <div className="text-blue-600 capitalize">{t(phrase.difficulty)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="font-semibold text-green-800">{t('formality')}</div>
              <div className="text-green-600 capitalize">{t(phrase.formality)}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">{t('completion.whatYouLearned')}</h3>
            <ul className="text-left space-y-2 text-gray-600">
              <li>{t('completion.learned1')}</li>
              <li>{t('completion.learned2')}</li>
              <li>{t('completion.learned3')}</li>
              <li>{t('completion.learned4')}</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8 text-white">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-2xl font-bold mb-3">{t('completion.comeBack')}</h2>
          <p className="text-lg mb-4">
            {t('completion.nextPhrase')} <strong>{tomorrowFormatted}</strong>
          </p>
          <div className="bg-white/20 rounded-lg p-4 text-sm">
            {t('completion.proTip', { phrase: phrase.phrase })}
          </div>
        </div>
        
        <button
          className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-xl
                   hover:bg-orange-50 transition-all duration-200 transform hover:scale-105
                   shadow-xl hover:shadow-2xl flex items-center space-x-3 mx-auto"
        >
          <Repeat className="w-6 h-6" />
          <span>{t('completion.review')}</span>
        </button>
        
        <p className="text-white/80 mt-6 text-sm">
          {t('completion.building')}
        </p>
      </div>
    </div>
  );
};