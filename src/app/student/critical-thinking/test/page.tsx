"use client";

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import CriticalThinkingInterface from '@/components/CriticalThinkingInterface';
import { CheckCircle, RotateCcw, Target, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';

type Mode = 'selection' | 'exam' | 'training';
type TestPhase = 'active' | 'results';

export default function CriticalThinkingTestPage() {
  const [testTitle, setTestTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [year, setYear] = useState('');
  const [mode, setMode] = useState<Mode>('selection');
  const [testPhase, setTestPhase] = useState<TestPhase>('active');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title') || 'Тест по критическому мышлению';
    const pdf = urlParams.get('pdf') || '';
    const yearParam = urlParams.get('year') || '';
    
    setTestTitle(title);
    setPdfUrl(pdf);
    setYear(yearParam);
    
    if (yearParam) {
      loadCorrectAnswers(yearParam).then(() => {
        setShowModeModal(true);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const loadCorrectAnswers = async (year: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/tests/critical-thinking/answers.json');
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить ответы');
      }
      
      const answersData = await response.json();
      
      if (answersData[year] && answersData[year].answers) {
        setCorrectAnswers(answersData[year].answers);
        setLoading(false);
      } else {
        throw new Error(`Ответы для ${year} года не найдены`);
      }
    } catch (error) {
      console.error('Error loading answers:', error);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      setLoading(false);
    }
  };

  const openModeModal = () => {
    setShowModeModal(true);
    setError(null);
  };

  const closeModeModal = () => {
    setShowModeModal(false);
  };

  const startTest = (modeType: 'exam' | 'training') => {
    setMode(modeType);
    setTestPhase('active');
    setScore(0);
    setShowModeModal(false);
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
    setTestPhase('active');
    setScore(0);
    setError(null);
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
              <h2 className="text-2xl font-semibold text-red-600 mb-4">Ошибка загрузки</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Вернуться назад
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }


  if ((mode === 'exam' || mode === 'training') && testPhase === 'active') {
    return (
      <ProtectedRoute>
        <CriticalThinkingInterface
          testTitle={testTitle}
          pdfUrl={pdfUrl}
          year={year}
          onFinish={(score, testAnswers) => {
            setScore(score);
            setAnswers(testAnswers);
            setTestPhase('results');
            const percentage = Math.round((score / 50) * 100);
            const timeSpent = testStartTime ? Math.round((Date.now() - testStartTime) / 1000) : 0;
            
            if (session?.user) {
              saveTestResult(
                `tsa-${year}`,
                testTitle,
                score,
                50,
                percentage,
                testAnswers,
                mode,
                timeSpent
              );
            }
            
            toast.success(`Тест завершен! Вы набрали ${percentage}%`);
          }}
          onExit={resetToSelection}
          mode={mode}
          timeLimit={90}
          correctAnswers={correctAnswers}
        />
      </ProtectedRoute>
    );
  }

  if (testPhase === 'results') {
    const percentage = Math.round((score / 50) * 100);

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
                    {score}/50
                  </div>
                  <div className="text-2xl text-gray-700 mb-2">Правильных ответов</div>
                  <div className="text-lg text-gray-500 mb-4">
                    {testTitle}
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    Результат: {percentage}%
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-semibold text-blue-900 mb-6">Детальный отчет</h2>
                <div className="space-y-4">
                  {Array.from({ length: 50 }, (_, index) => {
                    const userAnswer = answers[index];
                    const correctAnswerLetter = correctAnswers[index];
                    const userAnswerLetter = userAnswer !== null ? String.fromCharCode(65 + userAnswer) : null;
                    const isCorrect = userAnswerLetter === correctAnswerLetter;
                    
                    return (
                      <div key={index} className={cn(
                        "p-4 rounded-xl border-2",
                        isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Вопрос {index + 1}
                          </h3>
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
                        
                        <div className="text-sm text-gray-600">
                          <div className="flex gap-4">
                            <span>Ваш ответ: <span className="font-semibold">{userAnswerLetter || 'Не отвечено'}</span></span>
                            <span>Правильный ответ: <span className="font-semibold text-green-700">{correctAnswerLetter}</span></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetToSelection}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Выбрать другой тест
                </button>
                
                <button
                  onClick={() => startTest(mode === 'selection' ? 'exam' : mode)}
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

  return (
    <ProtectedRoute>
      {showModeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
              Выберите режим прохождения
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {testTitle}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Год:</span>
                  <span>{year}</span>
                </div>
                <div className="flex justify-between">
                  <span>Вопросов:</span>
                  <span>50</span>
                </div>
                <div className="flex justify-between">
                  <span>Время:</span>
                  <span>90 мин</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <button
                onClick={() => startTest('exam')}
                className="w-full p-4 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-colors font-medium flex items-center gap-3"
              >
                <Target className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Режим экзамена</div>
                  <div className="text-sm text-blue-200">Без подсказок, отчет после завершения</div>
                </div>
              </button>
              
              <button
                onClick={() => startTest('training')}
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
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
