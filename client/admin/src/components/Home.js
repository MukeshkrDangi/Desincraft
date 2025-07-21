import { useEffect, useState } from 'react';
import { fetchServices, fetchPortfolio } from '../../services/api';

export default function Home() {
    const [services, setServices] = useState([]);
    const [portfolioItems, setPortfolioItems] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const servicesData = await fetchServices();
            const portfolioData = await fetchPortfolio();

            setServices(servicesData);
            setPortfolioItems(portfolioData);
        } catch (error) {
            console.error('Error loading public data:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen">
            <h1 className="text-4xl font-bold mb-10 text-center">Welcome to DesignCraft Portfolio</h1>

            {/* Services Section */}
            <h2 className="text-3xl font-semibold mb-6">Our Services</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mb-12">
                {services.length === 0 ? (
                    <p>No services available.</p>
                ) : (
                    services.map(service => (
                        <div key={service._id} className="border p-4 rounded shadow">
                            <img src={service.imageUrl} alt={service.title} className="w-full h-48 object-cover mb-4 rounded" />
                            <h3 className="text-xl font-bold">{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Portfolio Section */}
            <h2 className="text-3xl font-semibold mb-6">Our Portfolio</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {portfolioItems.length === 0 ? (
                    <p>No portfolio items available.</p>
                ) : (
                    portfolioItems.map(item => (
                        <div key={item._id} className="border p-4 rounded shadow">
                            {item.imageUrl.endsWith('.png') || item.imageUrl.endsWith('.jpg') || item.imageUrl.endsWith('.jpeg') || item.imageUrl.endsWith('.webp') || item.imageUrl.endsWith('.gif') ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover mb-4 rounded" />
                            ) : (
                                <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    📄 Download File
                                </a>
                            )}
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p>{item.description}</p>
                            <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
