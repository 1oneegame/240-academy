"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import TestInterface from '@/components/TestInterface';
import { Test, Question, TestResult } from '@/types/test';
import { Play, CheckCircle, Clock, BookOpen, ArrowLeft, ArrowRight, Target, Brain, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';

type Mode = 'selection' | 'exam' | 'training';
type TestPhase = 'active' | 'results';

export default function PracticePage() {
  const [mode, setMode] = useState<Mode>('selection');
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [testPhase, setTestPhase] = useState<TestPhase>('active');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [testForModal, setTestForModal] = useState<Test | null>(null);
  const [currentTestMode, setCurrentTestMode] = useState<'exam' | 'training' | null>(null);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    fetchTests();
  }, []);


  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tests');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Ошибка сервера'}`);
      }
      
      const testsData = await response.json();
      
      if (Array.isArray(testsData)) {
        const publishedTests = testsData.filter((test: Test) => test.isPublished);
        setTests(publishedTests);
        console.log('Loaded tests:', publishedTests.length, 'published tests');
        
        if (publishedTests.length === 0) {
          toast('Опубликованных тестов пока нет', { icon: 'ℹ️' });
        }
      } else {
        console.error('Invalid response format:', testsData);
        setError('Неверный формат данных от сервера');
        toast.error('Неверный формат данных от сервера');
      }
      
    } catch (error) {
      console.error('Error fetching tests:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setError(`Не удалось загрузить тесты: ${errorMessage}`);
      toast.error(`Ошибка при загрузке тестов: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };


  const getRandomTest = (): Test | null => {
    if (!tests || tests.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * tests.length);
    return tests[randomIndex];
  };

  const openModeModal = (test: Test) => {
    setTestForModal(test);
    setShowModeModal(true);
    setError(null);
  };

  const closeModeModal = () => {
    setShowModeModal(false);
    setTestForModal(null);
  };

  const startTest = (test: Test, modeType: 'exam' | 'training') => {
    if (!test || !test.questions || test.questions.length === 0) {
      setError('Тест пустой или поврежден');
      toast.error('Тест пустой или поврежден');
      return;
    }
    setSelectedTest(test);
    setMode(modeType);
    setCurrentTestMode(modeType);
    setTestPhase('active');
    setScore(0);
    setShowModeModal(false);
    setTestForModal(null);
    setTestStartTime(Date.now());
    
    toast.success(modeType === 'exam' ? 'Экзамен начат! Удачи!' : 'Тренировка начата!');
  };


  const saveTestResult = async (testId: string, testTitle: string, score: number, totalQuestions: number, percentage: number, answers: (number | null)[], mode: 'exam' | 'training', timeSpent: number) => {
    try {
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId,
          testTitle,
          score,
          totalQuestions,
          percentage,
          answers,
          mode,
          timeSpent
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сохранения результата');
      }

      const result = await response.json();
      console.log('Результат теста сохранен:', result);
    } catch (error) {
      console.error('Ошибка при сохранении результата:', error);
    }
  };


  const resetToSelection = () => {
    setMode('selection');
    setSelectedTest(null);
    setTestPhase('active');
    setScore(0);
    setError(null);
    setCurrentTestMode(null);
    setTestStartTime(0);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex items-center justify-center flex-1">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-xl text-gray-600">Загрузка тестов...</div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (mode === 'selection') {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <section className="flex flex-col border-b border-gray-200 pb-8">
            <div className="pl-12 pr-6">
              <div className="flex flex-col gap-y-4">
                <h1 className="text-6xl font-semibold text-blue-900">
                  NUET Practice
                </h1>
                <p className="text-3xl font-light text-gray-900">
                  Практические задания и тесты для подготовки к НУЕТ
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col px-12 pt-16">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <div className="text-red-800 text-lg mb-4">{error}</div>
                <button
                  onClick={fetchTests}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Попробовать снова
                </button>
              </div>
            )}
            
            {tests.length > 0 && (
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {tests.map((test, index) => (
                    <div 
                      key={test._id} 
                      onClick={() => openModeModal(test)}
                      className="group relative bg-white border-l-4 border-l-blue-800 rounded-r-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                              {test.title}
                            </h3>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {test.questions?.length || 0} вопросов
                              </span>
                              {test.timeLimit && test.timeLimit > 0 && (
                                <span className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  {test.timeLimit} мин
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm group-hover:text-blue-900 transition-colors">
                            <Play className="w-4 h-4" />
                            <span>Начать</span>
                          </div>
                        </div>
                        
                        {test.description && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {test.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-800 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tests.length === 0 && !error && !loading && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  Опубликованных тестов пока нет
                </h3>
                <p className="text-gray-400 mb-4">
                  Администратор должен создать и опубликовать тесты
                </p>
                <button
                  onClick={fetchTests}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Обновить список
                </button>
              </div>
            )}

            {showModeModal && testForModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                  <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
                    Выберите режим прохождения
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {testForModal.title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Вопросов:</span>
                        <span>{testForModal.questions?.length || 0}</span>
                      </div>
                      {testForModal.timeLimit && testForModal.timeLimit > 0 && (
                        <div className="flex justify-between">
                          <span>Время:</span>
                          <span>{testForModal.timeLimit} мин</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <button
                      onClick={() => startTest(testForModal, 'exam')}
                      className="w-full p-4 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-colors font-medium flex items-center gap-3"
                    >
                      <Target className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-semibold">Режим экзамена</div>
                        <div className="text-sm text-blue-200">Без подсказок, отчет после завершения</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => startTest(testForModal, 'training')}
                      className="w-full p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center gap-3"
                    >
                      <Brain className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-semibold">Режим тренировки</div>
                        <div className="text-sm text-green-100">С обратной связью и объяснениями</div>
                      </div>
                    </button>
                  </div>
                  
                  <button
                    onClick={closeModeModal}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </ProtectedRoute>
    );
  }


  if ((mode === 'exam' || mode === 'training') && testPhase === 'active' && selectedTest && selectedTest.questions && selectedTest.questions.length > 0) {
    return (
      <ProtectedRoute>
        <TestInterface
          test={selectedTest}
          mode={mode}
          onFinish={(score, testAnswers) => {
            setScore(score);
            setAnswers(testAnswers);
            setTestPhase('results');
            const percentage = Math.round((score / selectedTest.questions.length) * 100);
            const timeSpent = testStartTime ? Math.round((Date.now() - testStartTime) / 1000) : 0;
            
            if (session?.user) {
              saveTestResult(
                selectedTest._id || '',
                selectedTest.title,
                score,
                selectedTest.questions.length,
                percentage,
                testAnswers,
                mode,
                timeSpent
              );
            }
            
            toast.success(`Тест завершен! Вы набрали ${percentage}%`);
          }}
          onExit={resetToSelection}
        />
      </ProtectedRoute>
    );
  }

  if ((mode === 'exam' || mode === 'training') && testPhase === 'active' && (!selectedTest || !selectedTest.questions || selectedTest.questions.length === 0)) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">Ошибка теста</h2>
              <p className="text-gray-600 mb-6">Тест поврежден или не содержит вопросов</p>
              <button
                onClick={resetToSelection}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Вернуться к выбору
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (testPhase === 'results' && selectedTest && selectedTest.questions) {
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
                  <div className="text-6xl font-bold text-blue-800 mb-4">
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

              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-semibold text-blue-900 mb-6">Детальный отчет</h2>
                <div className="space-y-6">
                  {selectedTest.questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <div key={index} className={cn(
                        "p-6 rounded-xl border-2",
                        isCorrect ? "border-blue-200 bg-blue-50" : "border-red-200 bg-red-50"
                      )}>
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
                            Вопрос {index + 1}: {question.question}
                          </h3>
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                            isCorrect ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                          )}>
                            {isCorrect ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Правильно
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-4 h-4" />
                                Неправильно
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={cn(
                                "p-3 rounded-lg border",
                                optionIndex === question.correctAnswer
                                  ? "border-blue-500 bg-blue-100 text-blue-800"
                                  : optionIndex === userAnswer
                                  ? "border-red-500 bg-red-100 text-red-800"
                                  : "border-gray-200 bg-gray-50 text-gray-600"
                              )}
                            >
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                              {optionIndex === question.correctAnswer && (
                                <span className="ml-2 text-green-700 font-semibold">
                                  ✓ Правильный ответ
                                </span>
                              )}
                              {optionIndex === userAnswer && optionIndex !== question.correctAnswer && (
                                <span className="ml-2 text-red-700 font-semibold">
                                  ✗ Ваш ответ
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <strong className="text-blue-800">Объяснение:</strong>
                            <p className="text-blue-700 mt-1">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetToSelection}
                  className="px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-colors font-medium"
                >
                  Выбрать другой тест
                </button>
                
                <button
                  onClick={() => {
                    if (selectedTest && currentTestMode) {
                      startTest(selectedTest, currentTestMode);
                    }
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
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

  return null;
}
