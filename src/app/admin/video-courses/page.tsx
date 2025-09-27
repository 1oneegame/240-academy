"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { VideoCourse, VideoLesson } from '@/types/video-course';
import { Plus, Edit, Trash2, Eye, EyeOff, Clock, BookOpen } from 'lucide-react';

export default function AdminVideoCoursesPage() {
  const [videoCourses, setVideoCourses] = useState<VideoCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<VideoCourse | null>(null);

  useEffect(() => {
    fetchVideoCourses();
  }, []);

  const fetchVideoCourses = async () => {
    try {
      const response = await fetch('/api/video-courses');
      const courses = await response.json();
      setVideoCourses(courses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching video courses:', error);
      setLoading(false);
    }
  };

  const deleteVideoCourse = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот видеокурс?')) {
      return;
    }

    try {
      const response = await fetch(`/api/video-courses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setVideoCourses(videoCourses.filter(course => course._id !== id));
      } else {
        alert('Ошибка при удалении видеокурса');
      }
    } catch (error) {
      console.error('Error deleting video course:', error);
      alert('Ошибка при удалении видеокурса');
    }
  };

  const togglePublish = async (course: VideoCourse) => {
    try {
      const response = await fetch(`/api/video-courses/${course._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...course,
          isPublished: !course.isPublished
        })
      });

      if (response.ok) {
        setVideoCourses(videoCourses.map(c => 
          c._id === course._id ? { ...c, isPublished: !c.isPublished } : c
        ));
      } else {
        alert('Ошибка при изменении статуса публикации');
      }
    } catch (error) {
      console.error('Error updating video course:', error);
      alert('Ошибка при изменении статуса публикации');
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex items-center justify-center flex-1">
            <div className="text-xl text-gray-600">Загрузка видеокурсов...</div>
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
          <div className="flex justify-between items-center pl-12 pr-6">
            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-semibold text-blue-900">
                Управление видеокурсами
              </h1>
              <p className="text-3xl font-light text-gray-900">
                Создавайте и редактируйте видеокурсы для студентов
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              Создать видеокурс
            </button>
          </div>
        </section>

        <section className="flex flex-col px-12 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoCourses.map((course) => (
              <div 
                key={course._id}
                className="group relative flex flex-col border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-lg font-semibold text-blue-900 flex-1 mr-2">
                    {course.title}
                  </h2>
                  <div className="flex items-center gap-1">
                    {course.isPublished ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(course.estimatedDuration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{course.lessons.length} уроков</span>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {course.level}
                  </span>
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => setEditingCourse(course)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Редактировать
                  </button>
                  
                  <button
                    onClick={() => togglePublish(course)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                      course.isPublished 
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {course.isPublished ? 'Скрыть' : 'Опубликовать'}
                  </button>
                  
                  <button
                    onClick={() => course._id && deleteVideoCourse(course._id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {videoCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                Видеокурсы не найдены
              </h3>
              <p className="text-gray-400 mb-6">
                Создайте первый видеокурс для студентов
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Создать видеокурс
              </button>
            </div>
          )}
        </section>

        {showCreateForm && (
          <VideoCourseEditor
            course={null}
            onClose={() => setShowCreateForm(false)}
            onSave={() => {
              setShowCreateForm(false);
              fetchVideoCourses();
            }}
          />
        )}

        {editingCourse && (
          <VideoCourseEditor
            course={editingCourse}
            onClose={() => setEditingCourse(null)}
            onSave={() => {
              setEditingCourse(null);
              fetchVideoCourses();
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

function VideoCourseEditor({ 
  course, 
  onClose, 
  onSave 
}: { 
  course: VideoCourse | null; 
  onClose: () => void; 
  onSave: () => void; 
}) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    thumbnail: course?.thumbnail || '',
    category: course?.category || '',
    level: course?.level || 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimatedDuration: course?.estimatedDuration || 0,
    isPublished: course?.isPublished || false,
    lessons: course?.lessons || []
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    theory: '',
    duration: 0
  });

  const [showLessonForm, setShowLessonForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = course ? `/api/video-courses/${course._id}` : '/api/video-courses';
      const method = course ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      } else {
        alert('Ошибка при сохранении видеокурса');
      }
    } catch (error) {
      console.error('Error saving video course:', error);
      alert('Ошибка при сохранении видеокурса');
    }
  };

  const addLesson = () => {
    if (lessonForm.title && lessonForm.youtubeUrl && lessonForm.theory) {
      const newLesson = {
        ...lessonForm,
        id: '',
        order: formData.lessons.length + 1,
        isCompleted: false
      };
      
      setFormData({
        ...formData,
        lessons: [...formData.lessons, newLesson],
        estimatedDuration: formData.estimatedDuration + lessonForm.duration
      });
      
      setLessonForm({
        title: '',
        description: '',
        youtubeUrl: '',
        theory: '',
        duration: 0
      });
      
      setShowLessonForm(false);
    }
  };

  const removeLesson = (index: number) => {
    const lesson = formData.lessons[index];
    setFormData({
      ...formData,
      lessons: formData.lessons.filter((_, i) => i !== index),
      estimatedDuration: formData.estimatedDuration - lesson.duration
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-900">
            {course ? 'Редактировать видеокурс' : 'Создать видеокурс'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название курса
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL миниатюры
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Уровень сложности
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Публиковать курс
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Опубликовать для студентов</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Уроки курса</h3>
              <button
                type="button"
                onClick={() => setShowLessonForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Добавить урок
              </button>
            </div>

            <div className="space-y-3">
              {formData.lessons.map((lesson, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {lesson.order}. {lesson.title}
                    </h4>
                    <p className="text-sm text-gray-600">{lesson.duration} минут</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {course ? 'Сохранить изменения' : 'Создать курс'}
            </button>
          </div>
        </form>
      </div>

      {showLessonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-6">Добавить урок</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название урока
                </label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание урока
                </label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={lessonForm.youtubeUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Длительность (минуты)
                </label>
                <input
                  type="number"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Теория (HTML)
                </label>
                <textarea
                  value={lessonForm.theory}
                  onChange={(e) => setLessonForm({ ...lessonForm, theory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={8}
                  placeholder="<p>Теоретический материал урока...</p>"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowLessonForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={addLesson}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Добавить урок
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
