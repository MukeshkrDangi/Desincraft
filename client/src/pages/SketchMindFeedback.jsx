import { useRef, useState } from 'react';
import { submitSketchMindFeedback } from '../services/api';
import { FaMicrophone, FaStop, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function SketchMindFeedback() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
    }
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1E40AF';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);
    } catch (error) {
      toast.error('🎤 Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    recorder?.stop();
    setRecording(false);
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;

    setSubmitting(true);
    setSubmitted(false);

    canvas.toBlob(async (blob) => {
      if (!audioBlob && !blob) {
        toast.error('❌ Please draw something or record a voice note before submitting.');
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('feedback', projectId || 'SketchMind Feedback');

      if (audioBlob) {
        formData.append('voiceNote', audioBlob, 'feedback.webm');
      }

      if (blob) {
        formData.append('image', blob, 'sketch.png');
      }

      try {
        await submitSketchMindFeedback(formData);
        toast.success('✅ Feedback submitted successfully!');
        setPreviewUrl(blob ? URL.createObjectURL(blob) : '');
        setSubmitted(true);

        // Reset state after submission
        setProjectId('');
        setAudioBlob(null);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } catch (err) {
        console.error('❌ Submission failed:', err);
        toast.error('Submission failed. Try again.');
      } finally {
        setSubmitting(false);
      }
    }, 'image/png');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 dark:text-blue-400 animate-fade-in-up">
          ✏️ Sketch Your Feedback
        </h1>

        {/* Canvas */}
        <div className="w-full rounded-xl overflow-hidden border-2 border-blue-300 dark:border-gray-600 shadow-md">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-auto bg-white dark:bg-gray-800 rounded-xl cursor-crosshair touch-none"
          />
        </div>

        {/* Voice Recorder */}
        <div className="flex justify-center gap-4 flex-wrap">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              <FaMicrophone className="animate-pulse" /> Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              <FaStop /> Stop
            </button>
          )}
        </div>

        {/* Project ID */}
        <div className="text-center">
          <input
            type="text"
            placeholder="Project ID (optional)"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full sm:w-2/3 lg:w-1/2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`${
              submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            } bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg font-bold tracking-wide mt-4 transition transform`}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>

        {/* Preview */}
        {submitted && (
          <div className="text-center space-y-4 mt-8 animate-fade-in-up">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto animate-bounce" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Feedback Submitted!</h2>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Sketch Preview"
                className="rounded-lg shadow-md mx-auto w-full max-w-md border border-blue-300"
              />
            )}
            {audioBlob && (
              <audio controls className="mt-4 mx-auto w-full max-w-sm">
                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
              </audio>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
