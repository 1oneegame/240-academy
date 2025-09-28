"use client";
import React from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface QuitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
}

export const QuitButton = React.forwardRef<HTMLButtonElement, QuitButtonProps>(
  ({ className, onClick, ...props }, ref) => {
    const router = useRouter();

    const handleSignOut = async () => {
      try {
        await signOut();
        router.push('/auth');
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      }
    };

    return (
      <button
        ref={ref}
        onClick={onClick || handleSignOut}
        className={cn(
          "group relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-red-500 bg-white hover:bg-red-500 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 cursor-pointer",
          className
        )}
        {...props}
      >
        <LogOut className="w-6 h-6 text-red-500 group-hover:text-white transition-colors duration-300" />
        
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
            Выйти
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>
    );
  }
);

QuitButton.displayName = "QuitButton";
