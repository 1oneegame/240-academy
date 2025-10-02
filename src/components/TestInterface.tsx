"use client";
import { useState, useEffect, useCallback } from 'react';
import { Test } from '@/types/test';
import { Clock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import LatexRenderer from './LatexRenderer';

interface TestInterfaceProps {
  test: Test;
  onFinish: (score: number, answers: (number | null)[]) => void;
  onExit: () => void;
  mode: 'exam' | 'training';
}

export default function TestInterface({ test, onFinish, onExit, mode }: TestInterfaceProps) {
  void onExit;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(test.questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const calculateScore = useCallback((): number => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer !== null && index < test.questions.length) {
        const question = test.questions[index];
        if (question && typeof answer === 'number' && answer === question.correctAnswer) {
          correct++;
        }
      }
    });
    return correct;
  }, [answers, test.questions]);

  const finishTest = useCallback(() => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      const proceed = window.confirm(`Вы не ответили на ${unanswered} вопросов. Вы уверены, что хотите сдать тест сейчас?`);
      if (!proceed) {
        return;
      }
    }
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
    if (test.timeLimit > 0) {
      setTimeLeft(test.timeLimit * 60);
      setIsTimerActive(true);
    }
  }, [test.timeLimit, handleTimeUp]);

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
    if (!currentQuestion || answerIndex < 0 || answerIndex >= currentQuestion.options.length) {
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
    
    if (currentQuestionIndex < test.questions.length - 1) {
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

  const currentQuestion = test.questions[currentQuestionIndex];
  const isCorrect = selectedAnswer !== null && currentQuestion && selectedAnswer === currentQuestion.correctAnswer;
  const answeredQuestions = answers.filter(answer => answer !== null).length;

  const renderTextWithLatex = (text: string) => {
    const latexRegex = /\$\$(.*?)\$\$/g;
    const inlineLatexRegex = /\$(.*?)\$/g;
    
    const parts = [];
    let lastIndex = 0;
    
    // Обработка блочных формул $$
    text.replace(latexRegex, (match, formula, offset) => {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, offset),
        key: `text-${offset}`
      });
      parts.push({
        type: 'block-latex',
        content: formula,
        key: `block-${offset}`
      });
      lastIndex = offset + match.length;
      return '';
    });
    
    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
        key: `text-end`
      });
    }
    
    // Если нет LaTeX, возвращаем обычный текст
    if (parts.length === 0) {
      return text;
    }
    
    return parts.map((part, index) => {
      if (part.type === 'block-latex') {
        return (
          <LatexRenderer key={part.key} display={true} className="my-4">
            {part.content}
          </LatexRenderer>
        );
      } else if (part.type === 'text') {
        // Обработка инлайн LaTeX в тексте
        const inlineParts = [];
        let textLastIndex = 0;
        const inlineMatches = [...part.content.matchAll(inlineLatexRegex)];
        
        inlineMatches.forEach((match, matchIndex) => {
          const [fullMatch, formula] = match;
          const matchStart = match.index!;
          
          // Добавляем текст до формулы
          if (matchStart > textLastIndex) {
            inlineParts.push(part.content.slice(textLastIndex, matchStart));
          }
          
          // Добавляем LaTeX формулу
          inlineParts.push(
            <LatexRenderer key={`inline-${index}-${matchIndex}`}>
              {formula}
            </LatexRenderer>
          );
          
          textLastIndex = matchStart + fullMatch.length;
        });
        
        // Добавляем оставшийся текст
        if (textLastIndex < part.content.length) {
          inlineParts.push(part.content.slice(textLastIndex));
        }
        
        return inlineParts.length > 0 ? inlineParts : part.content;
      }
      return null;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">{test.title}</h1>
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
            <span className="font-semibold">{answeredQuestions}/{test.questions.length}</span>
          </div>
          
          <button
            onClick={finishTest}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Сдать
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {test.category}
                </span>
              </div>
              
              <div className="mb-8">
                <div className="text-2xl font-semibold text-gray-900 mb-4">
                  {currentQuestionIndex + 1}. {renderTextWithLatex(currentQuestion.question)}
                </div>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult && mode === 'training'}
                      className={cn(
                        "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                        {
                          "border-blue-800 bg-blue-50 text-blue-900": selectedAnswer === index && (!showResult || mode === 'exam'),
                          "border-gray-200 hover:border-gray-300 hover:bg-gray-50": selectedAnswer !== index && (!showResult || mode === 'exam'),
                          "border-green-500 bg-green-50 text-green-800": showResult && mode === 'training' && index === currentQuestion.correctAnswer,
                          "border-red-500 bg-red-50 text-red-800": showResult && mode === 'training' && selectedAnswer === index && index !== currentQuestion.correctAnswer,
                          "border-gray-200 bg-gray-50 text-gray-600": showResult && mode === 'training' && selectedAnswer !== index && index !== currentQuestion.correctAnswer,
                        }
                      )}
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      {renderTextWithLatex(option)}
                    </button>
                  ))}
                </div>
              </div>

              {showResult && mode === 'training' && (
                <div className={cn(
                  "p-6 rounded-xl mb-6 border",
                  isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}>
                  <div className={cn(
                    "font-semibold mb-4 flex items-center gap-2 text-lg",
                    isCorrect ? "text-green-800" : "text-red-800"
                  )}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Правильно!
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Неправильно
                      </>
                    )}
                  </div>
                  {currentQuestion.explanation && (
                    <div className="text-gray-700">
                      <strong>Объяснение:</strong> {renderTextWithLatex(currentQuestion.explanation)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Навигация по вопросам</h3>
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionNavigation(index)}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 font-medium transition-colors",
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите наилучший вариант</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((_, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{String.fromCharCode(65 + index)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
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
              {currentQuestionIndex < test.questions.length - 1 ? 'Вперед' : 'Завершить'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
