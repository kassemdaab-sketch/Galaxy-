const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Since your index.html is in the main folder, we serve from root
app.use(express.static(__dirname));

// The Proxy Engine: Bypasses "Black Screen" blocks by stripping security headers
app.use('/service', (req, res, next) => {
    const target = req.query.url;
    if (!target) return res.status(400).send("No target URL provided.");

    // Clean the target URL to ensure it's a valid string
    const targetUrl = decodeURIComponent(target);

    return createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        followRedirects: true,
        // This part is critical for fixing the black screen/frame blocks
        onProxyRes: (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['frame-options'];
        },
        // Error handling to prevent the server from crashing on bad URLs
        onError: (err, req, res) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Proxy Error: Could not connect to the target site.');
        }
    })(req, res, next);
});

app.listen(PORT, () => console.log(`Galaxy Pro Online on Port ${PORT}`));
