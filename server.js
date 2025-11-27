import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.VITE_VIKUNJA_API_URL || 'https://vikunja.steeped.icu/api/v1';
const API_TOKEN = process.env.VITE_VIKUNJA_API_TOKEN;

console.log(`Starting server on port ${PORT}`);
console.log(`Proxying /api/v1 to ${API_URL}`);

if (API_TOKEN) {
    const tokenPreview = API_TOKEN.substring(0, 5) + '...';
    console.log(`API Token found in environment (Length: ${API_TOKEN.length}, Starts with: ${tokenPreview})`);
} else {
    console.warn('WARNING: No API Token found in environment! Requests will likely fail with 401.');
}

// Proxy API requests
app.use('/api/v1', createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1': '', // Remove /api/v1 prefix so /api/v1/foo -> target/foo
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url} -> ${API_URL}${proxyReq.path}`);

        // Add Authorization header if token is present in env
        if (API_TOKEN) {
            proxyReq.setHeader('Authorization', `Bearer ${API_TOKEN}`);
            console.log(`[Proxy] Injected Authorization header: Bearer ${API_TOKEN.substring(0, 5)}...`);
        } else {
            console.warn('[Proxy] No API Token available to inject');
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy] Response: ${proxyRes.statusCode} ${req.url}`);
        // Add CORS headers just in case
        res.header('Access-Control-Allow-Origin', '*');
    },
    onError: (err, req, res) => {
        console.error('[Proxy] Error:', err);
        res.status(500).send('Proxy Error');
    }
}));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Use app.use with a function to match all remaining requests without path parsing issues
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
