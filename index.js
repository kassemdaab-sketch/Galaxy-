const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the Galaxy Pro UI
app.use(express.static(path.join(__dirname, 'public')));

// The Proxy Engine: Bypasses "Black Screen" blocks
app.use('/service', (req, res, next) => {
    const target = req.query.url;
    if (!target) return res.status(400).send("No target URL provided.");

    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        followRedirects: true,
        onProxyRes: (proxyRes) => {
            // These lines delete the "Frame Blocks"
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['frame-options'];
        },
    })(req, res, next);
});

app.listen(PORT, () => console.log(`Galaxy Pro Online on Port ${PORT}`));
