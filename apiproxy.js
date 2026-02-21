const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
    const target = req.query.url;
    if (!target) return res.status(400).send('Target URL required.');

    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        followRedirects: true,
        onProxyRes: (proxyRes) => {
            // This kills the security headers causing the black screen
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['frame-options'];
        }
    })(req, res);
};
