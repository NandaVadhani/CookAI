const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Mock recipes data
const mockRecipes = [
    {
        id: 1,
        title: "Vegetable Pasta",
        prep_time: "30 mins",
        calories: 450,
        servings: 4,
        instructions: "Cook pasta, sauté vegetables, combine and serve.",
        dietary_restrictions: ["vegetarian", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 2,
        title: "Chicken Stir Fry",
        prep_time: "25 mins",
        calories: 550,
        servings: 2,
        instructions: "Stir fry chicken with vegetables and sauce.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 3,
        title: "Quinoa Buddha Bowl",
        prep_time: "20 mins",
        calories: 380,
        servings: 2,
        instructions: "Cook quinoa, add roasted vegetables, top with dressing.",
        dietary_restrictions: ["vegetarian", "vegan", "healthy", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 4,
        title: "Beef Tacos",
        prep_time: "35 mins",
        calories: 620,
        servings: 4,
        instructions: "Cook beef with taco seasoning, serve in tortillas with toppings.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 5,
        title: "Mushroom Risotto",
        prep_time: "45 mins",
        calories: 480,
        servings: 4,
        instructions: "Cook rice with mushrooms and broth until creamy.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 6,
        title: "Salmon with Asparagus",
        prep_time: "30 mins",
        calories: 420,
        servings: 2,
        instructions: "Bake salmon with asparagus and lemon.",
        dietary_restrictions: ["non-vegetarian", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 7,
        title: "Vegan Curry",
        prep_time: "40 mins",
        calories: 380,
        servings: 4,
        instructions: "Cook vegetables in coconut milk with curry spices.",
        dietary_restrictions: ["vegan", "vegetarian", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 8,
        title: "Greek Salad",
        prep_time: "15 mins",
        calories: 320,
        servings: 2,
        instructions: "Combine vegetables, feta, and olives with dressing.",
        dietary_restrictions: ["vegetarian", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 9,
        title: "Chicken Caesar Wrap",
        prep_time: "20 mins",
        calories: 580,
        servings: 2,
        instructions: "Wrap chicken, lettuce, and Caesar dressing in tortilla.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 10,
        title: "Vegetable Lasagna",
        prep_time: "60 mins",
        calories: 520,
        servings: 6,
        instructions: "Layer vegetables, cheese, and pasta with sauce.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 11,
        title: "Shrimp Scampi",
        prep_time: "25 mins",
        calories: 450,
        servings: 2,
        instructions: "Sauté shrimp with garlic and white wine.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 12,
        title: "Lentil Soup",
        prep_time: "45 mins",
        calories: 280,
        servings: 4,
        instructions: "Cook lentils with vegetables and spices.",
        dietary_restrictions: ["vegan", "vegetarian", "healthy", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 13,
        title: "Beef Burger",
        prep_time: "30 mins",
        calories: 750,
        servings: 4,
        instructions: "Grill beef patties and assemble with toppings.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 14,
        title: "Vegetable Stir Fry",
        prep_time: "20 mins",
        calories: 320,
        servings: 2,
        instructions: "Stir fry vegetables with sauce and serve over rice.",
        dietary_restrictions: ["vegetarian", "vegan", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 15,
        title: "Pork Chops",
        prep_time: "35 mins",
        calories: 480,
        servings: 2,
        instructions: "Season and grill pork chops with vegetables.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 16,
        title: "Avocado Toast",
        prep_time: "10 mins",
        calories: 350,
        servings: 2,
        instructions: "Toast bread and top with mashed avocado.",
        dietary_restrictions: ["vegetarian", "vegan", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 17,
        title: "Chicken Noodle Soup",
        prep_time: "40 mins",
        calories: 380,
        servings: 4,
        instructions: "Cook chicken with vegetables and noodles in broth.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 18,
        title: "Eggplant Parmesan",
        prep_time: "50 mins",
        calories: 420,
        servings: 4,
        instructions: "Bread and bake eggplant with cheese and sauce.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 19,
        title: "Tuna Salad",
        prep_time: "15 mins",
        calories: 320,
        servings: 2,
        instructions: "Mix tuna with vegetables and dressing.",
        dietary_restrictions: ["non-vegetarian", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 20,
        title: "Vegetable Pizza",
        prep_time: "45 mins",
        calories: 580,
        servings: 4,
        instructions: "Top pizza dough with vegetables and cheese.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 21,
        title: "Beef Stew",
        prep_time: "120 mins",
        calories: 450,
        servings: 6,
        instructions: "Slow cook beef with vegetables and broth.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 22,
        title: "Fruit Smoothie Bowl",
        prep_time: "10 mins",
        calories: 280,
        servings: 1,
        instructions: "Blend fruits and top with granola and berries.",
        dietary_restrictions: ["vegan", "vegetarian", "healthy", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 23,
        title: "Chicken Alfredo",
        prep_time: "40 mins",
        calories: 680,
        servings: 4,
        instructions: "Cook pasta with chicken and Alfredo sauce.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 24,
        title: "Vegetable Curry",
        prep_time: "35 mins",
        calories: 380,
        servings: 4,
        instructions: "Cook vegetables in curry sauce with rice.",
        dietary_restrictions: ["vegetarian", "vegan", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 25,
        title: "Grilled Salmon",
        prep_time: "25 mins",
        calories: 420,
        servings: 2,
        instructions: "Grill salmon with lemon and herbs.",
        dietary_restrictions: ["non-vegetarian", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 26,
        title: "Vegetable Soup",
        prep_time: "45 mins",
        calories: 280,
        servings: 4,
        instructions: "Cook vegetables in broth with herbs.",
        dietary_restrictions: ["vegetarian", "vegan", "healthy", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 27,
        title: "Chicken Quesadilla",
        prep_time: "20 mins",
        calories: 520,
        servings: 2,
        instructions: "Fill tortillas with chicken and cheese, then grill.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 28,
        title: "Vegetable Fried Rice",
        prep_time: "30 mins",
        calories: 380,
        servings: 4,
        instructions: "Stir fry rice with vegetables and sauce.",
        dietary_restrictions: ["vegetarian", "vegan"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 29,
        title: "Beef and Broccoli",
        prep_time: "35 mins",
        calories: 480,
        servings: 4,
        instructions: "Stir fry beef with broccoli and sauce.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 30,
        title: "Caprese Salad",
        prep_time: "15 mins",
        calories: 320,
        servings: 2,
        instructions: "Layer tomatoes, mozzarella, and basil with dressing.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 31,
        title: "Chicken Caesar Salad",
        prep_time: "20 mins",
        calories: 420,
        servings: 2,
        instructions: "Combine chicken, lettuce, and Caesar dressing.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 32,
        title: "Vegetable Omelette",
        prep_time: "15 mins",
        calories: 350,
        servings: 1,
        instructions: "Cook eggs with vegetables and cheese.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 33,
        title: "Beef Tacos",
        prep_time: "35 mins",
        calories: 620,
        servings: 4,
        instructions: "Cook beef with taco seasoning, serve in tortillas.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 34,
        title: "Vegetable Stir Fry",
        prep_time: "20 mins",
        calories: 320,
        servings: 2,
        instructions: "Stir fry vegetables with sauce and serve over rice.",
        dietary_restrictions: ["vegetarian", "vegan", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 35,
        title: "Grilled Chicken",
        prep_time: "30 mins",
        calories: 380,
        servings: 2,
        instructions: "Grill chicken with herbs and serve with vegetables.",
        dietary_restrictions: ["non-vegetarian", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 36,
        title: "Vegetable Pasta",
        prep_time: "30 mins",
        calories: 450,
        servings: 4,
        instructions: "Cook pasta with vegetables and sauce.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 37,
        title: "Beef Steak",
        prep_time: "25 mins",
        calories: 580,
        servings: 2,
        instructions: "Grill steak to desired doneness.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 38,
        title: "Vegetable Curry",
        prep_time: "35 mins",
        calories: 380,
        servings: 4,
        instructions: "Cook vegetables in curry sauce with rice.",
        dietary_restrictions: ["vegetarian", "vegan", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 39,
        title: "Chicken Wings",
        prep_time: "45 mins",
        calories: 680,
        servings: 4,
        instructions: "Bake chicken wings with sauce.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 40,
        title: "Vegetable Soup",
        prep_time: "45 mins",
        calories: 280,
        servings: 4,
        instructions: "Cook vegetables in broth with herbs.",
        dietary_restrictions: ["vegetarian", "vegan", "healthy", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 41,
        title: "Beef Burger",
        prep_time: "30 mins",
        calories: 750,
        servings: 4,
        instructions: "Grill beef patties and assemble with toppings.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 42,
        title: "Vegetable Lasagna",
        prep_time: "60 mins",
        calories: 520,
        servings: 6,
        instructions: "Layer vegetables, cheese, and pasta with sauce.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 43,
        title: "Chicken Noodle Soup",
        prep_time: "40 mins",
        calories: 380,
        servings: 4,
        instructions: "Cook chicken with vegetables and noodles in broth.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 44,
        title: "Vegetable Pizza",
        prep_time: "45 mins",
        calories: 580,
        servings: 4,
        instructions: "Top pizza dough with vegetables and cheese.",
        dietary_restrictions: ["vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 45,
        title: "Beef Stew",
        prep_time: "120 mins",
        calories: 450,
        servings: 6,
        instructions: "Slow cook beef with vegetables and broth.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 46,
        title: "Vegetable Stir Fry",
        prep_time: "20 mins",
        calories: 320,
        servings: 2,
        instructions: "Stir fry vegetables with sauce and serve over rice.",
        dietary_restrictions: ["vegetarian", "vegan", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 47,
        title: "Chicken Alfredo",
        prep_time: "40 mins",
        calories: 680,
        servings: 4,
        instructions: "Cook pasta with chicken and Alfredo sauce.",
        dietary_restrictions: ["non-vegetarian"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 48,
        title: "Vegetable Curry",
        prep_time: "35 mins",
        calories: 380,
        servings: 4,
        instructions: "Cook vegetables in curry sauce with rice.",
        dietary_restrictions: ["vegetarian", "vegan", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 49,
        title: "Grilled Salmon",
        prep_time: "25 mins",
        calories: 420,
        servings: 2,
        instructions: "Grill salmon with lemon and herbs.",
        dietary_restrictions: ["non-vegetarian", "healthy"],
        image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 50,
        title: "Vegetable Soup",
        prep_time: "45 mins",
        calories: 280,
        servings: 4,
        instructions: "Cook vegetables in broth with herbs.",
        dietary_restrictions: ["vegetarian", "vegan", "healthy", "gluten-free"],
        image_url: "https://via.placeholder.com/300x200"
    }
];

// Recipes endpoint
app.post('/api/recipes', (req, res) => {
    const { ingredients, filter } = req.body;
    
    // Filter recipes based on ingredients and dietary restrictions
    let filteredRecipes = mockRecipes;
    
    if (filter && filter !== 'all') {
        filteredRecipes = mockRecipes.filter(recipe => 
            recipe.dietary_restrictions.includes(filter)
        );
    }
    
    res.json(filteredRecipes);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 