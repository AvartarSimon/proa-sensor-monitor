import { createApp } from './app';
let appInstance: any;

const startServer = async (): Promise<void> => {
  try {
    const app = createApp();
    await app.start();
    console.log('Server started successfully');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await appInstance?.stop?.();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await appInstance?.stop?.();
  process.exit(0);
});

startServer();
