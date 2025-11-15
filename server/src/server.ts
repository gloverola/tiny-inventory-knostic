import { config } from 'dotenv';
import { createApp } from './app.js';

// Load environment variables
config();

const app = createApp();

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    app.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();