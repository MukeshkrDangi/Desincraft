// client/src/pages/UnsubscribeSuccess.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function UnsubscribeSuccess() {
  const [status, setStatus] = useState('loading');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return setStatus('invalid');

    const unsubscribe = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/newsletter/unsubscribe/${token}`);
        if (res.status === 200) {
          setStatus('success');
        } else {
          setStatus('invalid');
        }
      } catch (error) {
        setStatus('invalid');
      }
    };

    unsubscribe();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded text-center">
        {status === 'loading' && <p>⏳ Validating unsubscribe link...</p>}
        {status === 'success' && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">✅ You’re Unsubscribed</h2>
            <p>You’ll no longer receive emails from DesignCraft. Thanks!</p>
          </>
        )}
        {status === 'invalid' && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-2">❌ Invalid or Expired Link</h2>
            <p>This unsubscribe link is no longer valid or has already been used.</p>
          </>
        )}
      </div>
    </div>
  );
}
