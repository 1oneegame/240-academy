"use client";
import { useState, useEffect } from "react";
import { User, Settings, BarChart3, Clock, CheckCircle, XCircle, X, Eye } from "lucide-react";
import { QuitButton } from "@/components/QuitButton";
import { ProtectedRoute } from "@/components/protected-route";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface TestResult {
  _id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: (number | null)[];
  mode: 'exam' | 'training';
  timeSpent: number;
  completedAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  surname?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'results' | 'progress'>('profile');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: String((session?.user as Record<string, unknown>)?.phone || ""),
    surname: String((session?.user as Record<string, unknown>)?.surname || "")
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [testDetails, setTestDetails] = useState<Record<string, unknown> | null>(null);
  const [loadingTestDetails, setLoadingTestDetails] = useState(false);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const response = await fetch('/api/test-results');
      if (response.ok) {
        const results = await response.json();
        setTestResults(results);
      }
    } catch {
      toast.error('Ошибка загрузки результатов тестов');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success('Профиль обновлен');
        setIsEditing(false);
      } else {
        toast.error('Ошибка обновления профиля');
      }
    } catch {
      toast.error('Ошибка обновления профиля');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        toast.success('Пароль изменен');
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error('Ошибка изменения пароля');
      }
    } catch {
      toast.error('Ошибка изменения пароля');
    }
  };

  const getProgressStats = () => {
    const totalTests = testResults.length;
    const passedTests = testResults.filter(result => result.percentage >= 70).length;
    const averageScore = totalTests > 0 
      ? Math.round(testResults.reduce((sum, result) => sum + result.percentage, 0) / totalTests)
      : 0;
    const totalTimeSpent = testResults.reduce((sum, result) => sum + result.timeSpent, 0);
    
    return {
      totalTests,
      passedTests,
      averageScore,
      totalTimeSpent: Math.round(totalTimeSpent / 60)
    };
  };

  const stats = getProgressStats();

  const handleResultClick = async (result: TestResult) => {
    setSelectedResult(result);
    setShowDetailModal(true);
    await fetchTestDetails(result.testId);
  };

  const fetchTestDetails = async (testId: string) => {
    setLoadingTestDetails(true);
    try {
      const response = await fetch(`/api/tests/${testId}`);
      if (response.ok) {
        const test = await response.json();
        setTestDetails(test);
      }
    } catch {
      toast.error('Ошибка загрузки деталей теста');
    } finally {
      setLoadingTestDetails(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col pt-8 min-h-screen bg-white custom-scrollbar">
        <BackToHomeButton />
        
        <section className="flex flex-col border-b border-gray-200 pb-8">
          <div className="flex justify-between flex-row pl-12 pr-6">
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-6xl font-semibold text-blue-900">Профиль пользователя</h1>
                <p className="text-3xl font-light text-gray-900">Управление профилем и просмотр прогресса</p>
              </div>
            </div>
            <div className="flex flex-row border border-gray-200 rounded-xl px-5 py-4 gap-x-2 h-fit my-auto">
              <User className="w-14 h-14 text-blue-900 rounded-full border border-gray-200"/>
              <div className="flex flex-col mr-1">
                <h2 className="text-xl font-semibold text-blue-900">{profile.name} {profile.surname}</h2>
                <p className="text-lg font-light text-gray-900">{profile.email}</p>
              </div>
              <QuitButton className="ml-1 my-auto" />
            </div>      
          </div>
        </section>

        <div className="flex px-12 pt-8 custom-scrollbar">
          <div className="w-1/4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-colors",
                  activeTab === 'profile' 
                    ? "bg-blue-100 text-blue-900 font-medium" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Settings className="w-5 h-5 inline mr-3" />
                Профиль
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-colors",
                  activeTab === 'results' 
                    ? "bg-blue-100 text-blue-900 font-medium" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <BarChart3 className="w-5 h-5 inline mr-3" />
                Результаты тестов
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-colors",
                  activeTab === 'progress' 
                    ? "bg-blue-100 text-blue-900 font-medium" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Clock className="w-5 h-5 inline mr-3" />
                Прогресс
              </button>
            </nav>
          </div>

          <div className="w-3/4 pl-8">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-blue-900">Личная информация</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      {isEditing ? 'Отмена' : 'Редактировать'}
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Фамилия</label>
                          <input
                            type="text"
                            value={profile.surname || ""}
                            onChange={(e) => setProfile({...profile, surname: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                        <input
                          type="tel"
                          value={profile.phone || ""}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Сохранить изменения
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                          <p className="text-lg text-gray-900">{profile.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Фамилия</label>
                          <p className="text-lg text-gray-900">{profile.surname || "Не указано"}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <p className="text-lg text-gray-900">{profile.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                        <p className="text-lg text-gray-900">{profile.phone || "Не указано"}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h2 className="text-2xl font-semibold text-blue-900 mb-6">Смена пароля</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Введите новый пароль"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите пароль</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Подтвердите новый пароль"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      Изменить пароль
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h2 className="text-2xl font-semibold text-blue-900 mb-6">Результаты тестов</h2>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Загрузка результатов...</p>
                    </div>
                  ) : testResults.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Результаты тестов не найдены</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testResults.map((result) => (
                        <div 
                          key={result._id} 
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-700 group"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{result.testTitle}</h3>
                                <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span>Режим: {result.mode === 'exam' ? 'Экзамен' : 'Тренировка'}</span>
                                <span>Время: {Math.round(result.timeSpent / 60)} мин</span>
                                <span>{new Date(result.completedAt).toLocaleDateString('ru-RU')}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                {result.percentage >= 70 ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className={cn(
                                  "text-lg font-semibold",
                                  result.percentage >= 70 ? "text-green-600" : "text-red-600"
                                )}>
                                  {result.percentage}%
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {result.score} из {result.totalQuestions}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Общая статистика</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Всего тестов:</span>
                        <span className="font-semibold">{stats.totalTests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Пройдено успешно:</span>
                        <span className="font-semibold text-green-600">{stats.passedTests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Средний балл:</span>
                        <span className="font-semibold">{stats.averageScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Время изучения:</span>
                        <span className="font-semibold">{stats.totalTimeSpent} мин</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Прогресс</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Успешность</span>
                          <span className="text-sm font-medium">{stats.totalTests > 0 ? Math.round((stats.passedTests / stats.totalTests) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stats.totalTests > 0 ? (stats.passedTests / stats.totalTests) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Средний балл</span>
                          <span className="text-sm font-medium">{stats.averageScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-800 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stats.averageScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {testResults.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Последние результаты</h3>
                    <div className="space-y-3">
                      {testResults.slice(0, 5).map((result) => (
                        <div key={result._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900">{result.testTitle}</p>
                            <p className="text-sm text-gray-600">{new Date(result.completedAt).toLocaleDateString('ru-RU')}</p>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "font-semibold",
                              result.percentage >= 70 ? "text-green-600" : "text-red-600"
                            )}>
                              {result.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {showDetailModal && selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
              <div className="sticky top-0 bg-white/95 border-b border-gray-200 px-6 py-4 rounded-t-2xl backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-blue-900">Подробный отчет</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-80px)]">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">{selectedResult.testTitle}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-800">{selectedResult.percentage}%</div>
                      <div className="text-sm text-gray-600">Результат</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{selectedResult.score}/{selectedResult.totalQuestions}</div>
                      <div className="text-sm text-gray-600">Правильных ответов</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{formatTime(selectedResult.timeSpent)}</div>
                      <div className="text-sm text-gray-600">Время выполнения</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">
                        {selectedResult.mode === 'exam' ? 'Экзамен' : 'Тренировка'}
                      </div>
                      <div className="text-sm text-gray-600">Режим</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Общая информация</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Дата прохождения:</span>
                        <span className="font-medium">{new Date(selectedResult.completedAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Время выполнения:</span>
                        <span className="font-medium">{formatTime(selectedResult.timeSpent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Скорость ответов:</span>
                        <span className="font-medium">{Math.round(selectedResult.timeSpent / selectedResult.totalQuestions)} сек/вопрос</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Статус:</span>
                        <span className={cn(
                          "font-medium",
                          selectedResult.percentage >= 70 ? "text-green-600" : "text-red-600"
                        )}>
                          {selectedResult.percentage >= 70 ? 'Пройден' : 'Не пройден'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Статистика</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Точность</span>
                          <span className="text-sm font-medium">{selectedResult.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              selectedResult.percentage >= 70 ? "bg-green-600" : "bg-red-600"
                            )}
                            style={{ width: `${selectedResult.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Правильные ответы</span>
                          <span className="text-sm font-medium">{selectedResult.score}/{selectedResult.totalQuestions}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-800 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(selectedResult.score / selectedResult.totalQuestions) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {loadingTestDetails ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                      <span className="ml-3 text-gray-600">Загрузка вопросов...</span>
                    </div>
                  </div>
                ) : testDetails && testDetails.questions ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Вопросы и ответы</h4>
                    <div className="space-y-4">
                      {Array.isArray(testDetails.questions) && testDetails.questions.map((question: Record<string, unknown>, index: number) => {
                        const userAnswer = selectedResult.answers[index];
                        const isCorrect = userAnswer === question.correctAnswer;
                        const hasAnswer = userAnswer !== null;
                        
                        return (
                          <div key={String(question.id || index)} className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between mb-3">
                              <h5 className="text-base font-medium text-gray-900 flex-1">
                                Вопрос {index + 1}: {String(question.question || '')}
                              </h5>
                              <div className="flex items-center gap-2 ml-4">
                                {hasAnswer ? (
                                  isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                  )
                                ) : (
                                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {Array.isArray(question.options) && question.options.map((option: string, optionIndex: number) => {
                                const isUserChoice = userAnswer === optionIndex;
                                const isCorrectOption = question.correctAnswer === optionIndex;
                                
                                return (
                                  <div
                                    key={optionIndex}
                                    className={cn(
                                      "p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02]",
                                      {
                                        "bg-green-50 border-green-300 text-green-800": isCorrectOption,
                                        "bg-red-50 border-red-300 text-red-800": isUserChoice && !isCorrectOption,
                                        "bg-gray-50 border-gray-200 text-gray-700": !isUserChoice && !isCorrectOption
                                      }
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {String.fromCharCode(65 + optionIndex)}.
                                      </span>
                                      <span>{option}</span>
                                      {isCorrectOption && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                          Правильный ответ
                                        </span>
                                      )}
                                      {isUserChoice && !isCorrectOption && (
                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                          Ваш ответ
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {Boolean(question.explanation) && (
                              <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                                <p className="text-sm text-blue-800">
                                  <strong>Объяснение:</strong> {String(question.explanation || '')}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Вопросы и ответы</h4>
                    <p className="text-gray-600">Детали теста недоступны</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
