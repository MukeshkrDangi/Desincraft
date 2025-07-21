import { useState, useEffect } from 'react';
import { fetchServices, fetchPortfolio } from '../services/api';
import AdminNavigation from '../components/AdminNavigation';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

export default function Dashboard() {
    const [servicesCount, setServicesCount] = useState(0);
    const [portfolioCount, setPortfolioCount] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const services = await fetchServices();
            const portfolios = await fetchPortfolio();

            setServicesCount(services.length);
            setPortfolioCount(portfolios.length);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const data = [
        { name: 'Services', value: servicesCount },
        { name: 'Portfolio', value: portfolioCount },
    ];

    const COLORS = ['#0088FE', '#00C49F'];

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <AdminNavigation />

            <h2 className="text-2xl font-semibold mb-4">Statistics Overview</h2>

            {/* Pie Chart */}
            <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Service vs Portfolio</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Total Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Growth Line (Sample Data)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
