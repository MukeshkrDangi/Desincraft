// server/controllers/imageController.js
const axios = require('axios');

const removeBackground = async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: "b9a2e17a5084c3b76f0a54e5267bade9dfc2c4c9631ec298d7f4b52fc18c9b00", // Background Remover
        input: { image: imageUrl },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ result: response.data });
  } catch (error) {
    console.error('❌ AI API Error:', error.response?.data || error.message);
    res.status(500).json({ message: '❌ Background removal failed', error: error.message });
  }
};

module.exports = { removeBackground };
