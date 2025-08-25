import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es';
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  learningLevel: LearningLevel;
  setLearningLevel: (level: LearningLevel) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'menu.language': 'Language',
    'menu.english': 'English',
    'menu.spanish': 'Spanish',
    'menu.level': 'Level',
    'menu.beginner': 'Beginner',
    'menu.intermediate': 'Intermediate',
    'menu.restart': 'Start Over',
    
    // Home Page
    'home.todaysPhrase': "Today's Phrase",
    'home.letsLearn': "Let's Learn This!",
    'home.masterPhrase': 'Master this phrase in just a few minutes',
    
    // Regions Page
    'regions.title': 'Regional Differences',
    'regions.subtitle': 'is used differently across Spanish-speaking regions',
    'regions.spain': 'Spain 🇪🇸',
    'regions.latinAmerica': 'Latin America 🌎',
    'regions.tip': '💡 Learning Tip',
    'regions.tipText': 'While regional variations exist, both forms are understood across the Spanish-speaking world. Choose the version that matches your target audience or learning goals. When in doubt, the more formal or widely understood version is often safer in international contexts.',
    'regions.seeExamples': 'Continue',
    
    // Examples Page
    'examples.title': 'Everyday Conversations',
    'examples.subtitle': 'is used in everyday conversations',
    'examples.example': 'Example',
    'examples.context': 'Context',
    'examples.similarPhrases': '🎯 Similar Phrases',
    'examples.testKnowledge': 'Test Your Knowledge',
    
    // Quiz Page
    'quiz.title': 'Quick Quiz',
    'quiz.subtitle': 'Test your understanding of',
    'quiz.question1': 'What does "{phrase}" mean in English?',
    'quiz.question2': 'In what context is "{phrase}" typically used?',
    'quiz.question3': 'What is the formality level of "{phrase}"?',
    'quiz.submitAnswers': 'Submit Answers',
    'quiz.complete': 'Quiz Complete! 🎉',
    'quiz.perfect': "Perfect! You've mastered this phrase!",
    'quiz.great': "Great job! You're getting there!",
    'quiz.keepPracticing': "Keep practicing! You'll get it next time!",
    'quiz.finish': 'Finish Learning',
    
    // Completion Page
    'completion.congratulations': 'Congratulations!',
    'completion.mastered': "You've Mastered Today's Phrase!",
    'completion.whatYouLearned': '📚 What You Learned',
    'completion.learned1': '✓ The meaning and pronunciation',
    'completion.learned2': '✓ Regional usage differences', 
    'completion.learned3': '✓ Real-world conversation examples',
    'completion.learned4': '✓ Similar phrases and alternatives',
    'completion.comeBack': 'Come Back Tomorrow!',
    'completion.nextPhrase': 'Your next Spanish phrase will be ready on',
    'completion.proTip': '💡 Pro Tip: Try using "{phrase}" in a conversation today to reinforce your learning!',
    'completion.review': 'Review This Phrase',
    'completion.building': 'Building fluency one phrase at a time 🚀',
    
    // Common
    'difficulty': 'Difficulty',
    'formality': 'Formality',
    'step': 'Step',
    'total': 'total',
    'loading': 'Loading today\'s phrase...',
    
    // Welcome Page
    'welcome.title': 'Welcome to Spanish Phrase of the Day!',
    'welcome.subtitle': 'Let\'s personalize your learning experience',
    'welcome.languageQuestion': 'What language would you like explanations in?',
    'welcome.levelQuestion': 'What\'s your Spanish learning level?',
    'welcome.beginner': 'Beginner',
    'welcome.beginnerDesc': 'Just starting out',
    'welcome.intermediate': 'Intermediate',
    'welcome.intermediateDesc': 'Some experience',
    'welcome.startButton': 'Start Learning!',
    'welcome.back.title': 'Welcome Back!',
    'welcome.back.subtitle': 'Today\'s phrase is ready for',
    'welcome.back.continueButton': 'Continue Learning!',
    
    // Formality levels
    'formal': 'Formal',
    'informal': 'Informal',
    'neutral': 'Neutral',
    
    // Difficulty levels
    'beginner': 'Beginner',
    'intermediate': 'Intermediate', 
    'advanced': 'Advanced'
  },
  es: {
    // Navigation
    'menu.language': 'Idioma',
    'menu.english': 'Inglés',
    'menu.spanish': 'Español',
    'menu.level': 'Nivel',
    'menu.beginner': 'Principiante',
    'menu.intermediate': 'Intermedio',
    'menu.restart': 'Empezar de Nuevo',
    
    // Home Page
    'home.todaysPhrase': 'Frase del Día',
    'home.letsLearn': '¡Vamos a Aprender!',
    'home.masterPhrase': 'Domina esta frase en solo unos minutos',
    
    // Regions Page
    'regions.title': 'Diferencias Regionales',
    'regions.subtitle': 'se usa de manera diferente en las regiones de habla hispana',
    'regions.spain': 'España 🇪🇸',
    'regions.latinAmerica': 'América Latina 🌎',
    'regions.tip': '💡 Consejo de Aprendizaje',
    'regions.tipText': 'Aunque existen variaciones regionales, ambas formas se entienden en todo el mundo hispano. Elige la versión que coincida con tu audiencia objetivo o metas de aprendizaje. En caso de duda, la versión más formal o ampliamente entendida suele ser más segura en contextos internacionales.',
    'regions.seeExamples': 'Continuar',
    
    // Examples Page
    'examples.title': 'Conversaciones cotidianas',
    'examples.subtitle': 'se usa en conversaciones cotidianas',
    'examples.example': 'Ejemplo',
    'examples.context': 'Contexto',
    'examples.similarPhrases': '🎯 Frases Similares',
    'examples.testKnowledge': 'Pon a Prueba tu Conocimiento',
    
    // Quiz Page
    'quiz.title': 'Prueba Rápida',
    'quiz.subtitle': 'Pon a prueba tu comprensión de',
    'quiz.question1': '¿Qué significa "{phrase}" en inglés?',
    'quiz.question2': '¿En qué contexto se usa típicamente "{phrase}"?',
    'quiz.question3': '¿Cuál es el nivel de formalidad de "{phrase}"?',
    'quiz.submitAnswers': 'Enviar Respuestas',
    'quiz.complete': '¡Prueba Completada! 🎉',
    'quiz.perfect': '¡Perfecto! ¡Has dominado esta frase!',
    'quiz.great': '¡Buen trabajo! ¡Vas por buen camino!',
    'quiz.keepPracticing': '¡Sigue practicando! ¡Lo lograrás la próxima vez!',
    'quiz.finish': 'Finalizar Aprendizaje',
    
    // Completion Page
    'completion.congratulations': '¡Felicitaciones!',
    'completion.mastered': '¡Has Dominado la Frase de Hoy!',
    'completion.whatYouLearned': '📚 Lo Que Aprendiste',
    'completion.learned1': '✓ El significado y la pronunciación',
    'completion.learned2': '✓ Diferencias de uso regional',
    'completion.learned3': '✓ Ejemplos de conversaciones del mundo real',
    'completion.learned4': '✓ Frases similares y alternativas',
    'completion.comeBack': '¡Vuelve Mañana!',
    'completion.nextPhrase': 'Tu próxima frase en español estará lista el',
    'completion.proTip': '💡 Consejo: ¡Trata de usar "{phrase}" en una conversación hoy para reforzar tu aprendizaje!',
    'completion.review': 'Revisar Esta Frase',
    'completion.building': 'Construyendo fluidez una frase a la vez 🚀',
    
    // Common
    'difficulty': 'Dificultad',
    'formality': 'Formalidad',
    'step': 'Paso',
    'total': 'total',
    'loading': 'Cargando la frase de hoy...',
    
    // Welcome Page
    'welcome.title': '¡Bienvenido a Frase del Día en Español!',
    'welcome.subtitle': 'Personalicemos tu experiencia de aprendizaje',
    'welcome.languageQuestion': '¿En qué idioma quieres las explicaciones?',
    'welcome.levelQuestion': '¿Cuál es tu nivel de español?',
    'welcome.beginner': 'Principiante',
    'welcome.beginnerDesc': 'Acabas de empezar',
    'welcome.intermediate': 'Intermedio',
    'welcome.intermediateDesc': 'Algo de experiencia',
    'welcome.startButton': '¡Empezar a Aprender!',
    'welcome.back.title': '¡Bienvenido de Vuelta!',
    'welcome.back.subtitle': 'La frase de hoy está lista para el',
    'welcome.back.continueButton': '¡Continuar Aprendiendo!',
    
    // Formality levels
    'formal': 'Formal',
    'informal': 'Informal',
    'neutral': 'Neutral',
    
    // Difficulty levels
    'beginner': 'Principiante',
    'intermediate': 'Intermedio',
    'advanced': 'Avanzado'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [learningLevel, setLearningLevelState] = useState<LearningLevel>('beginner');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('spanish-app-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage);
    }
    // Default to 'en' if not set
    
    const savedLevel = localStorage.getItem('spanish-app-learning-level') as LearningLevel;
    if (savedLevel && (savedLevel === 'beginner' || savedLevel === 'intermediate' || savedLevel === 'advanced')) {
      setLearningLevelState(savedLevel);
    }
    // Default to 'beginner' if not set
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('spanish-app-language', newLanguage);
  };

  const setLearningLevel = (newLevel: LearningLevel) => {
    setLearningLevelState(newLevel);
    localStorage.setItem('spanish-app-learning-level', newLevel);
  };
  const t = (key: string, replacements?: Record<string, string>): string => {
    let translation = translations[language][key as keyof typeof translations['en']] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(`{${placeholder}}`, value);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, learningLevel, setLearningLevel, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};