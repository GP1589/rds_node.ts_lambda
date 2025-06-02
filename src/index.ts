import { App } from './api/app';
import { config } from './infrastructure/config/environment';

const startServer = (): void => {
  const app = new App();
  const server = app.getApp();

  server.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`🗃️  DynamoDB Table: ${config.tableName}`);
    console.log(`🌍 AWS Region: ${config.awsRegion}`);
    
    console.log('\n📡 Available endpoints:');
    console.log('  GET    /health                    - Health check');
    console.log('  POST   /users/create              - Create user');
    console.log('  GET    /users/getAll              - Get all users');
    console.log("  GET    /users/getById/:userId     - Get user by ID");
    console.log("  PUT    /users/update/:userId      - Update user");
    console.log("  DELETE /users/delete/:userId      - Delete user");
  });
};

startServer();