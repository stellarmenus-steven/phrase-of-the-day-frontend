import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioButtonProps {
  text: string;
  isPlaying: boolean;
  onPlay: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  isPlaying,
  onPlay,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={() => onPlay(text)}
      className={`
        ${sizeClasses[size]}
        bg-blue-500 hover:bg-blue-600 text-white rounded-full
        flex items-center justify-center transition-all duration-200
        hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
        ${isPlaying ? 'animate-pulse bg-blue-600' : ''}
        ${className}
      `}
      disabled={isPlaying}
    >
      {isPlaying ? (
        <VolumeX size={iconSizes[size]} />
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
    </button>
  );
};