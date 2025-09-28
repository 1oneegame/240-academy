"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoCourse, VideoLesson } from '@/types/video-course';
import { Play, CheckCircle, Clock, BookOpen } from 'lucide-react';
import Image from 'next/image';

export default function VideoCoursesPage() {
  const [videoCourses, setVideoCourses] = useState<VideoCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<VideoCourse | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoCourses();
  }, []);

  const fetchVideoCourses = async () => {
    try {
      const response = await fetch('/api/video-courses');
      const courses = await response.json();
      setVideoCourses(courses.filter((course: VideoCourse) => course.isPublished));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching video courses:', error);
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
  };

  const getProgressPercentage = (lessons: VideoLesson[]): number => {
    const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
    return lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
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

  if (selectedCourse && selectedLesson) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex flex-1">
            <div className="flex-1 px-12 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-4xl font-semibold text-blue-900 mb-2">
                    {selectedLesson.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {selectedCourse.title} • Урок {selectedLesson.order}
                  </p>
                </div>

                <VideoPlayer 
                  youtubeUrl={selectedLesson.youtubeUrl}
                  title={selectedLesson.title}
                  className="mb-8"
                />

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Теория
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: selectedLesson.theory }}
                  />
                </div>
              </div>
            </div>

            <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Содержание курса
              </h3>
              <div className="space-y-2">
                {selectedCourse.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                      selectedLesson.id === lesson.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lesson.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Play className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {lesson.order}. {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatDuration(lesson.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (selectedCourse) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col pt-8 min-h-screen bg-white">
          <BackToHomeButton />
          <div className="flex flex-1">
            <div className="flex-1 px-12 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-4xl font-semibold text-blue-900 mb-4">
                    {selectedCourse.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {selectedCourse.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(selectedCourse.estimatedDuration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{selectedCourse.lessons.length} уроков</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {selectedCourse.level}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Прогресс</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(getProgressPercentage(selectedCourse.lessons))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(selectedCourse.lessons)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {selectedCourse.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="text-left p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          ) : (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Play className="w-4 h-4 text-blue-600 ml-0.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-blue-900 mb-1">
                            {lesson.order}. {lesson.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDuration(lesson.duration)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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
              <h1 className="text-6xl font-semibold text-blue-900">
                Видеокурсы НУЕТ
              </h1>
              <p className="text-3xl font-light text-gray-900">
                Изучайте материалы в удобном формате видеоуроков
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col px-12 pt-16 items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container">
            {videoCourses.map((course) => (
              <div 
                key={course._id}
                onClick={() => setSelectedCourse(course)}
                className="group relative flex flex-col border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-white"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <Image 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    width={400}
                    height={225}
                  />
                </div>
                
                <h2 className="text-xl font-semibold text-blue-900 mb-2 group-hover:text-gray-700 transition-colors duration-300">
                  {course.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(course.estimatedDuration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{course.lessons.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">Прогресс</span>
                      <span className="text-xs text-gray-500">
                        {Math.round(getProgressPercentage(course.lessons))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(course.lessons)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {videoCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                Видеокурсы пока недоступны
              </h3>
              <p className="text-gray-400">
                Администратор еще не добавил видеокурсы
              </p>
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
