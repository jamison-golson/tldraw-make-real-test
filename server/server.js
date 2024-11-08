// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

app.post('/api/claude', async (req, res) => {
  try {
    // Add logging to debug request payload
    console.log('Received request body size:', JSON.stringify(req.body).length);

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to process request',
      message: error.message
    });
  }
});

//Add an OpenAI, Gemini, and ollama endpoints

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});