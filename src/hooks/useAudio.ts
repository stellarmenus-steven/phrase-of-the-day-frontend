import { useState, useCallback, useRef } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string, fallbackText?: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    console.log('Attempting to play audio:', audioUrl);

    // Create new audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    setIsPlaying(true);
    
    audio.onended = () => {
      console.log('Audio playback ended:', audioUrl);
      setIsPlaying(false);
    };
    
    audio.onerror = (error) => {
      console.error('Audio error:', error);
      console.error('Failed to load audio URL:', audioUrl);
      setIsPlaying(false);
      
      // Log additional error details
      if (audio.error) {
        console.error('Audio error code:', audio.error.code);
        console.error('Audio error message:', audio.error.message);
      }
      
      // Fallback to text-to-speech if available
      if (fallbackText) {
        console.log('Falling back to text-to-speech for:', fallbackText);
        setTimeout(() => {
          // Use speech synthesis directly to avoid circular dependency
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(fallbackText);
            utterance.lang = 'es-ES';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
          }
        }, 100);
      }
    };
    
    audio.onloadstart = () => {
      console.log('Audio loading started:', audioUrl);
    };
    
    audio.oncanplay = () => {
      console.log('Audio can play:', audioUrl);
    };
    
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      console.error('Audio URL that failed:', audioUrl);
      setIsPlaying(false);
      
      // Fallback to text-to-speech if available
      if (fallbackText) {
        console.log('Falling back to text-to-speech for:', fallbackText);
        setTimeout(() => {
          // Use speech synthesis directly to avoid circular dependency
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(fallbackText);
            utterance.lang = 'es-ES';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
          }
        }, 100);
      }
    });
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Legacy function for backward compatibility
  const playText = useCallback((text: string, lang: string = 'es-ES') => {
    // Fallback to text-to-speech if no audio URL is provided
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

  return { playAudio, playText, stopAudio, isPlaying };
};