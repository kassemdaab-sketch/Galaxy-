const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// This tells the server to look in your main folder for the files
app.use(express.static(__dirname));

// This is the CRITICAL part that fixes "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// The Proxy Engine for the black screen fix
app.use('/service', (req, res, next) => {
    const target = req.query.url;
    if (!target) return res.status(400).send("No target URL provided.");

    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        onProxyRes: (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
        },
    })(req, res, next);
});

app.listen(PORT, () => console.log(`Galaxy Pro Active`));
