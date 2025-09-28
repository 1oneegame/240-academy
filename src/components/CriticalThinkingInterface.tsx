"use client";
import { useState, useEffect, useCallback } from 'react';
import { Clock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CriticalThinkingInterfaceProps {
  testTitle: string;
  pdfUrl: string;
  year: string;
  onFinish: (score: number, answers: (number | null)[]) => void;
  onExit: () => void;
  mode: 'exam' | 'training';
  timeLimit: number;
  correctAnswers: string[];
}

export default function CriticalThinkingInterface({ 
  testTitle, 
  pdfUrl, 
  year,
  onFinish, 
  onExit,
  mode, 
  timeLimit,
  correctAnswers 
}: CriticalThinkingInterfaceProps) {
  void year;
  void onExit;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(50).fill(null));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const calculateScore = useCallback((): number => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer !== null && index < correctAnswers.length) {
        const correctAnswerLetter = correctAnswers[index];
        const userAnswerLetter = String.fromCharCode(65 + answer);
        if (userAnswerLetter === correctAnswerLetter) {
          correct++;
        }
      }
    });
    return correct;
  }, [answers, correctAnswers]);

  const finishTest = useCallback(() => {
    setIsTimerActive(false);
    const score = calculateScore();
    onFinish(score, answers);
  }, [answers, onFinish, calculateScore]);

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    if (mode === 'exam') {
      finishTest();
    }
  }, [mode, finishTest]);

  useEffect(() => {
    if (timeLimit > 0) {
      setTimeLeft(timeLimit * 60);
      setIsTimerActive(true);
    }
  }, [timeLimit, handleTimeUp]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Ваш прогресс будет потерян при перезагрузке страницы. Вы уверены, что хотите покинуть тест?';
      return 'Ваш прогресс будет потерян при перезагрузке страницы. Вы уверены, что хотите покинуть тест?';
    };

    const handlePopState = (e: PopStateEvent) => {
      const confirmLeave = window.confirm('Ваш прогресс будет потерян при выходе с теста. Вы уверены, что хотите покинуть тест?');
      if (!confirmLeave) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, handleTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (answerIndex < 0 || answerIndex >= 5) {
      return;
    }
    
    setSelectedAnswer(answerIndex);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
    
    if (mode === 'training') {
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    
    if (currentQuestionIndex < 49) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
      setShowResult(false);
    } else {
      finishTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setShowResult(false);
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setSelectedAnswer(answers[questionIndex]);
    setShowResult(false);
  };

  const getCorrectAnswerIndex = (questionIndex: number): number => {
    if (questionIndex >= correctAnswers.length) return 0;
    const correctLetter = correctAnswers[questionIndex];
    return correctLetter.charCodeAt(0) - 65;
  };

  const isCorrect = selectedAnswer !== null && selectedAnswer === getCorrectAnswerIndex(currentQuestionIndex);
  const answeredQuestions = answers.filter(answer => answer !== null).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">{testTitle}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          {isTimerActive && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className={cn(
                "text-lg font-mono",
                timeLeft < 300 ? 'text-red-400' : 'text-green-400'
              )}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Прогресс:</span>
            <span className="font-semibold">{answeredQuestions}/50</span>
          </div>
          
          <button
            onClick={finishTest}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Сдать
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-56px)]">
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto h-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-2xl font-semibold text-gray-900">PDF Документ</h2>
                <div className="flex gap-4">
                  <a
                    href={pdfUrl}
                    download
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium flex items-center gap-2"
                  >
                    <span>Скачать PDF</span>
                  </a>
                </div>
              </div>
              
              <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full"
                  title={testTitle}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-96 bg-white border-l border-gray-200 p-4 flex flex-col h-full">
          <div className="mb-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Навигация по вопросам</h3>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 50 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionNavigation(index)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 font-medium transition-colors text-xs",
                    index === currentQuestionIndex
                      ? "bg-blue-800 border-blue-800 text-white"
                      : answers[index] !== null
                      ? "bg-blue-100 border-blue-300 text-blue-800"
                      : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Вопрос {currentQuestionIndex + 1}
            </h3>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D', 'E'].map((letter, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    disabled={showResult && mode === 'training'}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className={cn(
                    "text-gray-700",
                    showResult && mode === 'training' && index === getCorrectAnswerIndex(currentQuestionIndex)
                      ? "text-blue-700 font-semibold"
                      : showResult && mode === 'training' && selectedAnswer === index && index !== getCorrectAnswerIndex(currentQuestionIndex)
                      ? "text-red-700 font-semibold"
                      : "text-gray-700"
                  )}>
                    {letter}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {showResult && mode === 'training' && (
            <div className={cn(
              "p-3 rounded-xl mb-4 border flex-shrink-0",
              isCorrect ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"
            )}>
              <div className={cn(
                "font-semibold mb-2 flex items-center gap-2",
                isCorrect ? "text-blue-800" : "text-red-800"
              )}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Правильно!
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Неправильно
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Правильный ответ: <span className="font-semibold">{correctAnswers[currentQuestionIndex]}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 flex-shrink-0 mt-auto">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                currentQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                selectedAnswer === null
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-800 text-white hover:bg-blue-900"
              )}
            >
              {currentQuestionIndex < 49 ? 'Вперед' : 'Завершить'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
