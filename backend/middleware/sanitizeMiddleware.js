const sanitizeHtml = require('sanitize-html');

const sanitize = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'string') {
        obj[k] = sanitizeHtml(obj[k], {
          allowedTags: [],
          allowedAttributes: {},
        });
      } else if (obj[k] !== null && typeof obj[k] === 'object') {
        sanitize(obj[k]);
      }
    }
  }
};

exports.sanitizeMiddleware = () => {
  return (req, res, next) => {
    if (req.body) {
      sanitize(req.body);
    }

    if (req.params) {
      sanitize(req.params);
    }

    if (req.query) {
      sanitize(req.query);
    }

    next();
  };
};
