"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { Test, Question } from '@/types/test';
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';

type TestPhase = 'active' | 'results';

export default function TestInterfacePage() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [testPhase, setTestPhase] = useState<TestPhase>('active');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchTest();
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
  }, [isTimerActive]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tests');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки тестов');
      }
      
      const testsData = await response.json();
      
      if (Array.isArray(testsData) && testsData.length > 0) {
        const publishedTests = testsData.filter((test: Test) => test.isPublished);
        if (publishedTests.length > 0) {
          setSelectedTest(publishedTests[0]);
          setTimeLeft(publishedTests[0].timeLimit ? publishedTests[0].timeLimit * 60 : 3600);
          setIsTimerActive(true);
          setAnswers(new Array(publishedTests[0].questions.length).fill(null));
        } else {
          setError('Опубликованных тестов пока нет');
        }
      } else {
        setError('Неверный формат данных от сервера');
      }
      
    } catch (error) {
      console.error('Error fetching test:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setError(`Не удалось загрузить тест: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    finishTest();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion || answerIndex < 0 || answerIndex >= currentQuestion.options.length) {
      return;
    }
    
    setSelectedAnswer(answerIndex);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (selectedTest?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
    } else {
      finishTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const handleQuestionJump = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setSelectedAnswer(answers[questionIndex]);
  };

  const finishTest = async (forceFinish = false) => {
    const unansweredQuestions = answers.filter(answer => answer === null).length;
    
    if (!forceFinish && unansweredQuestions > 0) {
      toast.error(`Вы не ответили на ${unansweredQuestions} вопросов. Ответьте на все вопросы или дождитесь окончания времени.`);
      return;
    }
    
    setIsTimerActive(false);
    const finalScore = calculateScore();
    setScore(finalScore);
    setTestPhase('results');
    
    if (!selectedTest) {
      toast.error('Ошибка при завершении теста');
      return;
    }
    
    const percentage = Math.round((finalScore / selectedTest.questions.length) * 100);
    
    if (session?.user) {
      try {
        const response = await fetch('/api/test-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testId: selectedTest._id || '',
            testTitle: selectedTest.title,
            score: finalScore,
            totalQuestions: selectedTest.questions.length,
            percentage: percentage,
            answers: answers,
            mode: 'exam',
            timeSpent: 0
          }),
        });
        
        if (response.ok) {
          toast.success('Результат сохранен!');
        } else {
          toast.error('Ошибка при сохранении результата');
        }
      } catch (error) {
        console.error('Ошибка при сохранении результата теста:', error);
        toast.error('Ошибка при сохранении результата');
      }
    }
    
    toast.success(`Тест завершен! Вы набрали ${percentage}%`);
  };

  const calculateScore = (): number => {
    if (!selectedTest || !selectedTest.questions || !answers) return 0;
    
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer !== null && index < selectedTest.questions.length) {
        const question = selectedTest.questions[index];
        if (question && typeof answer === 'number' && answer === question.correctAnswer) {
          correct++;
        }
      }
    });
    
    return correct;
  };

  const getCurrentQuestion = (): Question | null => {
    if (!selectedTest || !selectedTest.questions || currentQuestionIndex >= selectedTest.questions.length || currentQuestionIndex < 0) {
      return null;
    }
    return selectedTest.questions[currentQuestionIndex];
  };

  const currentQuestion = getCurrentQuestion();

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex items-center justify-center flex-1">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
              <div className="text-xl text-gray-600">Загрузка теста...</div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">Ошибка</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchTest}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (testPhase === 'results' && selectedTest) {
    const percentage = Math.round((score / selectedTest.questions.length) * 100);

    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex-1 px-12 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-8xl mb-8">🎉</div>
                <h1 className="text-4xl font-semibold text-blue-900 mb-4">
                  Тест завершен!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Посмотрите на свои результаты ниже
                </p>
                
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-8">
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {score}/{selectedTest.questions.length}
                  </div>
                  <div className="text-2xl text-gray-700 mb-2">Правильных ответов</div>
                  <div className="text-lg text-gray-500 mb-4">
                    {selectedTest.title}
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    Результат: {percentage}%
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setTestPhase('active');
                    setCurrentQuestionIndex(0);
                    setSelectedAnswer(null);
                    setAnswers(new Array(selectedTest.questions.length).fill(null));
                    setScore(0);
                    setTimeLeft(selectedTest.timeLimit ? selectedTest.timeLimit * 60 : 3600);
                    setIsTimerActive(true);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Попробовать еще раз
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!selectedTest || !currentQuestion) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">Ошибка теста</h2>
              <p className="text-gray-600 mb-6">Тест поврежден или не содержит вопросов</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">NUET mock test 1</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-mono text-lg font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">
                {answers.filter(answer => answer !== null).length}/{selectedTest.questions.length}
              </span>
              <button
                onClick={() => finishTest()}
                className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors font-medium"
              >
                Сдать
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block mb-6">
                <span className="text-gray-800 font-medium">Math</span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </h2>
                
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                        selectedAnswer === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    currentQuestionIndex === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(10, selectedTest.questions.length) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuestionJump(i)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                        i === currentQuestionIndex
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === selectedTest.questions.length - 1}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    currentQuestionIndex === selectedTest.questions.length - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Выберите наилучший вариант
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((_, index) => (
                  <label
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedAnswer === index
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "bg-white border-2 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="answer"
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">{String.fromCharCode(65 + index)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg font-medium transition-colors",
                  currentQuestionIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                )}
              >
                Назад
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === selectedTest.questions.length - 1}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg font-medium transition-colors",
                  currentQuestionIndex === selectedTest.questions.length - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                Вперед
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
