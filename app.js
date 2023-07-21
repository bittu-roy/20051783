const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9000;

app.use(express.json());

// Define the /numbers endpoint
app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is missing.' });
  }

  try {
    const urls = Array.isArray(url) ? url : [url];
    const responses = await Promise.allSettled(
      urls.map((url) => axios.get(url))
    );

    const numbers = [];
    responses.forEach((response) => {
      if (response.status === 'fulfilled') {
        const data = response.value.data;
        numbers.push(...data.numbers);
      }
    });

    const mergedNumbers = [...new Set(numbers)].sort((a, b) => a - b);
    return res.json({ numbers: mergedNumbers });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch data from URLs.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});