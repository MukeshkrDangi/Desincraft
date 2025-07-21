// client/src/pages/CouponManager.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CouponManager() {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/api/coupons');
      setCoupons(res.data);
    } catch (err) {
      toast.error('Failed to load coupons');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/coupons', { code, discount, expiresAt });
      toast.success('✅ Coupon created!');
      setCode('');
      setDiscount('');
      setExpiresAt('');
      fetchCoupons();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create coupon. Please check all fields.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/coupons/${id}`);
      toast.success('🗑️ Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Coupon Manager</h2>

      <form onSubmit={handleCreate} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Coupon Code (e.g. SAVE10)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          min="1"
          max="100"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Coupon
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Existing Coupons</h3>
      <ul className="space-y-2">
        {coupons.map((coupon) => (
          <li key={coupon._id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <strong>{coupon.code}</strong> - {coupon.discount}% off (expires: {coupon.expiresAt.slice(0, 10)})
            </div>
            <button
              onClick={() => handleDelete(coupon._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
