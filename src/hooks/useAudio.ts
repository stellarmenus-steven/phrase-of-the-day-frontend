import { useState, useCallback, useRef } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create new audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    setIsPlaying(true);
    
    audio.onended = () => {
      setIsPlaying(false);
    };
    
    audio.onerror = () => {
      setIsPlaying(false);
      console.error('Error playing audio:', audioUrl);
    };
    
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
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