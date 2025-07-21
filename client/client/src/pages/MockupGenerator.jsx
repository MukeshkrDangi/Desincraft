import { useState } from 'react';

const frameTypes = [
  { label: 'Business Card', value: 'business-card', image: '/mockups/business-card.jpg' },
  { label: 'Poster', value: 'poster', image: '/mockups/poster.jpg' },
  { label: 'Website', value: 'website', image: '/mockups/website.jpg' },
];

export default function MockupGenerator() {
  const [designImage, setDesignImage] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setDesignImage(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🧠 Instant Mockup Generator</h1>

      {/* Upload Section */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">1. Upload Your Design</label>
        <input type="file" accept="image/*" onChange={handleUpload} />
        {designImage && (
          <img src={designImage} alt="Uploaded" className="mt-4 h-40 object-contain border p-2" />
        )}
      </div>

      {/* Frame Options */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">2. Choose a Mockup Frame</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {frameTypes.map((frame) => (
            <button
              key={frame.value}
              onClick={() => setSelectedFrame(frame)}
              className={`border rounded-xl overflow-hidden hover:shadow-lg transition ${
                selectedFrame?.value === frame.value ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              <img src={frame.image} alt={frame.label} className="w-full h-40 object-cover" />
              <div className="p-2 text-center font-medium">{frame.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Final Preview */}
      {designImage && selectedFrame && (
        <div className="border-2 border-gray-300 mt-6 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Mockup Preview</h2>
          <div className="relative w-full max-w-3xl aspect-video mx-auto">
            <img src={selectedFrame.image} alt="Mockup Frame" className="w-full rounded-xl" />
            <img
              src={designImage}
              alt="Overlay"
              className="absolute top-1/3 left-1/3 w-1/3 opacity-90 mix-blend-multiply"
            />
          </div>
        </div>
      )}
    </div>
  );
}
