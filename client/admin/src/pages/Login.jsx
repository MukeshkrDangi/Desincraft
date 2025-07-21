import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login({ email, password });
            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/admin');
            } else {
                setMessage('❌ Invalid email or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setMessage('❌ Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
            {message && <p className="mb-4 text-red-600">{message}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Sign In
                </button>
            </form>
        </div>
    );
}
