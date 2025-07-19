import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminCouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discount: '', expiresAt: '' });

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/api/coupons');
      setCoupons(res.data);
    } catch (err) {
      toast.error('Failed to fetch coupons');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/coupons', form);
      toast.success('Coupon created');
      setForm({ code: '', discount: '', expiresAt: '' });
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🎟️ Manage Coupons</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={form.code}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={form.discount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="expiresAt"
          value={form.expiresAt}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Coupon
        </button>
      </form>

      <ul className="space-y-2">
        {coupons.map((coupon) => (
          <li key={coupon._id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <strong>{coupon.code}</strong> - {coupon.discount}% (Expires: {coupon.expiresAt.slice(0, 10)})
            </div>
            <button
              onClick={() => handleDelete(coupon._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
