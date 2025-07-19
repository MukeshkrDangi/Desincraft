import { Link } from 'react-router-dom';
import { FaTools, FaChalkboardTeacher, FaBookOpen, FaCubes } from 'react-icons/fa';
import BannerSlider from '../components/BannerSlider';

export default function Home() {
  return (
    <div className="font-sans text-gray-800 bg-white dark:bg-gray-900">
      {/* ✅ Hero Slider */}
      <div className="relative z-0">
        <BannerSlider />
      </div>

      {/* ✅ Main Content (Scrolls over banner) */}
      <div className="relative z-10 -mt-4">
        {/* ✅ Creative Services Intro */}
        <section className="py-12 px-4 text-center bg-gray-50 dark:bg-gray-800">
          <h2 className="text-3xl font-bold mb-4 hover:text-blue-700 transition">
            Explore Our Creative Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Posters, Logos, Branding, Social Media Kits — All in one platform.
          </p>
        </section>

        {/* ✅ AI Tools Overview */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: FaTools, label: 'AI Tools' },
              { icon: FaCubes, label: 'Mockup Generator' },
              { icon: FaChalkboardTeacher, label: 'Webinars' },
              { icon: FaBookOpen, label: 'Design Resources' }
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 p-4 rounded-lg cursor-pointer"
              >
                <Icon size={36} className="mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition">{label}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ Dual Cards */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 gap-8">
            {/* 👉 Features Card */}
            <div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-2xl transition transform hover:scale-105 duration-300"
              data-aos="fade-right"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2920/2920058.png"
                alt="Features"
                className="w-20 h-20 mb-4 mx-auto"
              />
              <h3 className="text-xl font-bold text-center mb-2 hover:text-blue-700 transition">
                Features
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                Unlock pro features to streamline your design business.
              </p>
              <Link
                to="/features"
                className="block text-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Explore Features →
              </Link>
            </div>

            {/* 👉 Trends Card */}
            <div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-2xl transition transform hover:scale-105 duration-300"
              data-aos="fade-left"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3597/3597130.png"
                alt="Trends"
                className="w-20 h-20 mb-4 mx-auto"
              />
              <h3 className="text-xl font-bold text-center mb-2 hover:text-blue-700 transition">
                Design Trends 2024
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                Stay ahead with the latest design movements, tools, and tech.
              </p>
              <Link
                to="/blog"
                className="block text-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </section>

        {/* ✅ Call to Action */}
        <section className="bg-white dark:bg-gray-900 py-16 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4 hover:text-blue-700 transition">
            Ready to Boost Your Brand?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Place an order now and start your design journey with us.
          </p>
          <Link
            to="/order"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 hover:scale-105 transition transform duration-300"
          >
            Place Order
          </Link>
        </section>
      </div>
    </div>
  );
}
