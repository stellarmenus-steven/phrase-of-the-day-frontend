import { useState, useCallback } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playText = useCallback((text: string, lang: string = 'es-ES') => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  return { playText, stopAudio, isPlaying };
};