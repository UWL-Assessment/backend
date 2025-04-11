const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const app = require('./app.js');

dotenv.config();
connectDB();


process.on('uncaughtException', (error) => {
  console.log(error.message);
  console.log('Shutting down due to uncaught exception.');
  process.exit(1);
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}