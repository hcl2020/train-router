const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', function(req, res, next) {
    let reqOrigin = req.get('Origin') || '*';
    let reqMethod = req.get('Access-Control-Request-Method') || 'GET, POST, PUT, DELETE, OPTIONS';
    let reqHeaders = req.get('Access-Control-Request-Headers') || 'Origin, X-Requested-With, Content-Type';

    // 'Access-Control-Allow-Credentials': 'true', // 是否允许Cookie
    res.header('Access-Control-Allow-Origin', reqOrigin);
    res.header('Access-Control-Allow-Headers', reqHeaders);
    res.header('Access-Control-Allow-Methods', reqMethod);

    next();
  });

  const proxyConfig = {
    target: 'https://kyfw.12306.cn/otn',
    changeOrigin: true, // needed for virtual hosted sites
    hostRewrite: true,
    autoRewrite: true,
    followRedirects: true,
    ws: true, // proxy websockets
    pathRewrite: function(path, req) {
      console.log(`\n${req && req.get('Referer')}\t请求\t${path}`);
      path = path.replace(/^\/api/, '');
      console.log(`\n${req && req.get('Referer')}\t请求\t${path}`);
      return path;
    },

    onProxyReq(proxyReq, req, res) {
      let { headers } = req;
      console.error({ headers }, proxyReq.headers);
    }
  };
  app.use('/api', proxy(proxyConfig));
};
