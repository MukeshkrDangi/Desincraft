import { useEffect, useState } from 'react';
import { fetchBanners } from '../services/api';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchBanners();
        setBanners(data.banners || []);
      } catch (err) {
        console.error('❌ Failed to load banners:', err);
      }
    };
    loadBanners();
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setGradientPos({ x, y });
  };

  if (!banners.length) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
          transitionTime={600}
          swipeable
          emulateTouch
        >
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="relative group overflow-hidden rounded-xl shadow-xl"
              onMouseMove={handleMouseMove}
            >
              {/* Banner Image */}
              <img
                src={`http://localhost:5050${banner.imageUrl}`}
                alt={banner.title}
                className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40 backdrop-blur-[2px] z-10">

                {/* Title */}
                <h2
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent transition-transform duration-500 group-hover:scale-105 leading-tight relative z-20"
                  style={{
                    backgroundImage: `radial-gradient(at ${gradientPos.x}% ${gradientPos.y}%, #facc15, #f97316, #ef4444, #ec4899)`,
                    textShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  }}
                >
                  {banner.title}
                  <span className="absolute -inset-1 rounded-xl bg-white/10 blur-lg opacity-30 -z-10"></span>
                </h2>

                {/* Subtitle */}
                <p
                  className="mt-5 px-6 py-3 sm:px-8 sm:py-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-wide font-bitcount bg-clip-text text-transparent transition-all duration-700 ease-in-out group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #ffffff, #38bdf8, #f472b6)`, // white, sky-blue, pink
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '1px 1px 6px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundImage = `linear-gradient(135deg, #f472b6, #60a5fa, #ffffff)`; // on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundImage = `linear-gradient(135deg, #ffffff, #38bdf8, #f472b6)`; // back to original
                  }}
                >
                  {banner.subtitle}
                </p>

              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
