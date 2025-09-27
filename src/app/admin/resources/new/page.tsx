"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { ResourceCreateData } from '@/types/resource';

export default function NewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResourceCreateData>({
    title: '',
    description: '',
    type: 'document',
    url: '',
    category: '',
    isPublished: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при создании ресурса');
      }

      router.push('/admin');
    } catch (err) {
      console.error('Ошибка при создании ресурса:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
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
              <h1 className="text-6xl font-semibold text-blue-900">Создание ресурса</h1>
              <p className="text-3xl font-light text-gray-900">
                Добавьте новый полезный ресурс для студентов
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col px-12 pt-8">
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Название ресурса *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите название ресурса"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Описание *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Опишите содержимое ресурса"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Тип ресурса *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="document">Документ</option>
                    <option value="video">Видео</option>
                    <option value="link">Ссылка</option>
                    <option value="file">Файл</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Категория *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Например: Математика, Физика"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL ресурса *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>


              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                  Опубликовать сразу
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Создание...' : 'Создать ресурс'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
