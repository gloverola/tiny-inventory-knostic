import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import storesRoutes from './modules/stores/stores.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';

export function createApp() {
  const app = express();
  
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  if (isDevelopment) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    
    // Log response time
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    
    next();
  });

  // Register routes
  app.use('/stores', storesRoutes);
  app.use('/products', productsRoutes);
  app.use('/categories', categoriesRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    
    // Handle database errors
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A record with this value already exists',
      });
    }
    
    // Handle validation errors
    if (err.validation) {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message,
      });
    }
    
    // Default error response
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  return app;
}