const ERROR_RATE = parseFloat(process.env.ERROR_RATE) || 0.05;

function errorSimulatorMiddleware(req, res, next) {
  if (req.path === '/api/health') {
    return next();
  }

  if (Math.random() < ERROR_RATE) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [ERROR] Simulated server error triggered for ${req.method} ${req.path}`);
    
    return res.status(500).json({
      error: 'Simulated server error',
      timestamp
    });
  }

  next();
}

module.exports = errorSimulatorMiddleware;

