"use client";

import { useEffect, useState } from 'react';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { ProtectedRoute } from '@/components/protected-route';
import { Resource } from '@/types/resource';
import { ExternalLink, Folder } from 'lucide-react';
import { ResourceIcon } from '@/components/ResourceIcon';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/resources');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при загрузке ресурсов');
      }
      
      const data = await response.json();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка при загрузке ресурсов:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };


  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'document':
        return 'Документ';
      case 'video':
        return 'Видео';
      case 'link':
        return 'Ссылка';
      case 'file':
        return 'Файл';
      default:
        return 'Ресурс';
    }
  };



  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];
  
  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Загрузка ресурсов...</p>
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
              <p className="text-lg text-red-600 mb-4">Ошибка: {error}</p>
              <button 
                onClick={fetchResources}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
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
              <h1 className="text-6xl font-semibold text-blue-900">Полезные ресурсы</h1>
              <p className="text-3xl font-light text-gray-900">
                Дополнительные материалы для изучения НУЕТ
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col px-12 pt-8">
          <div className="flex items-center gap-4 mb-8">
            <Folder className="w-6 h-6 text-blue-900" />
            <span className="text-lg font-medium text-gray-700">Категории:</span>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'Все' : category}
                </button>
              ))}
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-500">
                {selectedCategory === 'all' 
                  ? 'Ресурсы не найдены' 
                  : `Нет ресурсов в категории "${selectedCategory}"`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {filteredResources.map((resource) => (
                <div 
                  key={resource._id}
                  className="group relative bg-white border-l-4 border-l-blue-800 rounded-r-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ResourceIcon type={resource.type} className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                          {resource.title}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {getResourceTypeLabel(resource.type)}
                          </span>
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {resource.category || 'Без категории'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm group-hover:text-blue-900 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        <span>Открыть</span>
                      </div>
                    </div>
                    
                    {resource.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-800 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
