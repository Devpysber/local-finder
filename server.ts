import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import apiRoutes from './server/routes/index.js';
import { errorHandler } from './server/middlewares/errorHandler.js';
import { requestLogger } from './server/middlewares/logger.js';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Security & Utility Middlewares
  app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP for Vite dev server
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging Middleware
  app.use(requestLogger);

  // API Routes
  app.use('/api', apiRoutes);

  // Centralized Error Handling for API
  app.use(errorHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
