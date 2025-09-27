"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { Test, Question, TestCreateData } from '@/types/test';
import { Plus, Trash2, Save, Target, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditTestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testData, setTestData] = useState<Test>({
    _id: '',
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: ''
  });
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'questions'>('info');

  useEffect(() => {
    fetchTest();
  }, [id]);

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/${id}`);
      if (response.ok) {
        const test = await response.json();
        setTestData(test);
      } else {
        toast.error('Тест не найден');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error fetching test:', error);
      toast.error('Ошибка при загрузке теста');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Test, value: any) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    };
    
    setTestData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setEditingQuestion(testData.questions.length);
    toast.success('Вопрос добавлен');
  };

  const updateQuestion = (questionIndex: number, field: keyof Question, value: any) => {
    setTestData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setTestData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setTestData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
    toast.success('Вопрос удален');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (testData.questions.length === 0) {
      toast.error('Добавьте хотя бы один вопрос');
      return;
    }

    const hasEmptyQuestions = testData.questions.some(q => 
      !q.question.trim() || q.options.some(opt => !opt.trim())
    );

    if (hasEmptyQuestions) {
      toast.error('Все поля вопросов и ответов должны быть заполнены');
      return;
    }

    setSaving(true);
    
    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        toast.success('Тест успешно обновлен!');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        throw new Error('Ошибка при обновлении теста');
      }
    } catch (error) {
      console.error('Error updating test:', error);
      toast.error('Ошибка при обновлении теста');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex items-center justify-center flex-1">
            <div className="text-xl text-gray-600">Загрузка теста...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col pt-8 min-h-screen bg-white">
        <BackToHomeButton />
        <section className="flex flex-col border-b border-gray-200 pb-8">
          <div className="pl-12 pr-6">
            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-semibold text-blue-900">
                Редактирование теста
              </h1>
              <p className="text-3xl font-light text-gray-900">
                Измените информацию о тесте и вопросы
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col px-12 pt-16">
          <div className="max-w-4xl mx-auto w-full">
            
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Основная информация
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'questions'
                    ? 'border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Вопросы ({testData.questions.length})
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {activeTab === 'info' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-semibold text-blue-900 mb-6">
                    Основная информация о тесте
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название теста
                      </label>
                      <input
                        type="text"
                        value={testData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Введите название теста"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Описание
                      </label>
                      <textarea
                        value={testData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Опишите тест"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Категория
                        </label>
                        <input
                          type="text"
                          value={testData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Например: Математика"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Уровень сложности
                        </label>
                        <select
                          value={testData.level}
                          onChange={(e) => handleInputChange('level', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="beginner">Начальный</option>
                          <option value="intermediate">Средний</option>
                          <option value="advanced">Продвинутый</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Время на прохождение (минуты)
                        </label>
                        <input
                          type="number"
                          value={testData.timeLimit}
                          onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Проходной балл (%)
                        </label>
                        <input
                          type="number"
                          value={testData.passingScore}
                          onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                          max="100"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={testData.isPublished}
                          onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Опубликовать тест
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-semibold text-blue-900 mb-6">
                    Вопросы теста
                  </h2>
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-blue-900">
                        Вопросы теста
                      </h3>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Добавить вопрос
                      </button>
                    </div>

                    {testData.questions.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Вопросы не добавлены</p>
                        <button
                          type="button"
                          onClick={addQuestion}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Добавить первый вопрос
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {testData.questions.map((question, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="text-lg font-semibold text-blue-900">
                                Вопрос {index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeQuestion(index)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Текст вопроса
                                </label>
                                <textarea
                                  value={question.question}
                                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Введите вопрос"
                                  rows={3}
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Варианты ответов
                                </label>
                                <div className="space-y-2">
                                  {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-3">
                                      <label className="flex items-center gap-2 min-w-0 flex-1">
                                        <input
                                          type="radio"
                                          name={`correctAnswer_${index}`}
                                          checked={question.correctAnswer === optionIndex}
                                          onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                                          className="w-4 h-4 text-blue-600"
                                        />
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          placeholder={`Вариант ${String.fromCharCode(65 + optionIndex)}`}
                                          required
                                        />
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Объяснение (необязательно)
                                </label>
                                <textarea
                                  value={question.explanation || ''}
                                  onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Объяснение правильного ответа"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                {activeTab === 'questions' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Назад: Информация
                  </button>
                )}
                <div className="flex gap-4 ml-auto">
                  <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={saving || testData.questions.length === 0}
                    className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
