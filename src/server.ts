import { createApp } from './app';
import { seedDatabase } from './seed/seed';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const app = await createApp();

  // Seed database with initial data
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://${process.env.HOST || 'localhost'}:${PORT}`);
    console.log(
      `API documentation available at http://${process.env.HOST || 'localhost'}:${PORT}/api-docs`
    );
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
