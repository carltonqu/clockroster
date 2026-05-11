"use client"

import { useEffect, useState } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  moveX: number
  moveY: number
}

export function StarBackground() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Generate random stars - approximately 10% coverage
    const generateStars = () => {
      const starCount = 150
      const newStars: Star[] = []

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          duration: Math.random() * 10 + 15, // 15-25 seconds for slow movement
          delay: Math.random() * 5,
          moveX: (Math.random() - 0.5) * 20, // Move -10% to +10%
          moveY: (Math.random() - 0.5) * 20, // Move -10% to +10%
        })
      }
      setStars(newStars)
    }

    generateStars()
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `float ${star.duration}s ease-in-out ${star.delay}s infinite, twinkle ${star.duration / 3}s ease-in-out ${star.delay}s infinite`,
            "--move-x": `${star.moveX}%`,
            "--move-y": `${star.moveY}%`,
          } as React.CSSProperties}
        />
      ))}
      
      {/* CSS for floating and twinkling animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(var(--move-x), var(--move-y));
          }
          50% {
            transform: translate(calc(var(--move-x) * -0.5), calc(var(--move-y) * -0.5));
          }
          75% {
            transform: translate(calc(var(--move-x) * 0.5), calc(var(--move-y) * -0.5));
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  )
}
