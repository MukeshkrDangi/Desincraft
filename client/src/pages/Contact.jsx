import { useState, useEffect, useRef } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const bgRef = useRef(null);

  useEffect(() => {
    document.title = "📞 Contact Us - DesignCraft";
  }, []);

  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      if (bgRef.current) {
        bgRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(59,130,246,0.4), rgba(168,85,247,0.6))`;
      }
    };

    // Ensure body is transparent
    document.body.style.backgroundColor = "transparent";

    if (bgRef.current) {
      bgRef.current.style.background = `radial-gradient(circle at 50% 50%, rgba(59,130,246,0.4), rgba(168,85,247,0.6))`;
    }

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, message });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 🔥 Animated gradient background */}
      <div
        ref={bgRef}
        className="fixed inset-0 h-full w-full -z-10 pointer-events-none transition-all duration-300"
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 sm:p-10 transition-all">
          <h1 className="text-4xl font-bold text-center text-blue-800 dark:text-blue-300 mb-8">
            📬 Contact Us
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-gray-800 dark:text-white">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg text-lg font-semibold transition-transform hover:scale-105 shadow-lg"
            >
              🚀 Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
