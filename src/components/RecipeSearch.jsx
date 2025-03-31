import React, { useState } from 'react';
import './RecipeSearch.css';

const ingredients = [
  'pasta', 'tomatoes', 'chicken', 'avocado', 'bread',
  'beef', 'garlic', 'olive oil', 'feta', 'cucumber'
];

export default function RecipeSearch({ onSelect }) {
  const [selected, setSelected] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async () => {
    setLoading(true);
    const response = await fetch('http://localhost/backend/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        ingredients: selected
      })
    });
    const data = await response.json();
    setRecipes(data.recipes);
    setLoading(false);
  };

  return (
    <div className="search-container">
      <div className="ingredient-selector">
        <select onChange={e => !selected.includes(e.target.value) && setSelected([...selected, e.target.value])}>
          <option value="">Select Ingredients</option>
          {ingredients.map(ing => <option key={ing} value={ing}>{ing}</option>)}
        </select>
        <div className="selected-ingredients">
          {selected.map(ing => (
            <div key={ing} className="ingredient-tag">
              {ing}
              <button onClick={() => setSelected(selected.filter(i => i !== ing))}>×</button>
            </div>
          ))}
        </div>
        <button onClick={searchRecipes} disabled={!selected.length}>
          {loading ? 'Searching...' : 'Find Recipes'}
        </button>
      </div>
      
      <div className="results">
        {loading ? (
          <div className="loader"></div>
        ) : recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card" onClick={() => onSelect(recipe)}>
            <h3>{recipe.title}</h3>
            <p>{recipe.ingredients}</p>
          </div>
        ))}
      </div>
    </div>
  );
}