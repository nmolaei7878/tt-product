function errorHandler(err, req, res, next) {
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] [ERROR] ${req.method} ${req.path}`);
  console.error(`[${timestamp}] [ERROR] ${err.stack || err.message || err}`);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid JSON format in request body',
      timestamp
    });
  }

  if (err.status === 400) {
    return res.status(400).json({
      error: err.message || 'Bad Request',
      timestamp
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp
  });
}

module.exports = errorHandler;

