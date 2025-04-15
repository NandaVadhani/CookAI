const ingredients = [
    "Tomato", "Onion", "Garlic", "Potato", "Carrot", "Pepper", "Salt", "Sugar", 
    "Ginger", "Coriander", "Rice", "Pasta", "Olive Oil", "Lemon", "Chicken", 
    "Beef", "Fish", "Eggs", "Milk", "Cheese", "Bread", "Butter", "Basil", 
    "Mushroom", "Bell Pepper", "Spinach", "Cucumber", "Lettuce", "Avocado"
];

const searchInput = document.getElementById("ingredientSearch");
const dropdown = document.getElementById("dropdown");
const selectedContainer = document.getElementById("selectedIngredients");
const loading = document.getElementById("loading");
let selectedIngredients = [];
let activeFilters = [];
let minCalories = null;
let maxCalories = null;

// Connection status management
const connectionStatus = document.getElementById('connection-status');
const statusDot = connectionStatus.querySelector('.status-dot');
const statusText = connectionStatus.querySelector('.status-text');

// Function to show/hide sections
function showSection(sectionId) {
    document.querySelectorAll('.main-content > div').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${sectionId}-section`).style.display = 'block';
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-link[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Function to handle ingredient search
searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    dropdown.innerHTML = "";
    
    const filtered = ingredients.filter(ing => ing.toLowerCase().includes(query));
    
    if (filtered.length === 0) {
        dropdown.classList.add('hidden');
        return;
    }
    
    filtered.forEach(ing => {
        const item = document.createElement("li");
        item.textContent = ing;
        item.addEventListener("click", () => selectIngredient(ing));
        dropdown.appendChild(item);
    });
    
    dropdown.classList.remove("hidden");
    positionDropdown();
});

// Function to select ingredient
function selectIngredient(ingredient) {
    if (!selectedIngredients.includes(ingredient)) {
        selectedIngredients.push(ingredient);
        updateSelectedIngredients();
    }
    searchInput.value = "";
    dropdown.classList.add("hidden");
}

// Function to update selected ingredients display
function updateSelectedIngredients() {
    const container = document.getElementById('selectedIngredients');
    container.innerHTML = selectedIngredients.map(ingredient => `
        <div class="selected-ingredient">
            ${ingredient}
            <button onclick="removeIngredient('${ingredient}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Function to remove ingredient
function removeIngredient(ingredient) {
    selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
    updateSelectedIngredients();
}

// Function to apply filters
function filterRecipes(filter) {
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
    
    if (filter === 'all') {
        activeFilters = [];
    } else {
        activeFilters = [filter];
    }
    
    searchRecipes();
}

// Function to apply calorie filter
function applyCalorieFilter() {
    minCalories = document.getElementById('minCalories').value;
    maxCalories = document.getElementById('maxCalories').value;
    searchRecipes();
}

// Function to display recipes
function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    
    if (!recipes || recipes.length === 0) {
        recipeList.innerHTML = '<p class="text-center text-gray-500">No recipes found. Try adjusting your filters.</p>';
        return;
    }
    
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        const image = recipe.image_url ? `<img src="${recipe.image_url}" alt="${recipe.title}" class="recipe-image">` : '';
        
        card.innerHTML = `
            ${image}
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.prep_time}</span>
                    <span><i class="fas fa-fire"></i> ${recipe.calories} cal</span>
                    <span><i class="fas fa-utensils"></i> ${recipe.servings} servings</span>
                </div>
                <p class="recipe-description">${recipe.instructions.substring(0, 150)}...</p>
                <div class="recipe-tags">
                    ${recipe.dietary_restrictions.map(restriction => 
                        `<span class="tag">${restriction}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        recipeList.appendChild(card);
    });
}

// Function to check connection
async function checkConnection() {
    try {
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
            statusDot.classList.remove('disconnected');
            statusDot.classList.add('connected');
            statusText.textContent = 'Connected to server';
            return true;
        }
    } catch (error) {
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
        statusText.textContent = 'Server disconnected';
        return false;
    }
}

// Function to search recipes
async function searchRecipes() {
    const loading = document.getElementById('loading');
    const recipeList = document.getElementById('recipe-list');
    const selectedIngredients = document.getElementById('selectedIngredients');
    const filterButtons = document.querySelectorAll('.filter-button');
    
    // Show loading state
    loading.classList.remove('hidden');
    recipeList.innerHTML = '';
    
    // Check connection first
    const isConnected = await checkConnection();
    if (!isConnected) {
        loading.classList.add('hidden');
        recipeList.innerHTML = '<p class="error-message">Unable to connect to server. Please try again later.</p>';
        return;
    }
    
    try {
        // Get active filter
        const activeFilter = Array.from(filterButtons).find(btn => btn.classList.contains('active'))?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'all';
        
        // Get selected ingredients
        const ingredients = Array.from(selectedIngredients.querySelectorAll('.ingredient-tag')).map(tag => tag.textContent.trim());
        
        const response = await fetch('http://localhost:3000/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredients,
                filter: activeFilter
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        
        const recipes = await response.json();
        
        // Hide loading state
        loading.classList.add('hidden');
        
        if (recipes.length === 0) {
            recipeList.innerHTML = '<p class="no-recipes">No recipes found matching your criteria.</p>';
            return;
        }
        
        // Display recipes
        recipeList.innerHTML = recipes.map(recipe => `
            <div class="recipe-card">
                <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe-image">
                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span class="recipe-time"><i class="fas fa-clock"></i> ${recipe.prep_time}</span>
                        <span class="recipe-calories"><i class="fas fa-fire"></i> ${recipe.calories} cal</span>
                        <span class="recipe-servings"><i class="fas fa-utensils"></i> ${recipe.servings} servings</span>
                    </div>
                    <div class="recipe-tags">
                        ${recipe.dietary_restrictions.map(restriction => `
                            <span class="recipe-tag ${restriction}">${restriction}</span>
                        `).join('')}
                    </div>
                    <p class="recipe-instructions">${recipe.instructions}</p>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error fetching recipes:', error);
        loading.classList.add('hidden');
        recipeList.innerHTML = '<p class="error-message">Error loading recipes. Please try again later.</p>';
    }
}

// Function to show recipe details
function showRecipeDetails(recipeId) {
    window.location.href = `recipe.html?id=${recipeId}`;
}

// Function to toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Function to handle dropdown positioning
function positionDropdown() {
    const searchInput = document.getElementById('ingredientSearch');
    const dropdown = document.getElementById('dropdown');
    
    if (searchInput && dropdown) {
        const inputRect = searchInput.getBoundingClientRect();
        const containerRect = searchInput.parentElement.getBoundingClientRect();
        
        dropdown.style.top = `${inputRect.height + 5}px`;
        dropdown.style.left = '0';
        dropdown.style.width = '100%';
    }
}

// Function to fetch and display recipes
async function fetchAndDisplayRecipes() {
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');
    
    try {
        const response = await fetch('/api/recipes');
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '<p class="text-center text-red-500">Error loading recipes. Please try again later.</p>';
    } finally {
        loading.classList.add('hidden');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    showSection('home');
    positionDropdown();
    
    // Check connection status
    await checkConnection();
    
    // Add window resize listener for dropdown positioning
    window.addEventListener('resize', positionDropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('dropdown');
        const searchInput = document.getElementById('ingredientSearch');
        
        if (dropdown && !dropdown.contains(e.target) && e.target !== searchInput) {
            dropdown.classList.add('hidden');
        }
    });
});

/* Fix dropdown alignment and visibility */
