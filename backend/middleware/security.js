const helmet = require('helmet');
const hpp = require('hpp');

exports.securityMiddleware = (app) => {
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
      originAgentCluster: true,
    })
  );

  app.use(hpp());

  app.disable('x-powered-by');
};
