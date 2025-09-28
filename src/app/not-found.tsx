"use client";

import { useRouter } from 'next/navigation';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import Footer from '@/components/Footer';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="bg-white">
      <section className="flex flex-col items-center py-48 min-h-screen">
        <div className="flex flex-col gap-y-4 container max-w-3xl px-6 py-4">
          <h1 className="font-semibold text-6xl text-blue-900 text-center">404</h1>
          <h2 className="font-semibold text-4xl text-blue-900 text-center">Страница не найдена</h2>
          <p className="font-light text-3xl text-center text-gray-800">
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
            <br />
            Давайте вернемся к изучению и продолжим ваш путь к знаниям!
          </p>
        </div>
        <div className="flex flex-row gap-x-4 pt-4 items-center">
          <InteractiveHoverButton 
            className="border border-gray-200 px-6 py-3 shadow-sm rounded-xl text-blue-900 text-xl font-normal" 
            onClick={() => router.push("/")}
          >
            На главную
          </InteractiveHoverButton>
          <InteractiveHoverButton 
            className="border border-gray-200 px-6 py-3 shadow-sm rounded-xl text-blue-900 text-xl font-normal" 
            onClick={() => router.back()}
          >
            Назад
          </InteractiveHoverButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
