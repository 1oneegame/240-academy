"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { Test, Question, TestCreateData } from '@/types/test';
import { Plus, Trash2, Save, Target, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState<TestCreateData>({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    isPublished: false
  });
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'questions'>('info');

  const handleInputChange = (field: keyof TestCreateData, value: any) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addQuestion = () => {
    const newQuestion: Omit<Question, 'id'> = {
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

  const updateQuestion = (index: number, field: keyof Omit<Question, 'id'>, value: any) => {
    setTestData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
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

    setLoading(true);
    
    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        toast.success('Тест успешно создан!');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        throw new Error('Ошибка при создании теста');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error('Ошибка при создании теста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col pt-8 min-h-screen bg-white">
        <BackToHomeButton />
        
        <section className="flex flex-col border-b border-gray-200 pb-8">
          <div className="pl-12 pr-6">
            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-semibold text-blue-900">
                Создание нового теста
              </h1>
              <p className="text-3xl font-light text-gray-900">
                Заполните информацию о тесте и добавьте вопросы
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
                    Основная информация
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название теста
                      </label>
                      <input
                        type="text"
                        value={testData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Введите название теста"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Категория
                      </label>
                      <input
                        type="text"
                        value={testData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: Математика, Физика"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="beginner">Начинающий</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Время на прохождение (минуты)
                      </label>
                      <input
                        type="number"
                        value={testData.timeLimit}
                        onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={testData.isPublished}
                        onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Опубликовать для студентов</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание теста
                    </label>
                    <textarea
                      value={testData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Краткое описание теста..."
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => router.push('/admin')}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('questions')}
                      className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200"
                    >
                      Далее: Вопросы
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-blue-900">
                      Вопросы теста
                    </h2>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200"
                    >
                      Добавить вопрос
                    </button>
                  </div>

                  <div className="space-y-3">
                    {testData.questions.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">Вопросы не добавлены</p>
                        <p className="text-sm">Нажмите "Добавить вопрос" чтобы начать</p>
                      </div>
                    ) : (
                      testData.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="p-3 border border-gray-200 rounded-lg">
                          {editingQuestion === questionIndex ? (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-blue-900">Вопрос {questionIndex + 1}</h4>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingQuestion(null)}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                  >
                                    Сохранить
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeQuestion(questionIndex)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Текст вопроса
                                </label>
                                <input
                                  type="text"
                                  value={question.question}
                                  onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Введите текст вопроса"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Варианты ответов
                                </label>
                                <div className="space-y-2">
                                  {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`correctAnswer_${questionIndex}`}
                                        checked={question.correctAnswer === optionIndex}
                                        onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                      />
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={`Вариант ${String.fromCharCode(65 + optionIndex)}`}
                                      />
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
                                  onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={2}
                                  placeholder="Объяснение правильного ответа..."
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-blue-900 mb-2">
                                  {questionIndex + 1}. {question.question || 'Новый вопрос'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {question.options.filter(opt => opt.trim()).length} вариантов ответа
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingQuestion(questionIndex)}
                                  className="px-3 py-1 bg-blue-800 text-white rounded text-sm hover:bg-blue-900"
                                >
                                  Редактировать
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeQuestion(questionIndex)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('info')}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Назад: Информация
                    </button>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        disabled={loading || testData.questions.length === 0}
                        className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Создание...' : 'Создать тест'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
