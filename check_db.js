const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function checkDatabase() {
  try {
    console.log('Connecting to database with credentials:');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Password:', process.env.DB_PASS ? '****' : 'not set');
    console.log('Database: cookai');

    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'cookai'
    });

    console.log('Connection pool created');

    // Check if we can connect
    const connection = await pool.getConnection();
    console.log('Successfully connected to database');

    // Check if the cookai database exists
    const [databases] = await connection.query('SHOW DATABASES');
    const cookaiExists = databases.some(db => db.Database === 'cookai');
    console.log('cookai database exists:', cookaiExists);

    if (cookaiExists) {
      // Check if the recipes table exists
      const [tables] = await connection.query('SHOW TABLES FROM cookai');
      console.log('Tables in cookai database:', tables.map(t => Object.values(t)[0]));

      // Check if the recipes table has data
      const [recipes] = await connection.query('SELECT COUNT(*) as count FROM cookai.recipes');
      console.log('Number of recipes:', recipes[0].count);

      // Check if the ingredients table exists and has data
      const [ingredients] = await connection.query('SELECT COUNT(*) as count FROM cookai.ingredients');
      console.log('Number of ingredients:', ingredients[0].count);

      // Check if the recipe_ingredients table exists and has data
      const [recipeIngredients] = await connection.query('SELECT COUNT(*) as count FROM cookai.recipe_ingredients');
      console.log('Number of recipe_ingredients:', recipeIngredients[0].count);
    }

    connection.release();
    console.log('Connection released');
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDatabase(); 