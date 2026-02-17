const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. FIX: Serve static files from the current folder (css, js, etc.)
app.use(express.static(__dirname));

// 2. ENGINE: The Proxy route to bypass "Black Screen" blocks
app.use('/service', (req, res, next) => {
    const target = req.query.url;
    if (!target) return res.status(400).send("No target URL provided.");

    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        followRedirects: true,
        onProxyRes: (proxyRes) => {
            // Removes the security headers that cause the black screen in iframes
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['frame-ancestors'];
        },
        onError: (err, req, res) => {
            res.status(500).send('Proxy Error: Galaxy Uplink failed.');
        }
    })(req, res, next);
});

// 3. ROUTE: Specifically serve index.html when someone visits the root "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Galaxy Pro Active on Port ${PORT}`));
