import React, { useState } from 'react';
import RecipeSearch from './components/RecipeSearch';
import RecipeDetails from './components/RecipeDetails';
import './App.css';

function App() {
  const [view, setView] = useState('search');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <div className="App">
      <header>
        <h1>CookAI</h1>
        <p>AI Based Recipe Suggester</p>
      </header>
      {view === 'search' ? (
        <RecipeSearch onSelect={recipe => {
          setSelectedRecipe(recipe);
          setView('details');
        }} />
      ) : (
        <RecipeDetails recipe={selectedRecipe} onBack={() => setView('search')} />
      )}
    </div>
  );
}

export default App;