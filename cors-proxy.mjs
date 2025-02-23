import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.all('*', (req, res, next) => {
    console.log(`${req.method} request made to: ${req.url}`);
    next();
});

app.post('/proxy', async (req, res) => {
    const { url, body } = req.body;
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return res.status(response.status).json({ error: 'Failed to fetch from the target URL.' });
            }

            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Response is not JSON:', text);
                return res.status(500).json({ error: 'Response is not in JSON format.' });
            }

            return res.json(data);
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            attempt++;
            if (attempt === maxRetries) {
                return res.status(500).json({ error: 'An error occurred while processing the request after multiple attempts.' });
            }
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
        }
    }
});

app.listen(port, () => {
    console.log(`CORS proxy server is running on port ${port}`);
});
