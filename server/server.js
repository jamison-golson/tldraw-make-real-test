// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Increased payload size limits for the base64 string coming from the frontend (tldraw)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

app.post('/api/claude', async (req, res) => {
  try {
    // Add logging to debug request payload
    console.log('Received request body size:', JSON.stringify(req.body).length);
    console.log('Received request body:', JSON.stringify(req.body, null, 2)); // Full request body log for debugging

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

// OpenAI endpoint
app.post('/api/openai', async (req, res) => {
  try {
    console.log('Received OpenAI request body size:', JSON.stringify(req.body).length);
    console.log('Received OpenAI request body:', JSON.stringify(req.body, null, 2));

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('OpenAI Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to process OpenAI request',
      message: error.message
    });
  }
});

// Gemini endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    console.log('Received Gemini request body size:', JSON.stringify(req.body).length);
    console.log('Received Gemini request body:', JSON.stringify(req.body, null, 2));

    const response = await axios.post(
      'https://api.gemini.com/v1/messages',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Gemini Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to process Gemini request',
      message: error.message
    });
  }
});

// Ollama endpoint
app.post('/api/ollama', async (req, res) => {
  try {
    console.log('Received Ollama request body size:', JSON.stringify(req.body).length);
    console.log('Received Ollama request body:', JSON.stringify(req.body, null, 2));

    const response = await axios.post(
      'https://api.ollama.com/v1/messages',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Ollama Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to process Ollama request',
      message: error.message
    });
  }
});

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
