import React, { useState, useMemo } from 'react';
import { ArrowRight, Brain, Check, X } from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { AudioButton } from '../components/AudioButton';
import { useAudio } from '../hooks/useAudio';
import { useLanguage } from '../contexts/LanguageContext';
import type { Phrase } from '../types/phrase';

interface QuizPageProps {
  phrase: Phrase;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
}

export const QuizPage: React.FC<QuizPageProps> = ({
  phrase,
  onNext,
  currentStep,
  totalSteps,
}) => {
  const { playText, isPlaying } = useAudio();
  const { language, t } = useLanguage();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Shuffle function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const questions = useMemo(() => {
    const baseQuestions = [
      {
        question: t('quiz.question1', { phrase: phrase.phrase }),
        options: [
          phrase.meaning[language === 'en' ? 'en' : 'es'],
          language === 'en' ? "Good morning!" : "¡Buenos días!",
          language === 'en' ? "How are you?" : "¿Cómo estás?", 
          language === 'en' ? "See you later!" : "¡Hasta luego!"
        ],
        correct: 0
      },
      {
        question: t('quiz.question2', { phrase: phrase.phrase }),
        options: [
          phrase.context[language],
          language === 'en' ? "Greeting friends" : "Saludar amigos",
          language === 'en' ? "Ordering food" : "Ordenar comida",
          language === 'en' ? "Asking for directions" : "Pedir direcciones"
        ],
        correct: 0
      },
      {
        question: t('quiz.question3', { phrase: phrase.phrase }),
        options: [
          t(phrase.formality),
          language === 'en' ? "very formal" : "muy formal",
          language === 'en' ? "ceremonial" : "ceremonial",
          language === 'en' ? "academic" : "académico"
        ],
        correct: 0
      }
    ];

    // Randomize options for each question and update correct index
    const questionsWithShuffledOptions = baseQuestions.map(question => {
      const correctAnswer = question.options[question.correct];
      const shuffledOptions = shuffleArray(question.options);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
      
      return {
        ...question,
        options: shuffledOptions,
        correct: newCorrectIndex
      };
    });

    // Randomize the order of questions
    return shuffleArray(questionsWithShuffledOptions);
  }, [phrase, language, t]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correct ? 1 : 0);
    }, 0);
  };

  const allAnswered = selectedAnswers.length === questions.length;
  const score = showResults ? getScore() : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('quiz.title')}
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-6">
            {t('quiz.subtitle')} <strong>"{phrase.phrase}"</strong>
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <AudioButton
              text={phrase.phrase}
              isPlaying={isPlaying}
              onPlay={playText}
            />
            <span className="text-2xl font-bold text-white">{phrase.phrase}</span>
          </div>
        </div>
        
        <div className="space-y-6 mb-8">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {question.question}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[questionIndex] === optionIndex;
                  const isCorrect = optionIndex === question.correct;
                  const showCorrectness = showResults;
                  
                  let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
                  
                  if (showCorrectness) {
                    if (isCorrect) {
                      buttonClass += "bg-green-100 border-green-500 text-green-800";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-red-100 border-red-500 text-red-800";
                    } else {
                      buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
                    }
                  } else if (isSelected) {
                    buttonClass += "bg-purple-100 border-purple-500 text-purple-800";
                  } else {
                    buttonClass += "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100";
                  }
                  
                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                      className={buttonClass}
                      disabled={showResults}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showCorrectness && (
                          <span>
                            {isCorrect && <Check className="w-5 h-5 text-green-600" />}
                            {isSelected && !isCorrect && <X className="w-5 h-5 text-red-600" />}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {showResults && (
          <div className="bg-white rounded-xl p-8 shadow-lg mb-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t('quiz.complete')}
            </h3>
            <div className="text-4xl font-bold mb-4">
              <span className={score === questions.length ? 'text-green-600' : score >= questions.length / 2 ? 'text-yellow-600' : 'text-red-600'}>
                {score}/{questions.length}
              </span>
            </div>
            <p className="text-gray-600">
              {score === questions.length && t('quiz.perfect')}
              {score >= questions.length / 2 && score < questions.length && t('quiz.great')}
              {score < questions.length / 2 && t('quiz.keepPracticing')}
            </p>
          </div>
        )}
        
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        
        <div className="text-center">
          {!showResults ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform flex items-center space-x-3 mx-auto mb-20
                ${allAnswered 
                  ? 'bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 shadow-lg hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {t('quiz.submitAnswers')}
            </button>
          ) : (
            <button
              onClick={onNext}
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-xl font-bold text-lg mb-20
                       transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl
                       flex items-center space-x-3 mx-auto"
            >
              <span>{t('quiz.finish')}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};