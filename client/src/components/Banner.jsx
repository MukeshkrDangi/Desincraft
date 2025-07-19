import { useState, useEffect } from 'react';

const slides = [
  {
    title: '🎨 Empowering Creative Designers',
    subtitle: 'AI-powered tools, mockups, and smart workflows for all your needs.',
    bg: 'bg-gradient-to-r from-blue-600 to-purple-600'
  },
  {
    title: '🚀 Launch Your Brand with Impact',
    subtitle: 'Beautiful designs, fast delivery, and AI assistance — all in one place.',
    bg: 'bg-gradient-to-r from-purple-600 to-pink-600'
  },
  {
    title: '💡 Design Smarter, Not Harder',
    subtitle: 'Discover cutting-edge tools and trends for digital creators.',
    bg: 'bg-gradient-to-r from-blue-800 to-indigo-600'
  }
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);

  // Rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { title, subtitle, bg } = slides[index];

  return (
    <div className={`transition-all duration-1000 text-white py-24 md:py-32 px-6 text-center ${bg}`}>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade">{title}</h1>
      <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fade">{subtitle}</p>
    </div>
  );
}
