import { useEffect, useState } from 'react';
import { getSketchMindFeedbacks, deleteSketchMindFeedback } from '../services/api';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function AdminSketchMindFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const data = await getSketchMindFeedbacks();
    setFeedbacks(data || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await deleteSketchMindFeedback(id);
      toast.success('✅ Feedback deleted');
      fetchFeedbacks();
    } catch (err) {
      toast.error('❌ Delete failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        💡 SketchMind Feedbacks
      </h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500">No feedbacks found.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                <div className="flex-1 space-y-2">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    📝 {fb.feedback || 'No written feedback'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submitted {dayjs(fb.createdAt).fromNow()}
                  </p>

                  {fb.voiceNoteUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Voice Note:</p>
                      <audio controls src={fb.voiceNoteUrl} className="w-full max-w-sm rounded" />
                    </div>
                  )}

                  {fb.sketchImageUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Sketch Image:</p>
                      <img
                        src={fb.sketchImageUrl}
                        alt="Sketch Feedback"
                        className="w-full max-w-sm rounded border border-gray-300 shadow"
                      />
                    </div>
                  )}


                </div>

                <button
                  onClick={() => handleDelete(fb._id)}
                  className="text-red-500 hover:text-red-700 transition transform hover:scale-110 mt-4 sm:mt-0"
                  title="Delete Feedback"
                >
                  <FaTrash className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
