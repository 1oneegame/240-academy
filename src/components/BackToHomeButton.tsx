"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackToHomeButtonProps {
  className?: string;
}

export function BackToHomeButton({ className = "" }: BackToHomeButtonProps) {
  const router = useRouter();

  return (
    <button 
      className={`cursor-pointer w-fit flex flex-row gap-x-1 text-gray-600 hover:text-blue-900 transition-colors duration-300 p-4 items-center ml-12 ${className}`} 
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-6 h-6" />
      <span className="text-lg font-xl">
        Вернуться назад
      </span>
    </button>
  );
}
