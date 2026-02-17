const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// FIX: Tells Express to look in the main folder for index.html
app.use(express.static(__dirname));

// ENGINE: The Proxy route to bypass "Black Screen" blocks
app.use('/service', (req, res, next) => {
    const target = req.query.url;
    if (!target) return res.status(400).send("No target URL provided.");

    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        followRedirects: true,
        onProxyRes: (proxyRes) => {
            // These lines remove the security headers causing the black screen
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['frame-options'];
        },
        onError: (err, req, res) => {
            res.status(500).send('Proxy Error: Galaxy Uplink failed.');
        }
    })(req, res, next);
});

// ROUTE: Specifically serves your index.html at the root "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Galaxy Pro Active on Port ${PORT}`));
