const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('neww', 'root', 'process.env.DATABASE', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3300,
  logging: false, // Set to console.log to see SQL queries

});

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error.message);
  }
})();


module.exports = sequelize;
