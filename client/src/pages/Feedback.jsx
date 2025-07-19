// client/src/pages/Feedback.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submitFeedback } from '../services/api';

export default function Feedback() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState('');
  const [voiceNote, setVoiceNote] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 180) {
            stopRecording();
            toast.warning("⏹️ Max recording limit reached (3 minutes)");
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, stopRecording]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], 'voice-note.webm', { type: 'audio/webm' });

        if (file.size > 5 * 1024 * 1024) {
          toast.error('❌ Voice note exceeds 5MB limit');
          return;
        }

        setVoiceNote(file);
        setTimer(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('❌ Microphone access denied or error');
    }
  };

  const removeVoiceNote = () => {
    setVoiceNote(null);
    setTimer(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback && !voiceNote) {
      toast.error('❌ Please provide feedback or voice note');
      return;
    }

    try {
      setSubmitting(true);
      await submitFeedback(orderId, { feedback, voiceNote });
      toast.success('✅ Feedback submitted!');
      navigate('/my-orders');
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      toast.error('❌ Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📝 Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Feedback */}
        <div>
          <label className="block font-semibold mb-2">Your Feedback</label>
          <textarea
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
          ></textarea>
        </div>

        {/* Voice Note */}
        <div>
          <label className="block font-semibold mb-2">Voice Note (optional)</label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                ⏹ Stop ({formatTime(timer)})
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                🎙 Start Recording
              </button>
            )}

            {voiceNote && (
              <div className="w-full">
                <audio controls className="w-full mt-2">
                  <source src={URL.createObjectURL(voiceNote)} type={voiceNote.type} />
                </audio>
                <button
                  onClick={removeVoiceNote}
                  type="button"
                  className="text-sm text-red-500 underline mt-1"
                >
                  ❌ Remove Voice Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full sm:w-auto transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
