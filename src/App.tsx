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
import { WelcomePage } from './pages/WelcomePage';
import type { Phrase, PhraseData } from './types/phrase';

// Import the phrase data
import initialPhraseData from './data/phrases.json';

type Page = 'welcome' | 'home' | 'regions' | 'examples' | 'quiz' | 'completion';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [phraseData, setPhraseData] = useState<PhraseData | null>(initialPhraseData as PhraseData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, learningLevel } = useLanguage();
  const { trackNavigation, trackPhraseEvent, trackEvent } = useAnalytics();

  const { isVisible, closeSponsorPopup, resetSponsor } = useSponsorPopup(phraseData?.sponsor);

  // Initialize browser history and handle back/forward buttons
  useEffect(() => {
      // Handle direct URL access
  const path = window.location.pathname;
  let initialPage: Page = 'home';
  
  if (path === '/welcome') initialPage = 'welcome';
  else if (path === '/examples') initialPage = 'examples';
  else if (path === '/quiz') initialPage = 'quiz';
  else if (path === '/regions') initialPage = 'regions';
  else if (path === '/completion') initialPage = 'completion';
  
  // Check if user should see welcome page immediately
  if (shouldShowWelcome() && path === '/') {
    initialPage = 'welcome';
  }
    
    // Set initial history state
    if (!window.history.state) {
      window.history.replaceState({ page: initialPage }, '', path === '/' ? '/' : path);
      if (initialPage !== currentPage) {
        setCurrentPage(initialPage);
      }
    }

    // Handle browser back/forward buttons
    const handlePopState = (event: PopStateEvent) => {
      const page = event.state?.page || 'home';
      if (page !== currentPage) {
        setCurrentPage(page);
        trackNavigation('browser', page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPage, trackNavigation]);

  // Update browser history when page changes
  const updateHistory = (page: Page) => {
    const url = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({ page }, '', url);
  };

  // Check if user should see welcome page
  const shouldShowWelcome = () => {
    const hasVisitedBefore = localStorage.getItem('spanish-app-has-visited');
    return !hasVisitedBefore;
  };

  // Fetch data from API with fallback to sample JSON
  const fetchPhraseData = async (level: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use proxy in development, full URL in production
      const apiUrl = import.meta.env.DEV 
        ? `/api/v1/phrases?level=${level}`
        : `https://backend.phrase-of-the-day.com/api/v1/phrases?level=${level}`;

      const response = await fetch(
        apiUrl,
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

  // Check if user should see welcome page on initial load
  useEffect(() => {
    if (!isLoading && shouldShowWelcome() && currentPage !== 'welcome') {
      setCurrentPage('welcome');
      updateHistory('welcome');
    }
  }, [isLoading, currentPage]);

  const totalSteps = 4;
  const stepMap: Record<Page, number> = {
    welcome: -1, // Welcome page is not part of the main flow
    home: 0,
    examples: 1,
    quiz: 2,
    regions: 3,
    completion: 4
  };

  const handleNext = () => {
    const previousPage = currentPage;
    let nextPage: Page;
    
    switch (currentPage) {
      case 'home':
        nextPage = 'examples';
        break;
      case 'examples':
        nextPage = 'quiz';
        break;
      case 'quiz':
        nextPage = 'regions';
        break;
      case 'regions':
        nextPage = 'completion';
        break;
      default:
        return;
    }
    
    setCurrentPage(nextPage);
    updateHistory(nextPage);
    trackNavigation(previousPage, nextPage);
  };

  const handleRestart = () => {
    setCurrentPage('home');
    updateHistory('home');
    resetSponsor();
    trackNavigation('completion', 'home');
  };

  const handleWelcomeComplete = () => {
    setCurrentPage('home');
    updateHistory('home');
    trackNavigation('welcome', 'home');
    
    // Track welcome completion with user preferences
    const savedLanguage = localStorage.getItem('spanish-app-language');
    const savedLevel = localStorage.getItem('spanish-app-learning-level');
    
    if (savedLanguage && savedLevel) {
      trackEvent('welcome_to_home_transition', 'welcome_flow', `${savedLanguage}_${savedLevel}`, 1, {
        user_language: savedLanguage,
        user_level: savedLevel,
        language_name: savedLanguage === 'en' ? 'English' : 'Spanish',
        level_name: savedLevel === 'beginner' ? 'Beginner' : 'Intermediate'
      });
    }
  };

  const handleRetry = () => {
    fetchPhraseData(learningLevel);
  };

  // Check if user should see welcome page immediately (before loading screen)
  const shouldShowWelcomeImmediately = shouldShowWelcome();

  if (isLoading && !shouldShowWelcomeImmediately) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-700 text-2xl font-bold mb-4">{t('loading')}</div>
          <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!phrase && !shouldShowWelcomeImmediately) {
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
      {/* Welcome page - shown before main app */}
      {currentPage === 'welcome' && (
        <WelcomePage 
          phraseData={phraseData} 
          onComplete={handleWelcomeComplete} 
        />
      )}
      
      {/* Main app content - only show if not on welcome page */}
      {currentPage !== 'welcome' && (
        <>
          <Header onRestart={handleRestart} />
          
          {currentPage === 'home' && phrase && (
            <HomePage phrase={phrase} onNext={handleNext} error={error} />
          )}
          
          {currentPage === 'regions' && phrase && (
            <RegionsPage 
              phrase={phrase} 
              onNext={handleNext}
              currentStep={stepMap[currentPage]}
              totalSteps={totalSteps}
            />
          )}
          
          {currentPage === 'examples' && phrase && (
            <ExamplesPage 
              phrase={phrase} 
              onNext={handleNext}
              currentStep={stepMap[currentPage]}
              totalSteps={totalSteps}
            />
          )}
          
          {currentPage === 'quiz' && phrase && (
            <QuizPage 
              phrase={phrase} 
              onNext={handleNext}
              currentStep={stepMap[currentPage]}
              totalSteps={totalSteps}
            />
          )}
          
          {currentPage === 'completion' && phrase && (
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
        </>
      )}
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