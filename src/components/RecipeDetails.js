import React, { useEffect, useState } from 'react';
import './RecipeDetails.css';

export default function RecipeDetails({ recipe, onBack }) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/backend/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_steps',
        recipe_id: recipe.id
      })
    })
    .then(res => res.json())
    .then(data => {
      setSteps(data.steps);
      setLoading(false);
    });
  }, []);

  return (
    <div className="details-container">
      <button onClick={onBack}>← Back</button>
      <h2>{recipe.title}</h2>
      <div className="steps">
        {loading ? (
          <div className="loader"></div>
        ) : steps.map((step, i) => <p key={i}>{step}</p>)
        }
      </div>
    </div>
  );
}