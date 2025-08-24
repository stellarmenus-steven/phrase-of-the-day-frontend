import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Sponsor } from '../types/phrase';

interface SponsorPopupProps {
  sponsor: Sponsor;
  isVisible: boolean;
  onClose: () => void;
}

export const SponsorPopup: React.FC<SponsorPopupProps> = ({ 
  sponsor, 
  isVisible, 
  onClose 
}) => {
  const { language } = useLanguage();
  
  if (!isVisible) return null;

  const handleButtonClick = () => {
    window.open(sponsor.button_url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform scale-100 animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Headline */}
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
            {sponsor.headline[language]}
          </h3>

          {/* Image */}
          <div className="mb-4">
            <img 
              src={sponsor.image_url} 
              alt="Sponsor" 
             className="max-w-full max-h-40 object-contain rounded-xl mx-auto"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
            {sponsor.text[language]}
          </p>

          {/* Button */}
          <button
            onClick={handleButtonClick}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold 
                     hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02]
                     shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>{sponsor.button_text[language]}</span>
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};