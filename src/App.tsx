import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { RegionsPage } from './pages/RegionsPage';
import { ExamplesPage } from './pages/ExamplesPage';
import { QuizPage } from './pages/QuizPage';
import { CompletionPage } from './pages/CompletionPage';
import { SponsorPopup } from './components/SponsorPopup';
import { useSponsorPopup } from './hooks/useSponsorPopup';
import { useAnalytics } from './hooks/useAnalytics';
import { AudioDiagnostic } from './components/AudioDiagnostic';
import type { Phrase, PhraseData } from './types/phrase';

// Import the phrase data
import initialPhraseData from './data/phrases.json';

type Page = 'home' | 'regions' | 'examples' | 'quiz' | 'completion';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [phraseData, setPhraseData] = useState<PhraseData | null>(initialPhraseData as PhraseData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, learningLevel } = useLanguage();
  const { trackNavigation, trackPhraseEvent } = useAnalytics();

  const { isVisible, closeSponsorPopup, resetSponsor } = useSponsorPopup(phraseData?.sponsor);

  // Fetch data from API with fallback to sample JSON
  const fetchPhraseData = async (level: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://backend.phrase-of-the-day.com/api/v1/phrases?level=${level}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      );
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      // Validate the data structure
      if (apiData && apiData.phrases && Array.isArray(apiData.phrases) && apiData.phrases.length > 0) {
        setPhraseData(apiData as PhraseData);
        setPhrase(apiData.phrases[0]);
      } else {
        throw new Error('Invalid data structure received from API');
      }
      
    } catch (apiError) {
      console.warn('API fetch failed, using fallback data:', apiError);
      setError('Using offline data');
      
      // Use fallback data
      const fallbackData = initialPhraseData as PhraseData;
      setPhraseData(fallbackData);
      
      if (fallbackData.phrases && fallbackData.phrases.length > 0) {
        setPhrase(fallbackData.phrases[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Fetch data when component mounts or learning level changes
  useEffect(() => {
    fetchPhraseData(learningLevel);
  }, [learningLevel]);

  const totalSteps = 4;
  const stepMap: Record<Page, number> = {
    home: 0,
    examples: 1,
    quiz: 2,
    regions: 3,
    completion: 4
  };

  const handleNext = () => {
    const previousPage = currentPage;
    switch (currentPage) {
      case 'home':
        setCurrentPage('examples');
        trackNavigation('home', 'examples');
        break;
      case 'examples':
        setCurrentPage('quiz');
        trackNavigation('examples', 'quiz');
        break;
      case 'quiz':
        setCurrentPage('regions');
        trackNavigation('quiz', 'regions');
        break;
      case 'regions':
        setCurrentPage('completion');
        trackNavigation('regions', 'completion');
        break;
    }
  };

  const handleRestart = () => {
    setCurrentPage('home');
    resetSponsor();
    trackNavigation('completion', 'home');
  };

  const handleRetry = () => {
    fetchPhraseData(learningLevel);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl font-bold mb-4">{t('loading')}</div>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!phrase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-2xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Phrase</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load today's phrase. Please check your internet connection and try again.
          </p>
          <button
            onClick={handleRetry}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header onRestart={handleRestart} />
      
      {currentPage === 'home' && (
        <HomePage phrase={phrase} onNext={handleNext} error={error} />
      )}
      
      {currentPage === 'regions' && (
        <RegionsPage 
          phrase={phrase} 
          onNext={handleNext}
          currentStep={stepMap[currentPage]}
          totalSteps={totalSteps}
        />
      )}
      
      {currentPage === 'examples' && (
        <ExamplesPage 
          phrase={phrase} 
          onNext={handleNext}
          currentStep={stepMap[currentPage]}
          totalSteps={totalSteps}
        />
      )}
      
      {currentPage === 'quiz' && (
        <QuizPage 
          phrase={phrase} 
          onNext={handleNext}
          currentStep={stepMap[currentPage]}
          totalSteps={totalSteps}
        />
      )}
      
      {currentPage === 'completion' && (
        <CompletionPage phrase={phrase} />
      )}
      
      {/* Sponsor Popup */}
      {phraseData?.sponsor && (
        <SponsorPopup 
          sponsor={phraseData.sponsor} 
          isVisible={isVisible}
          onClose={closeSponsorPopup}
        />
      )}
      
      {/* Audio Diagnostic - Remove in production */}
      <AudioDiagnostic />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;