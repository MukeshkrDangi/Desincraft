import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <header className="sticky top-0 bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">DesignCraft</h1>
          <nav className="space-x-6 text-gray-700 font-medium">
            <Link to="/">Home</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login" className="text-blue-600">Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          All your creative services in one place
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          Upload portfolios, manage services, and handle client orders with ease on DesignCraft.
        </p>
        <Link to="/order" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold mb-10 text-center">Top Features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Upload Portfolios', desc: 'Showcase your work with custom uploads.' },
            { title: 'Manage Services', desc: 'Add and edit your design offerings easily.' },
            { title: 'Track Orders', desc: 'Stay updated with all client requests.' },
            { title: 'Client Dashboard', desc: 'Let users see their orders and feedback.' },
            { title: 'Admin Tools', desc: 'Powerful tools to manage your business.' },
            { title: 'Instant Feedback', desc: 'Voice feedback system with uploads.' },
          ].map((item) => (
            <div key={item.title} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition">
              <h4 className="text-lg font-semibold text-blue-700">{item.title}</h4>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Boost Your Brand?</h2>
        <p className="text-gray-600 mb-6">Place an order now and get started with the perfect design.</p>
        <Link to="/order" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Place Order
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-3">About</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>Company</li>
              <li>Careers</li>
              <li>Team</li>
              <li>Terms</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>Help Center</li>
              <li>Contact</li>
              <li>Live Chat</li>
              <li>Status</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Features</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>Portfolio</li>
              <li>Services</li>
              <li>Orders</li>
              <li>Admin Tools</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Follow Us</h4>
            <div className="flex gap-4 text-xl text-gray-400">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-youtube"></i>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-8">© 2025 DesignCraft. All rights reserved.</p>
      </footer>
    </div>
  );
}
