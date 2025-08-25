import { useEffect } from 'react';

// Extend the global window object to include gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const useAnalytics = () => {
  // Track page view
  const trackPageView = (pageName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-N412C6GCYC', {
        page_title: pageName,
        page_location: window.location.href,
      });
    }
  };

  // Track custom events
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Track phrase learning events
  const trackPhraseEvent = (action: string, phrase: string, level?: string) => {
    trackEvent(action, 'phrase_learning', phrase, level ? 1 : 0);
  };

  // Track quiz events
  const trackQuizEvent = (action: string, score?: number) => {
    trackEvent(action, 'quiz', 'quiz_completion', score);
  };

  // Track navigation events
  const trackNavigation = (fromPage: string, toPage: string) => {
    trackEvent('page_navigation', 'navigation', `${fromPage}_to_${toPage}`);
  };

  return {
    trackPageView,
    trackEvent,
    trackPhraseEvent,
    trackQuizEvent,
    trackNavigation,
  };
};

// Hook to automatically track page views
export const usePageTracking = (pageName: string) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
};
