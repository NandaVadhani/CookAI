require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());


console.log('ENV MONGODB_URI:', process.env.MONGODB_URI);

const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function generateRecipe(
    userIngredients,
    dietaryRestrictions,
  ){

    
    const prompt = `
Create a recipe in the following strict JSON format. Only return JSON. 
Use the user-provided ingredients and dietary restrictions where possible.

{
  "name": "<recipe name>",
  "instructions": ["<step1>", "<step2>", "..."],
  "calories_per_serving": <number>,
  "difficulty_level": "<Easy|Medium|Hard>",
  "prep_time": "<time in minutes with 'mins'>",
  "servings": <number>,
  "dietaryRestrictions": ["<e.g. vegetarian, gluten-free, etc.>"],
  "image_url": "<realistic image URL>",
  "video_url": null,
  "ingredients": [
    {
      "name": "<ingredient name>",
      "quantity": <number>,
      "unit": "<g|pieces|cups|tbsp|...>"
    }
    // add more ingredients here
  ]
}

User ingredients: ${userIngredients}
User dietary restrictions: ${dietaryRestrictions}

Generate a recipe that fits these constraints.
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    let rawText = result.text;

    // Remove ```json or ``` if present
    rawText = rawText ? rawText.trim() : '';
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```json\n?|```[\s\n]?$/g, '').trim();
    }

    const jsonText = rawText;
    return jsonText;

}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
});
let db;

async function connectToMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    db = client.db('cookai');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}


app.post('/api/recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a recipe using these ingredients: ${ingredients.join(', ')}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipe = response.text();

    await db.collection('recipes').insertOne({
      ingredients,
      recipe,
      createdAt: new Date()
    });

    res.json({ recipe });
  } catch (error) {
    console.error('❌ Recipe generation error:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
  });
  
// GET /api/recipes?ingredients=garlic,tomato&restrictions=vegetarian,healthy
app.get('/api/recipes', async (req, res) => {
    try {
      // Extract ingredients and restrictions from query params
      const ingredients = (req.query.ingredients || '')
        .split(',')
        .map(i => i.trim().toLowerCase())
        .filter(Boolean);
  
      const restriction = (req.query.restrictions || '')
        .toLowerCase()
        .trim();
  
      // Build MongoDB filter
      const filter = {};
  
      if (ingredients.length) {
        filter['ingredients.name'] = { $all: ingredients };
      }
  
      if (restriction && restriction !== 'all') {
        filter.dietaryRestrictions = restriction;
      }
  
      // Return filtered recipe list
      const recipes = await db.collection('recipes')
        .find(filter)
        .project({
          name: 1,
          image_url: 1,
          prep_time: 1,
          servings: 1,
          calories_per_serving: 1,
          dietaryRestrictions: 1
        })
        .toArray();
  
      res.json(recipes);
    } catch (error) {
      console.log('❌ Error fetching recipes:', error);
      res.status(500).json({ error: 'Failed to fetch recipes' });
    }
  });
    
  app.get('/api/recipes/random', async (req, res) => {
    try {
      const randomRecipe = await db.collection('recipes')
        .aggregate([
          { $sample: { size: 1 } }, // Select 1 random document
          {
            $project: {
              name: 1,
              image_url: 1,
              prep_time: 1,
              servings: 1,
              calories_per_serving: 1,
              dietaryRestrictions: 1,
              ingredients: 1,
              instructions: 1
            }
          }
        ])
        .toArray();

  
      if (!randomRecipe.length) {
        return res.status(404).json({ error: 'No recipes found' });
      }
  
      res.json(randomRecipe[0]);
    } catch (error) {
      console.error('❌ Error fetching random recipe:', error);
      res.status(500).json({ error: 'Failed to fetch random recipe' });
    }
  });
  
  app.get('/api/recipes/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate ObjectId if you're using MongoDB
      console.log(id);
      const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });
  
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
  
      res.json(recipe);
    } catch (error) {
      console.error('❌ Error fetching recipe by ID:', error);
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
  });
  
  app.get('/api/generate', async (req, res) => {
    try {
      const ingredients = (req.query.ingredients || '')
        .split(',')
        .map(i => i.trim().toLowerCase())
        .filter(Boolean);
  
      const restriction = (req.query.restrictions || '')
        .toLowerCase()
        .trim();
  
      const result = await generateRecipe(ingredients, restriction);
      console.log(result);
  
      res.json({ recipe: result }); // <<< send response properly!
    } catch (error) {
      console.error('Error generating recipe:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});



// Catch all unexpected errors
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
