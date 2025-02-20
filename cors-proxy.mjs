import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Log all incoming requests
app.all('*', (req, res, next) => {
    console.log(`${req.method} request made to: ${req.url}`);
    next();
});

app.post('/proxy', async (req, res) => {
    try {
        const { url, body } = req.body;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

app.listen(port, () => {
    console.log(`CORS proxy server is running on port ${port}`);
});
