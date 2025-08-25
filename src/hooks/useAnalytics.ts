import { useEffect } from 'react';

// Extend the global window object to include gtag and clarity
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    clarity: (
      command: 'event',
      eventName: string,
      parameters?: Record<string, any>
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

  // Track custom events with enhanced parameters
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number,
    customParameters?: Record<string, any>
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const eventConfig: Record<string, any> = {
        event_category: category,
        event_label: label,
        value: value,
      };

      // Add custom parameters if provided
      if (customParameters) {
        Object.assign(eventConfig, customParameters);
      }

      window.gtag('event', action, eventConfig);
    }

    // Also track in Microsoft Clarity
    if (typeof window !== 'undefined' && window.clarity) {
      const clarityParams = customParameters || {};
      if (label) clarityParams.label = label;
      if (value) clarityParams.value = value;
      if (category) clarityParams.category = category;
      
      window.clarity('event', action, clarityParams);
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

  // Enhanced welcome flow tracking
  const trackWelcomeEvent = (eventName: string, parameters?: Record<string, any>) => {
    trackEvent(
      eventName, 
      'welcome_flow', 
      parameters?.label || eventName, 
      parameters?.value || 1,
      parameters
    );
  };

  return {
    trackPageView,
    trackEvent,
    trackPhraseEvent,
    trackQuizEvent,
    trackNavigation,
    trackWelcomeEvent,
  };
};

// Hook to automatically track page views
export const usePageTracking = (pageName: string) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
};
