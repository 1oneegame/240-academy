"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { Test } from "@/types/test";
import { VideoCourse } from "@/types/video-course";

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState<Course[]>([]);
  const [videoCourses, setVideoCourses] = useState<VideoCourse[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/check');
      const data = await response.json();
      
      if (data.isAdmin) {
        setIsAdmin(true);
        fetchData();
      } else {
        setAccessDenied(true);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setAccessDenied(true);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, videoCoursesRes, testsRes, statsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/video-courses'),
        fetch('/api/tests'),
        fetch('/api/admin/stats')
      ]);
      
      const coursesData = await coursesRes.json();
      const videoCoursesData = await videoCoursesRes.json();
      const testsData = await testsRes.json();
      const statsData = await statsRes.json();
      
      setCourses(coursesData);
      setVideoCourses(videoCoursesData);
      setTests(testsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      id: "dashboard",
      title: "Панель управления",
      description: "Общая статистика и аналитика",
      icon: "📊"
    },
    {
      id: "courses",
      title: "Видеокурсы",
      description: "Управление видеокурсами",
      icon: "🎥"
    },
    {
      id: "tests",
      title: "Тесты",
      description: "Создание и редактирование тестов",
      icon: "📝"
    },
    {
      id: "users",
      title: "Пользователи",
      description: "Управление пользователями",
      icon: "👥"
    },
    {
      id: "analytics",
      title: "Аналитика",
      description: "Статистика и отчеты",
      icon: "📈"
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900">Панель управления</h2>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего пользователей</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.users?.total || 0}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Опубликованные курсы</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.courses?.published || 0}</p>
              </div>
              <div className="text-3xl">🎥</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Опубликованные тесты</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.tests?.published || 0}</p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Завершения курсов</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.completions || 0}</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот курс?')) {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleDeleteVideoCourse = async (videoCourseId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот видеокурс?')) {
      try {
        const response = await fetch(`/api/video-courses/${videoCourseId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting video course:', error);
      }
    }
  };

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-900">Управление видеокурсами</h2>
        <div className="flex gap-3">
          <button 
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            onClick={() => router.push("/admin/video-courses")}
          >
            Создать видеокурс
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {videoCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Видеокурсы не найдены</p>
            ) : (
              videoCourses.map((videoCourse) => (
                <div key={videoCourse._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">{videoCourse.title}</h3>
                    <p className="text-gray-600">{videoCourse.lessons.length} уроков • {videoCourse.category} • {videoCourse.level}</p>
                    <p className="text-sm text-gray-500">{videoCourse.isPublished ? 'Опубликован' : 'Черновик'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200 transition-colors"
                      onClick={() => router.push(`/admin/video-courses`)}
                    >
                      Редактировать
                    </button>
                    <button 
                      className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                      onClick={() => handleDeleteVideoCourse(videoCourse._id!)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  const handleDeleteTest = async (testId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот тест?')) {
      try {
        const response = await fetch(`/api/tests/${testId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  const renderTests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-900">Управление тестами</h2>
        <button 
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          onClick={() => router.push("/admin/tests/new")}
        >
          Создать тест
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {tests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Тесты не найдены</p>
            ) : (
              tests.map((test) => (
                <div key={test._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">{test.title}</h3>
                    <p className="text-gray-600">{test.questions.length} вопросов • {test.timeLimit} минут • {test.category}</p>
                    <p className="text-sm text-gray-500">{test.isPublished ? 'Опубликован' : 'Черновик'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200 transition-colors"
                      onClick={() => router.push(`/admin/tests/${test._id}/edit`)}
                    >
                      Редактировать
                    </button>
                    <button 
                      className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                      onClick={() => handleDeleteTest(test._id!)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900">Управление пользователями</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Айжан Нурланова</h3>
              <p className="text-gray-600">aiyan.nur@example.com</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                Подробнее
              </button>
              <button className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors">
                Заблокировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900">Аналитика</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Статистика по курсам</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Математика</span>
              <span className="font-semibold">85% завершений</span>
            </div>
            <div className="flex justify-between">
              <span>Физика</span>
              <span className="font-semibold">72% завершений</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Активность пользователей</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Сегодня</span>
              <span className="font-semibold">156 активных</span>
            </div>
            <div className="flex justify-between">
              <span>На этой неделе</span>
              <span className="font-semibold">1,234 активных</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "courses":
        return renderCourses();
      case "tests":
        return renderTests();
      case "users":
        return renderUsers();
      case "analytics":
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  if (accessDenied) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
            <p className="text-xl text-gray-600 mb-8">У вас нет прав для доступа к админ-панели</p>
            <button 
              onClick={() => router.push('/student')}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Вернуться к обучению
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-blue-900 mb-8">Админ-панель</h1>
              <nav className="space-y-2">
                {adminSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === section.id
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-sm text-gray-500">{section.description}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="flex-1 p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
