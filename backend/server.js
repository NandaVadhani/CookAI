const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'cookai'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.get('/api/recipes', async (req, res) => {
    const { ingredients, restrictions, minCalories, maxCalories } = req.query;
    
    try {
        // Get recipes from database
        let query = 'SELECT * FROM recipes WHERE 1=1';
        const params = [];

        if (restrictions) {
            const restrictionsArray = JSON.parse(restrictions);
            restrictionsArray.forEach(restriction => {
                query += ' AND JSON_CONTAINS(dietary_restrictions, ?)';
                params.push(`"${restriction}"`);
            });
        }

        if (minCalories) {
            query += ' AND calories_per_serving >= ?';
            params.push(minCalories);
        }

        if (maxCalories) {
            query += ' AND calories_per_serving <= ?';
            params.push(maxCalories);
        }

        const [recipes] = await db.promise().query(query, params);

        // Use Gemini AI to rank recipes based on ingredients
        if (ingredients) {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Given these ingredients: ${ingredients}, rank these recipes by relevance and suggest the best matches: ${JSON.stringify(recipes)}`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const rankedRecipes = JSON.parse(response.text());

            res.json(rankedRecipes);
        } else {
            res.json(recipes);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/recipes', async (req, res) => {
    const { name, ingredients, instructions, calories_per_serving, difficulty_level, prep_time, servings, dietary_restrictions, image_url, user_email } = req.body;

    try {
        const query = 'INSERT INTO user_submitted_recipes (name, ingredients, instructions, calories_per_serving, difficulty_level, prep_time, servings, dietary_restrictions, image_url, user_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [name, ingredients, instructions, calories_per_serving, difficulty_level, prep_time, servings, JSON.stringify(dietary_restrictions), image_url, user_email]);

        res.status(201).json({ id: result.insertId, message: 'Recipe added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/recipes/:id', async (req, res) => {
    try {
        const [recipes] = await db.promise().query('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
        if (recipes.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipes[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 