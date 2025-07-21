// client/src/components/Upload.jsx

import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Upload() {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setMessage('❌ Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('image', image);

        try {
            await axios.post('http://localhost:5050/api/portfolio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setMessage('✅ Portfolio item uploaded successfully!');
            setTitle('');
            setDescription('');
            setCategory('');
            setImage(null);
        } catch (error) {
            console.error('Error uploading portfolio:', error);
            setMessage('❌ Failed to upload portfolio item.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel – Upload Portfolio</h1>

            {/* Admin Navigation */}
            <div className="flex gap-4 mb-6 justify-center">
                <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Upload Service
                </Link>
                <Link to="/upload" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
                    Upload Portfolio
                </Link>
            </div>

            {message && <p className="mb-4 text-center text-green-600">{message}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Portfolio Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <textarea
                    placeholder="Portfolio Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Portfolio Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Upload Portfolio
                </button>
            </form>
        </div>
    );
}
