import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { subscribeToNewsletter } from '../services/api';
import { motion } from 'framer-motion';
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
} from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const isValid = /\S+@\S+\.\S+/.test(email);
    if (!isValid) return toast.warn('Please enter a valid email address.');

    try {
      setLoading(true);
      await subscribeToNewsletter({ email });
      toast.success('✅ Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error('❌ Already subscribed or invalid email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.footer
      className="bg-[#0f172a] text-gray-300 px-6 pt-20 pb-10 mt-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-sm">
        {/* About */}
        <div>
          <h4 className="font-semibold text-xl text-white mb-4">About</h4>
          <ul className="space-y-2">
            {['/about', '/team', '/newsroom', '/careers'].map((path, idx) => (
              <li key={idx}>
                <Link to={path} className="hover:text-amber-400 transition duration-300 ease-in-out block">
                  {path.replace('/', '').replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-xl text-white mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><Link to="/blog" className="hover:text-amber-400 transition">Blog</Link></li>
            <li><Link to="/case-studies" className="hover:text-amber-400 transition">Case Studies</Link></li>
            <li><Link to="/webinars" className="hover:text-amber-400 transition">Webinars</Link></li>
            <li><Link to="/academy" className="hover:text-amber-400 transition">Academy</Link></li>
          </ul>
        </div>

        {/* Tools */}
        <div>
          <h4 className="font-semibold text-xl text-white mb-4">Free Tools</h4>
          <ul className="space-y-2">
            <li><Link to="/ai-caption-generator" className="hover:text-amber-400 transition">AI Caption Generator</Link></li>
            <li><Link to="/mockup-generator" className="hover:text-amber-400 transition">Mockup Generator</Link></li>
            <li><Link to="/seo-tool" className="hover:text-amber-400 transition">SEO Optimizer</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-xl text-white mb-4">Subscribe to Newsletter</h4>
          <p className="text-gray-400 mb-3 text-sm">Design insights, updates & inspiration directly to your inbox.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md text-black w-full focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-md disabled:opacity-60 transition"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-8"></div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
        <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} DesignCraft. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          {[FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaPinterest].map((Icon, idx) => (
            <Icon
              key={idx}
              className="hover:text-amber-400 transition transform hover:scale-110 cursor-pointer text-lg"
            />
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
