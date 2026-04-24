"use client";

import { Clock } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-bounce-delayed {
          animation: bounce 1s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
      
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 animate-spin-slow" />
        
        {/* Inner pulsing circle with icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center animate-pulse-slow shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '4s' }}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full" />
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-3 bg-blue-300 rounded-full" />
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-cyan-300 rounded-full" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white animate-bounce-delayed">
          Loading...
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          ClockRoster
        </p>
        <div className="flex gap-1 justify-center mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
