import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, TrendingUp, BookOpen, ChevronLeft, ChevronRight, Calendar, Coffee } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTracking, useAnalytics } from '../hooks/useAnalytics';
import type { PhraseData } from '../types/phrase';
import type { Language, LearningLevel } from '../contexts/LanguageContext';

interface WelcomePageProps {
  phraseData: PhraseData | null;
  onComplete: () => void;
}

type WelcomeStep = 'intro' | 'language' | 'level' | 'ready';

export const WelcomePage: React.FC<WelcomePageProps> = ({ phraseData, onComplete }) => {
  const { language, setLanguage, learningLevel, setLearningLevel, t } = useLanguage();
  const { trackEvent } = useAnalytics();
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<WelcomeStep>('intro');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel | null>(null);
  const [showStartButton, setShowStartButton] = useState(false);

  // Enhanced analytics tracking
  const trackWelcomeEvent = (eventName: string, parameters?: Record<string, any>) => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'welcome_flow',
        event_label: parameters?.label || eventName,
        value: parameters?.value || 1,
        custom_parameters: parameters
      });
    }
    
    // Microsoft Clarity
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName, parameters);
    }
    
    // Also use our existing trackEvent for consistency
    trackEvent(eventName, 'welcome_flow', parameters?.label || eventName, parameters?.value || 1);
  };

  usePageTracking(isFirstTime === true ? 'Welcome Page' : 'Welcome Back Page');

  useEffect(() => {
    // Check if this is the first time visiting
    const hasVisitedBefore = localStorage.getItem('spanish-app-has-visited');
    const lastVisitDate = localStorage.getItem('spanish-app-last-visit');
    const today = new Date().toDateString();
    
    if (!hasVisitedBefore) {
      setIsFirstTime(true);
      trackWelcomeEvent('welcome_first_visit', {
        label: 'first_time_visitor',
        value: 1
      });
    } else {
      setIsFirstTime(false);
      // Update last visit date
      localStorage.setItem('spanish-app-last-visit', today);
      
      // Track returning visit
      const daysDiff = getDaysDifference();
      trackWelcomeEvent('welcome_returning_visit', {
        label: 'returning_visitor',
        value: daysDiff || 1,
        days_since_last_visit: daysDiff
      });
    }
    
    setIsLoading(false);
  }, []);

  // Show start button after a brief delay once data is loaded for returning visitors
  useEffect(() => {
    if (!isFirstTime && !isLoading && phraseData?.phrases?.[0]) {
      const timer = setTimeout(() => {
        setShowStartButton(true);
        trackWelcomeEvent('welcome_back_button_ready', {
          label: 'start_button_appeared',
          value: 1
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime, isLoading, phraseData]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    
    // Enhanced language selection tracking
    trackWelcomeEvent('welcome_language_selected', {
      label: `language_${language}`,
      value: 1,
      selected_language: language,
      language_name: language === 'en' ? 'English' : 'Spanish',
      step: 'language_selection'
    });
    
    setCurrentStep('level');
    
    // Track step progression
    trackWelcomeEvent('welcome_step_completed', {
      label: 'language_step_completed',
      value: 2,
      step_number: 2,
      step_name: 'language_selection'
    });
  };

  const handleLevelSelect = (level: LearningLevel) => {
    setSelectedLevel(level);
    
    // Enhanced level selection tracking
    trackWelcomeEvent('welcome_level_selected', {
      label: `level_${level}`,
      value: 1,
      selected_level: level,
      level_name: level === 'beginner' ? 'Beginner' : 'Intermediate',
      step: 'level_selection'
    });
    
    setCurrentStep('ready');
    
    // Track step progression
    trackWelcomeEvent('welcome_step_completed', {
      label: 'level_step_completed',
      value: 3,
      step_number: 3,
      step_name: 'level_selection'
    });
  };

  const handleStart = () => {
    if (selectedLanguage && selectedLevel) {
      // Enhanced completion tracking with all selections
      trackWelcomeEvent('welcome_completed', {
        label: `completed_${selectedLanguage}_${selectedLevel}`,
        value: 1,
        selected_language: selectedLanguage,
        selected_level: selectedLevel,
        language_name: selectedLanguage === 'en' ? 'English' : 'Spanish',
        level_name: selectedLevel === 'beginner' ? 'Beginner' : 'Intermediate',
        total_steps_completed: 4,
        completion_time: Date.now()
      });
      
      // Save user preferences
      setLanguage(selectedLanguage);
      setLearningLevel(selectedLevel);
      
      // Mark as visited
      localStorage.setItem('spanish-app-has-visited', 'true');
      localStorage.setItem('spanish-app-last-visit', new Date().toDateString());
      
      // Complete welcome flow
      onComplete();
    }
  };

  const handleBack = () => {
    const previousStep = currentStep;
    
    switch (currentStep) {
      case 'language':
        setCurrentStep('intro');
        break;
      case 'level':
        setCurrentStep('language');
        break;
      case 'ready':
        setCurrentStep('level');
        break;
    }
    
    // Track back navigation
    trackWelcomeEvent('welcome_back_navigation', {
      label: `back_from_${previousStep}`,
      value: 1,
      from_step: previousStep,
      to_step: currentStep
    });
  };

  const handleGetStarted = () => {
    trackWelcomeEvent('welcome_get_started_clicked', {
      label: 'get_started_button',
      value: 1,
      step: 'intro'
    });
    setCurrentStep('language');
  };

  const handleWelcomeBackStart = () => {
    trackWelcomeEvent('welcome_back_start_clicked', {
      label: 'welcome_back_start',
      value: 1,
      days_since_last_visit: getDaysDifference()
    });
    onComplete();
  };

  const stepNumber = {
    intro: 1,
    language: 2,
    level: 3,
    ready: 4
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

  const getDaysDifference = () => {
    const lastVisit = localStorage.getItem('spanish-app-last-visit');
    if (!lastVisit) return null;
    
    const lastDate = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysDiff = getDaysDifference();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl font-bold mb-4">
            {language === 'en' ? 'Loading...' : 'Cargando...'}
          </div>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Welcome back page for returning visitors
  if (!isFirstTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-600 to-blue-600 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            {isLoading ? (
              <>
                <div className="text-6xl mb-6">⏳</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {getGreeting()}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Preparing today's Spanish phrase for you...
                </p>
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </>
            ) : phraseData?.phrases?.[0] ? (
              <>
                <Coffee className="w-16 h-16 text-teal-600 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome Back! 👋
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {getGreeting()}{' '}
                  {daysDiff && daysDiff > 1 && (
                    <span>It's been {daysDiff} days since your last visit.</span>
                  )}
                </p>
                
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Calendar className="w-6 h-6 text-teal-600" />
                    <span className="text-lg font-semibold text-gray-800">
                      {phraseData.phrases[0].date.spanish}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Ready to learn today's Spanish phrase?
                  </p>
                </div>

                {showStartButton ? (
                  <button
                    onClick={handleWelcomeBackStart}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg
                             hover:from-teal-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105
                             shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <span>Start Today's Lesson</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                ) : (
                  <div className="bg-gray-100 px-8 py-4 rounded-xl text-gray-500 flex items-center space-x-3 mx-auto w-fit">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Getting ready...</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-6xl mb-6">⚠️</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome Back!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  We're having trouble loading today's phrase. Please try again.
                </p>
                <button
                  onClick={handleWelcomeBackStart}
                  className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg
                           hover:bg-red-600 transition-all duration-200 transform hover:scale-105
                           shadow-lg hover:shadow-xl"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // First-time visitor flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Step Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full ${
                step <= stepNumber[currentStep]
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          {currentStep === 'intro' && (
            <>
              <div className="text-6xl mb-6">👋</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-6">
                Welcome to Phrase of the Day!
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Learn Spanish one phrase at a time.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Master pronunciation, context, 
                and usage through interactive lessons designed just for you.
              </p>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg
                         hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105
                         shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
              >
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </>
          )}

          {currentStep === 'language' && (
            <>
              <Globe className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Choose Your Learning Language
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Which language would you like explanations and context in?
              </p>
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className="w-full bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 
                           rounded-xl p-6 transition-all duration-200 flex items-center space-x-4"
                >
                  <span className="text-4xl">🇺🇸</span>
                  <div className="text-left">
                    <div className="text-xl font-semibold text-gray-800">English</div>
                    <div className="text-gray-600">Learn with English explanations</div>
                  </div>
                </button>
                <button
                  onClick={() => handleLanguageSelect('es')}
                  className="w-full bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-400 
                           rounded-xl p-6 transition-all duration-200 flex items-center space-x-4"
                >
                  <span className="text-4xl">🇪🇸</span>
                  <div className="text-left">
                    <div className="text-xl font-semibold text-gray-800">Español</div>
                    <div className="text-gray-600">Aprende con explicaciones en español</div>
                  </div>
                </button>
              </div>
            </>
          )}

          {currentStep === 'level' && (
            <>
              <TrendingUp className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                What's Your Spanish Level?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Help us customize the learning experience for you.
              </p>
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => handleLevelSelect('beginner')}
                  className="w-full bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-400 
                           rounded-xl p-6 transition-all duration-200 flex items-center space-x-4"
                >
                  <span className="text-4xl">🌱</span>
                  <div className="text-left">
                    <div className="text-xl font-semibold text-gray-800">Beginner</div>
                    <div className="text-gray-600">New to Spanish or just starting out</div>
                  </div>
                </button>
                <button
                  onClick={() => handleLevelSelect('intermediate')}
                  className="w-full bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-400 
                           rounded-xl p-6 transition-all duration-200 flex items-center space-x-4"
                >
                  <span className="text-4xl">📈</span>
                  <div className="text-left">
                    <div className="text-xl font-semibold text-gray-800">Intermediate</div>
                    <div className="text-gray-600">Know some Spanish, want to improve</div>
                  </div>
                </button>
              </div>
            </>
          )}

          {currentStep === 'ready' && (
            <>
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Perfect! You're All Set
              </h2>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4">
                    <Globe className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">Language</div>
                    <div className="text-gray-600 flex items-center justify-center space-x-2 mt-1">
                      <span className="text-lg">
                        {selectedLanguage === 'en' ? '🇺🇸' : '🇪🇸'}
                      </span>
                      <span>{selectedLanguage === 'en' ? 'English' : 'Español'}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">Level</div>
                    <div className="text-gray-600 flex items-center justify-center space-x-2 mt-1">
                      <span className="text-lg">
                        {selectedLevel === 'beginner' ? '🌱' : '📈'}
                      </span>
                      <span className="capitalize">{selectedLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Ready to start learning Spanish with today's phrase?
              </p>
              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg
                         hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105
                         shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
              >
                <BookOpen className="w-6 h-6" />
                <span>Start Learning</span>
              </button>
            </>
          )}

          {/* Navigation */}
          {currentStep !== 'intro' && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              {currentStep === 'language' || currentStep === 'level' ? (
                <div className="text-gray-400">
                  Choose an option above to continue
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
