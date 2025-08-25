import { useState, useEffect } from 'react';
import type { Sponsor } from '../types/phrase';

export const useSponsorPopup = (sponsor?: Sponsor) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!sponsor || hasShown || !sponsor.show) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasShown(true);
    }, sponsor.show_after * 1000);

    return () => clearTimeout(timer);
  }, [sponsor, hasShown]);

  const closeSponsorPopup = () => {
    setIsVisible(false);
  };

  const resetSponsor = () => {
    setHasShown(false);
    setIsVisible(false);
  };

  return {
    isVisible,
    closeSponsorPopup,
    resetSponsor
  };
};