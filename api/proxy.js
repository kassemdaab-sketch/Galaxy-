const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
    const target = req.query.url;
    
    if (!target) {
        return res.status(400).send('Error: No target URL provided.');
    }

    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        followRedirects: true,
        // This logic removes the "Black Screen" security headers
        onProxyRes: (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['frame-options'];
        },
        onError: (err, req, res) => {
            res.status(500).send('Proxy Error: Galaxy could not reach this site.');
        }
    })(req, res);
};
