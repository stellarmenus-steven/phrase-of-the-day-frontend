import React, { useState } from 'react';
import { Menu, X, Languages, RotateCcw, TrendingUp } from 'lucide-react';
import { useLanguage, Language, LearningLevel } from '../contexts/LanguageContext';

interface HamburgerMenuProps {
  onRestart?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onRestart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, learningLevel, setLearningLevel, t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  const handleLevelChange = (level: 'beginner' | 'intermediate') => {
    setLearningLevel(level as LearningLevel);
    // For now, no functionality change - just visual selection
    // In the future, this will trigger different phrase selection
  };

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="bg-gray-800/90 backdrop-blur-sm p-3 rounded-full text-white hover:bg-gray-700/90 transition-all duration-200 shadow-xl border border-gray-600/50"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-16 right-0 bg-white rounded-2xl shadow-2xl p-6 min-w-64 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
              <Languages className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">{t('menu.language')}</h3>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  language === 'en' 
                    ? 'bg-blue-100 text-blue-800 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">🇺🇸</span>
                <span>{t('menu.english')}</span>
                {language === 'en' && <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto" />}
              </button>
              
              <button
                onClick={() => handleLanguageChange('es')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  language === 'es' 
                    ? 'bg-orange-100 text-orange-800 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">🇪🇸</span>
                <span>{t('menu.spanish')}</span>
                {language === 'es' && <div className="w-2 h-2 bg-orange-600 rounded-full ml-auto" />}
              </button>
            </div>
            
            <div className="flex items-center space-x-3 mt-6 mb-4 pb-4 border-b border-gray-200">
              <TrendingUp className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">{t('menu.level')}</h3>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleLevelChange('beginner')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  learningLevel === 'beginner' 
                    ? 'bg-green-100 text-green-800 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">🌱</span>
                <span>{t('menu.beginner')}</span>
                {learningLevel === 'beginner' && <div className="w-2 h-2 bg-green-600 rounded-full ml-auto" />}
              </button>
              
              <button
                onClick={() => handleLevelChange('intermediate')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  learningLevel === 'intermediate' 
                    ? 'bg-purple-100 text-purple-800 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">📈</span>
                <span>{t('menu.intermediate')}</span>
                {learningLevel === 'intermediate' && <div className="w-2 h-2 bg-purple-600 rounded-full ml-auto" />}
              </button>
            </div>
              
              {onRestart && (
                <>
                  <div className="border-t border-gray-200 mt-6 mb-4"></div>
                  <button
                    onClick={handleRestart}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-gray-700 hover:bg-gray-100"
                  >
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                    <span>{t('menu.restart')}</span>
                  </button>
                </>
              )}
          </div>
        </>
      )}
    </div>
  );
};