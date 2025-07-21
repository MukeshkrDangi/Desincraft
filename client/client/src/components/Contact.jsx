import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback('✅ Thank you for reaching out! We will contact you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white bg-opacity-80 shadow-glass backdrop-blur-md p-8 rounded-4xl"
      >
        <h2 className="text-4xl font-display font-bold text-primary text-center mb-6">📬 Get in Touch</h2>

        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-center mb-4"
          >
            {feedback}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Message</label>
            <textarea
              placeholder="Your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-secondary text-white font-semibold rounded-full shadow transition"
            >
              Send Message
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
