const DELAY_MS = parseInt(process.env.DELAY_MS) || 300;

function delayMiddleware(req, res, next) {
  if (req.path === '/api/health') {
    return next();
  }

  const randomDelay = DELAY_MS + Math.floor(Math.random() * 201) - 100;
  const actualDelay = Math.max(0, randomDelay);

  setTimeout(next, actualDelay);
}

module.exports = delayMiddleware;

