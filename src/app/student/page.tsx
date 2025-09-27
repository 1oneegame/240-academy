"use client";
import { User } from "lucide-react";
import { QuitButton } from "@/components/QuitButton";
import { ProtectedRoute } from "@/components/protected-route";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function StudentPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const student = {
        name: session?.user?.name || "Пользователь",
        surname: (session?.user as any)?.surname || "",
        email: session?.user?.email || "user@example.com",
        phone: (session?.user as any)?.phone || "+7 (707) 123-4567",
    }
    const sections = [
        {
            title: 'НУЕТ Видеокурс',
            description: 'Полный курс подготовки к НУЕТ с видеолекциями',
            href: '/student/video-courses',
            icon: '🎥',
            color: 'blue'
        },
        {
            title: 'NUET Practice',
            description: 'Практические задания и тесты для подготовки',
            href: '/student/practice',
            icon: '📝',
            color: 'green'
        },
        {
            title: 'Critical Thinking Training',
            description: 'Развитие критического мышления',
            href: '/student/critical-thinking',
            icon: '🧠',
            color: 'purple'
        },
        {
            title: 'Полезные ресурсы',
            description: 'Дополнительные материалы и файлы для изучения',
            href: '/student/resources',
            icon: '📚',
            color: 'orange'
        }
    ]

  return (
    <ProtectedRoute>
      <div className="flex flex-col pt-8 min-h-screen bg-white">
        <BackToHomeButton />
        <section className="flex flex-col border-b border-gray-200 pb-8">
            <div className="flex justify-between flex-row pl-12 pr-6">
                <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-6xl font-semibold text-blue-900">Страница студента:</h1>
                        <p className="text-3xl font-light text-gray-900">Выберите раздел для изучения</p>
                    </div>
                </div>
                <div className="flex flex-row border border-gray-200 rounded-xl px-5 py-4 gap-x-2 h-fit my-auto">
                    <User 
                        className="w-14 h-14 text-blue-900 rounded-full border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => router.push('/student/profile')}
                    />
                    <div className="flex flex-col mr-1 cursor-pointer" onClick={() => router.push('/student/profile')}>
                        <h2 className="text-xl font-semibold text-blue-900 hover:text-blue-700 transition-colors">{student.name} {student.surname}</h2>
                        <p className="text-lg font-light text-gray-900">{student.email}</p>
                    </div>
                    <QuitButton
                        className="ml-1 my-auto"
                    />
                </div>      
            </div>
        </section>
        <section className="flex flex-col px-12 pt-16 items-center">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 container">
                {sections.map((section) => (
                    <div 
                        key={section.title} 
                        className={cn(
                            "group relative flex flex-col border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-white border-t-[6px]",
                            {
                                "border-t-blue-600": section.color === "blue",
                                "border-t-green-600": section.color === "green", 
                                "border-t-purple-600": section.color === "purple",
                                "border-t-orange-600": section.color === "orange"
                            }
                        )}
                        onClick={() => router.push(section.href)}
                    >
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                            {section.title}
                        </h2>
                        <p className="text-lg font-light text-gray-700 group-hover:text-gray-500 transition-colors duration-300">
                            {section.description}
                        </p>
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}