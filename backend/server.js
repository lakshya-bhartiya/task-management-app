require('dotenv').config();
const app = require('./app');
const connectDB = require('./db');
const { updateOverdueTasks } = require('./api/helper/cronJobs');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start Cron Jobs
updateOverdueTasks.start();
console.log('⏰ Cron job started: Overdue tasks check');

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});