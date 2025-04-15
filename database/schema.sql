-- Create database
CREATE DATABASE IF NOT EXISTS cookai;
USE cookai;

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    calories_per_serving INT,
    difficulty_level ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    prep_time VARCHAR(50) NOT NULL,
    servings INT NOT NULL,
    dietary_restrictions JSON NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_submitted_recipes table
CREATE TABLE IF NOT EXISTS user_submitted_recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    calories_per_serving INT,
    difficulty_level ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    prep_time VARCHAR(50) NOT NULL,
    servings INT NOT NULL,
    dietary_restrictions JSON NOT NULL,
    image_url VARCHAR(255),
    user_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample recipes
INSERT INTO recipes (name, ingredients, instructions, calories_per_serving, difficulty_level, prep_time, servings, dietary_restrictions, image_url) VALUES
('Vegetable Stir Fry', 'bell peppers, broccoli, carrots, soy sauce, garlic, ginger, olive oil', '1. Heat oil in pan\n2. Add vegetables\n3. Add sauce\n4. Cook for 5 minutes', 250, 'Easy', '15 mins', 2, '["vegetarian", "healthy"]', 'https://example.com/stirfry.jpg'),
('Chicken Curry', 'chicken, curry powder, coconut milk, onions, garlic, ginger', '1. Brown chicken\n2. Add spices\n3. Add coconut milk\n4. Simmer for 20 minutes', 450, 'Medium', '30 mins', 4, '["non-vegetarian"]', 'https://example.com/curry.jpg'),
('Quinoa Salad', 'quinoa, cucumber, tomatoes, feta cheese, olive oil, lemon juice', '1. Cook quinoa\n2. Mix vegetables\n3. Add dressing\n4. Chill and serve', 300, 'Easy', '20 mins', 2, '["vegetarian", "healthy", "gluten-free"]', 'https://example.com/quinoa.jpg'),
('Vegan Buddha Bowl', 'quinoa, chickpeas, avocado, kale, sweet potato, tahini', '1. Roast vegetables\n2. Cook quinoa\n3. Assemble bowl\n4. Add dressing', 350, 'Easy', '25 mins', 1, '["vegan", "healthy", "gluten-free"]', 'https://example.com/buddha.jpg'),
('Beef Stew', 'beef, potatoes, carrots, onions, beef broth, herbs', '1. Brown beef\n2. Add vegetables\n3. Add broth\n4. Simmer for 2 hours', 550, 'Hard', '2 hours', 6, '["non-vegetarian"]', 'https://example.com/stew.jpg'),
('Mediterranean Pasta', 'pasta, olives, feta, tomatoes, olive oil, herbs', '1. Cook pasta\n2. Mix ingredients\n3. Add dressing\n4. Serve warm', 400, 'Easy', '20 mins', 2, '["vegetarian"]', 'https://example.com/pasta.jpg'),
('Tofu Scramble', 'tofu, turmeric, vegetables, nutritional yeast, spices', '1. Crumble tofu\n2. Add spices\n3. Cook vegetables\n4. Mix and serve', 200, 'Easy', '15 mins', 2, '["vegan", "healthy"]', 'https://example.com/tofu.jpg'),
('Salmon Bowl', 'salmon, rice, avocado, cucumber, seaweed, soy sauce', '1. Cook rice\n2. Prepare salmon\n3. Assemble bowl\n4. Add sauce', 450, 'Medium', '25 mins', 1, '["non-vegetarian", "healthy"]', 'https://example.com/salmon.jpg'),
('Lentil Soup', 'lentils, carrots, celery, onions, vegetable broth, spices', '1. Sauté vegetables\n2. Add lentils\n3. Add broth\n4. Simmer for 30 minutes', 250, 'Easy', '40 mins', 4, '["vegan", "healthy", "gluten-free"]', 'https://example.com/lentil.jpg'),
('Chocolate Avocado Mousse', 'avocado, cocoa powder, maple syrup, vanilla extract', '1. Blend ingredients\n2. Chill\n3. Serve with berries', 200, 'Easy', '10 mins', 2, '["vegan", "healthy", "gluten-free"]', 'https://example.com/mousse.jpg'); 