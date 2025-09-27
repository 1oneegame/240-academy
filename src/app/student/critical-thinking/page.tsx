"use client";

import { ProtectedRoute } from '@/components/protected-route';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { Eye, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CriticalThinkingPage() {
  const router = useRouter();
  
  const testSections = [
    {
      title: 'Раздел 1',
      tests: [
        { year: '2021', filename: '658267-past-paper-tsa-oxford-2021-section-1.pdf', questions: 50, time: '90 мин' },
        { year: '2020', filename: '616960-past-paper-tsa-oxford-2020-section-1.pdf', questions: 50, time: '90 мин' },
        { year: '2019', filename: '2019.pdf', questions: 50, time: '90 мин' },
        { year: '2018', filename: '2018 TSA S1.pdf', questions: 50, time: '90 мин' },
        { year: '2017', filename: '2017.pdf', questions: 50, time: '90 мин' },
        { year: '2016', filename: '2016.pdf', questions: 50, time: '90 мин' },
        { year: '2015', filename: '2015.pdf', questions: 50, time: '90 мин' },
        { year: '2014', filename: '2014.pdf', questions: 50, time: '90 мин' },
        { year: '2013', filename: '2013.pdf', questions: 50, time: '90 мин' },
        { year: '2012', filename: '2012.pdf', questions: 50, time: '90 мин' },
        { year: '2011', filename: '2011.pdf', questions: 50, time: '90 мин' },
        { year: '2010', filename: '2010.pdf', questions: 50, time: '90 мин' },
        { year: '2009', filename: '2009.pdf', questions: 50, time: '90 мин' },
        { year: '2008', filename: '2008.pdf', questions: 50, time: '90 мин' }
      ]
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col pt-8 min-h-screen bg-white">
        <BackToHomeButton />
        
        <section className="flex flex-col border-b border-gray-200 pb-8">
          <div className="pl-12 pr-6">
            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-semibold text-blue-900">
                Критическое мышление
              </h1>
              <p className="text-3xl font-light text-gray-900">
                Развитие навыков критического мышления для подготовки к НУЕТ
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col px-12 pt-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {testSections.map((section, index) => 
                section.tests.map((test, testIndex) => (
                  <div 
                    key={`${index}-${testIndex}`}
                    onClick={() => {
                      const testUrl = `/student/critical-thinking/test?title=${encodeURIComponent(`${section.title} - ${test.year}`)}&pdf=${encodeURIComponent(`/tests/critical-thinking/section-1/${test.filename}`)}&year=${test.year}`;
                      router.push(testUrl);
                    }}
                    className="group relative bg-white border-l-4 border-l-blue-800 rounded-r-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                            TSA {test.year}
                          </h3>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {test.questions} вопросов
                            </span>
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              {test.time}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm group-hover:text-blue-900 transition-colors">
                          <Play className="w-4 h-4" />
                          <span>Начать</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        Тест по критическому мышлению для подготовки к НУЕТ
                      </p>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-800 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>


      </div>
    </ProtectedRoute>
  );
}
