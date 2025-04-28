-- Create database
CREATE DATABASE IF NOT EXISTS cookai_real;
USE cookai;

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    calories_per_serving INT,
    difficulty_level ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    prep_time VARCHAR(50) NOT NULL,
    servings INT NOT NULL,
    dietary_restrictions JSON NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recipe_ingredients junction table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Create user_submitted_recipes table
CREATE TABLE IF NOT EXISTS user_submitted_recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
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

-- Create user_submitted_recipe_ingredients junction table
CREATE TABLE IF NOT EXISTS user_submitted_recipe_ingredients (
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES user_submitted_recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Insert sample ingredients
INSERT INTO ingredients (name) VALUES
('bell peppers'),
('broccoli'),
('carrots'),
('soy sauce'),
('garlic'),
('ginger'),
('olive oil'),
('chicken'),
('curry powder'),
('coconut milk'),
('onions'),
('quinoa'),
('cucumber'),
('tomatoes'),
('feta cheese'),
('lemon juice'),
('chickpeas'),
('avocado'),
('kale'),
('sweet potato'),
('tahini'),
('beef'),
('potatoes'),
('beef broth'),
('herbs'),
('pasta'),
('olives'),
('tofu'),
('turmeric'),
('nutritional yeast'),
('spices'),
('salmon'),
('rice'),
('seaweed'),
('lentils'),
('celery'),
('vegetable broth'),
('cocoa powder'),
('maple syrup'),
('vanilla extract');

-- Insert sample recipes
INSERT INTO recipes (name, instructions, calories_per_serving, difficulty_level, prep_time, servings, dietary_restrictions, image_url) VALUES
('Vegetable Stir Fry', '1. Heat oil in pan\n2. Add vegetables\n3. Add sauce\n4. Cook for 5 minutes', 250, 'Easy', '15 mins', 2, '["vegetarian", "healthy"]', 'https://example.com/stirfry.jpg'),
('Chicken Curry', '1. Brown chicken\n2. Add spices\n3. Add coconut milk\n4. Simmer for 20 minutes', 450, 'Medium', '30 mins', 4, '["non-vegetarian"]', 'https://example.com/curry.jpg');

-- Insert recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
-- Vegetable Stir Fry ingredients
(1, 1, 2, 'pieces'), -- bell peppers
(1, 2, 1, 'cup'), -- broccoli
(1, 3, 2, 'pieces'), -- carrots
(1, 4, 2, 'tbsp'), -- soy sauce
(1, 5, 2, 'cloves'), -- garlic
(1, 6, 1, 'tbsp'), -- ginger
(1, 7, 2, 'tbsp'), -- olive oil

-- Chicken Curry ingredients
(2, 8, 500, 'g'), -- chicken
(2, 9, 2, 'tbsp'), -- curry powder
(2, 10, 1, 'can'), -- coconut milk
(2, 11, 2, 'pieces'), -- onions
(2, 5, 3, 'cloves'), -- garlic
(2, 6, 1, 'tbsp'); -- ginger 