"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { Test } from "@/types/test";
import { VideoCourse } from "@/types/video-course";
import { Resource } from "@/types/resource";
import { User, UserStats } from "@/types/user";

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState<Course[]>([]);
  const [videoCourses, setVideoCourses] = useState<VideoCourse[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersRole, setUsersRole] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      fetchUsers(1, usersSearch, usersRole);
    }
  }, [activeTab, isAdmin]);

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
      const [coursesRes, videoCoursesRes, testsRes, resourcesRes, statsRes, userStatsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/video-courses'),
        fetch('/api/tests'),
        fetch('/api/admin/resources'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/users/stats')
      ]);
      
      const coursesData = coursesRes.ok ? await coursesRes.json() : [];
      const videoCoursesData = videoCoursesRes.ok ? await videoCoursesRes.json() : [];
      const testsData = testsRes.ok ? await testsRes.json() : [];
      const resourcesData = resourcesRes.ok ? await resourcesRes.json() : [];
      const statsData = statsRes.ok ? await statsRes.json() : null;
      const userStatsData = userStatsRes.ok ? await userStatsRes.json() : null;
      
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setVideoCourses(Array.isArray(videoCoursesData) ? videoCoursesData : []);
      setTests(Array.isArray(testsData) ? testsData : []);
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
      setStats(statsData);
      setUserStats(userStatsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setCourses([]);
      setVideoCourses([]);
      setTests([]);
      setResources([]);
      setStats(null);
      setUserStats(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = 1, search = '', role = '') => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(role && { role })
      });
      
      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users || []);
        setUsersTotalPages(data.pagination?.pages || 1);
        setUsersPage(page);
      } else {
        console.error('Error fetching users:', data.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
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
      id: "resources",
      title: "Ресурсы",
      description: "Управление полезными ресурсами",
      icon: "📚"
    },
    {
      id: "users",
      title: "Пользователи",
      description: "Управление пользователями",
      icon: "👥"
    },
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

  const toggleTestPublish = async (test: Test) => {
    try {
      const response = await fetch(`/api/tests/${test._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...test,
          isPublished: !test.isPublished
        })
      });

      if (response.ok) {
        setTests(tests.map(t => 
          t._id === test._id ? { ...t, isPublished: !t.isPublished } : t
        ));
      } else {
        alert('Ошибка при изменении статуса публикации');
      }
    } catch (error) {
      console.error('Error updating test:', error);
      alert('Ошибка при изменении статуса публикации');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот ресурс?')) {
      try {
        const response = await fetch(`/api/resources/${resourceId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const toggleResourcePublish = async (resource: Resource) => {
    try {
      const response = await fetch(`/api/resources/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...resource,
          isPublished: !resource.isPublished
        })
      });

      if (response.ok) {
        setResources(resources.map(r => 
          r._id === resource._id ? { ...r, isPublished: !r.isPublished } : r
        ));
      } else {
        alert('Ошибка при изменении статуса публикации');
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Ошибка при изменении статуса публикации');
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id,
          isActive: !user.isActive
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => 
          u._id === user._id ? { ...u, isActive: updatedUser.isActive } : u
        ));
      } else {
        alert('Ошибка при изменении статуса пользователя');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Ошибка при изменении статуса пользователя');
    }
  };

  const changeUserRole = async (user: User, newRole: 'user' | 'admin') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id,
          role: newRole
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => 
          u._id === user._id ? { ...u, role: updatedUser.role } : u
        ));
      } else {
        alert('Ошибка при изменении роли пользователя');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Ошибка при изменении роли пользователя');
    }
  };

  const handleUsersSearch = () => {
    fetchUsers(1, usersSearch, usersRole);
  };

  const handleUsersPageChange = (page: number) => {
    fetchUsers(page, usersSearch, usersRole);
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
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                      onClick={() => router.push(`/admin/tests/${test._id}/edit`)}
                    >
                      Редактировать
                    </button>
                    <button 
                      className={`px-3 py-1 rounded transition-colors ${
                        test.isPublished 
                          ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                      onClick={() => toggleTestPublish(test)}
                    >
                      {test.isPublished ? 'Снять с публикации' : 'Опубликовать'}
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

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-900">Управление ресурсами</h2>
        <button 
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          onClick={() => router.push("/admin/resources/new")}
        >
          Добавить ресурс
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {resources.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Ресурсы не найдены</p>
            ) : (
              resources.map((resource) => (
                <div key={resource._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900">{resource.title}</h3>
                    <p className="text-gray-600 mb-2">{resource.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{resource.category}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{resource.type}</span>
                      <span>{new Date(resource.createdAt).toLocaleDateString('ru-RU')}</span>
                      <span className={resource.isPublished ? 'text-green-600' : 'text-orange-600'}>
                        {resource.isPublished ? 'Опубликован' : 'Черновик'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className={`px-3 py-1 rounded transition-colors ${
                        resource.isPublished 
                          ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                      onClick={() => toggleResourcePublish(resource)}
                    >
                      {resource.isPublished ? 'Снять с публикации' : 'Опубликовать'}
                    </button>
                    <button 
                      className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                      onClick={() => handleDeleteResource(resource._id!)}
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-900">Управление пользователями</h2>
        {userStats && (
          <div className="text-sm text-gray-600">
            Всего: {userStats.total} | Активных: {userStats.active} | Студентов: {userStats.students} | Админов: {userStats.admins}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={usersRole}
              onChange={(e) => setUsersRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все роли</option>
              <option value="user">Пользователи</option>
              <option value="admin">Администраторы</option>
            </select>
            <button
              onClick={handleUsersSearch}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Поиск
            </button>
          </div>
        </div>

        {usersLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Пользователи не найдены</p>
            ) : (
              users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-blue-900">{user.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Активен' : 'Заблокирован'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{user.email}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Зарегистрирован: {new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                      {user.lastLoginAt && (
                        <span>Последний вход: {new Date(user.lastLoginAt).toLocaleDateString('ru-RU')}</span>
                      )}
                      <span>Тестов пройдено: {user.testResultsCount || 0}</span>
                      <span>Курсов завершено: {user.completedCoursesCount || 0}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => changeUserRole(user, user.role === 'admin' ? 'user' : 'admin')}
                      className={`px-3 py-1 rounded transition-colors ${
                        user.role === 'admin'
                          ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      {user.role === 'admin' ? 'Сделать пользователем' : 'Сделать админом'}
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`px-3 py-1 rounded transition-colors ${
                        user.isActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {user.isActive ? 'Заблокировать' : 'Разблокировать'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {usersTotalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={() => handleUsersPageChange(usersPage - 1)}
                disabled={usersPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              <span className="px-3 py-1 text-gray-600">
                Страница {usersPage} из {usersTotalPages}
              </span>
              <button
                onClick={() => handleUsersPageChange(usersPage + 1)}
                disabled={usersPage === usersTotalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед
              </button>
            </div>
          </div>
        )}
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
      case "resources":
        return renderResources();
      case "users":
        return renderUsers();
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
