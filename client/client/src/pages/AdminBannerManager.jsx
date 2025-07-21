import { useEffect, useState } from 'react';
import { uploadBanner, fetchBanners, deleteBanner } from '../services/api';

export default function AdminBannerManager() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    const data = await fetchBanners();
    setBanners(data.banners || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !title) return alert("Title and image are required!");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('image', image);

    try {
      await uploadBanner(formData);
      setTitle('');
      setSubtitle('');
      setImage(null);
      e.target.reset(); // Reset file input UI
      loadBanners();
    } catch (error) {
      console.error('❌ Error uploading banner:', error);
      alert('Failed to upload banner.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await deleteBanner(id);
        loadBanners();
      } catch (err) {
        console.error('❌ Delete error:', err);
        alert('Failed to delete banner.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📸 Manage Banners</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Banner Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Upload Banner
        </button>
      </form>

      {loading ? (
        <p>Loading banners...</p>
      ) : banners.length === 0 ? (
        <p className="text-gray-500">No banners uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b._id} className="border rounded shadow p-2">
              <img
                src={`http://localhost:5050${b.imageUrl}`}
                alt={b.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="font-semibold mt-2">{b.title}</h2>
              <p className="text-sm text-gray-600">{b.subtitle}</p>
              <button
                onClick={() => handleDelete(b._id)}
                className="mt-2 text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
