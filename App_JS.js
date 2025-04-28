const ingredients = [
    "Tomato", "Onion", "Garlic", "Potato", "Carrot", "Pepper", "Ginger", "Coriander", 
    "Rice", "Pasta", "Zucchini", "Lemon", "Chicken", "Beef", "Fish", "Eggs", "Milk", 
    "Cheese", "Bread", "Butter", "Basil", "Mushroom", "Bell Pepper", "Spinach", "Cucumber", 
    "Lettuce", "Avocado", "Broccoli", "Peas", "Corn", "Brinjal", "Cauliflower", "Radish", 
    "Olive oil", "Capsicum", "Cabbage", "Chili", "Coconut", "Curry", "Pork", "Panner", "Cream",
     "Kidney beans", "Curd", "Curry leaves", "Turmeric", "Urad dal", "Mutton", "Prawns"
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
        <div class="ingredient-tag">
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
    
    // Check if there are any selected ingredients
    const selectedIngredients = document.getElementById('selectedIngredients');
    const ingredients = Array.from(selectedIngredients.querySelectorAll('.ingredient-tag')).map(tag => tag.textContent.trim());
    
    if (ingredients.length === 0) {
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '<p class="text-center text-gray-500">Please select at least one ingredient to find recipes.</p>';
        return;
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
        const response = await fetch('http://localhost:5000/api/health');
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

// Function to fetch recipes from the API
async function fetchRecipes() {
    try {
        // Get selected ingredients
        const ingredients = selectedIngredients.map(ing => ing).join(',');
        
        // Get active filter for restrictions
        const activeFilter = Array.from(document.querySelectorAll('.filter-button'))
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('onclick')
            ?.match(/'([^']+)'/)?.[1] || 'all';
        
        // Set restrictions based on active filter
        const restrictions = activeFilter === 'all' ? '' : activeFilter;
        
        console.log('Fetching recipes with:', { ingredients, restrictions });
        
        const res = await fetch(
            `http://localhost:5000/api/recipes?ingredients=${encodeURIComponent(ingredients)
            }&restrictions=${encodeURIComponent(restrictions)}`);
        
        if (!res.ok) {
            throw new Error(`API responded with status: ${res.status}`);
        }
        
        const recipes = await res.json();
        console.log('Received recipes:', recipes);
        
        renderRecipeCards(recipes);
    } catch (error) {
        console.error('Error in fetchRecipes:', error);
        const container = document.getElementById('recipe-cards');
        container.innerHTML = `<p class="error-message">An error occurred while fetching recipes: ${error.message}</p>`;
    }
}

// Function to render recipe cards
function renderRecipeCards(recipes) {
    const container = document.getElementById('recipe-cards');
    container.innerHTML = ''; // Clear previous cards

    const recipeList = Array.isArray(recipes) ? recipes : [recipes];

    recipeList.forEach(r => {
        if (!r) return; // Skip null/undefined

        const card = document.createElement('div');
        card.className = 'recipe-card';

        card.innerHTML = `
            <img src="${r.image_url || ''}" alt="${r.name || 'Recipe'}" />
            <h3>${r.name || 'Unknown Recipe'}</h3>
            <ul class="meta">
                <li>${r.prep_time || 'N/A'}</li>
                <li>${r.calories_per_serving ? r.calories_per_serving + ' cal' : 'N/A'}</li>
                <li>${r.servings ? r.servings + ' servings' : 'N/A'}</li>
            </ul>
            <p>${(r.dietaryRestrictions || []).join(', ')}</p>
        `;

        card.onclick = () => location.href = `/recipe.html?id=${r._id}`;
        container.appendChild(card);
    });
}

// Function to search recipes
async function searchRecipes() {
    const loading = document.getElementById('loading');
    const recipeCards = document.getElementById('recipe-cards');
    
    // Check if there are any selected ingredients
    if (selectedIngredients.length === 0) {
        recipeCards.innerHTML = '<p class="text-center text-gray-500">Please select at least one ingredient to find recipes.</p>';
        return;
    }
    
    // Show loading state
    loading.classList.remove('hidden');
    recipeCards.innerHTML = '';
    
    // Check connection first
    const isConnected = await checkConnection();
    if (!isConnected) {
        loading.classList.add('hidden');
        recipeCards.innerHTML = '<p class="error-message">Unable to connect to server. Please try again later.</p>';
        return;
    }
    
    try {
        // Fetch and render recipes
        await fetchRecipes();
        
        // Hide loading state
        loading.classList.add('hidden');
    } catch (error) {
        console.error('Error fetching recipes:', error);
        loading.classList.add('hidden');
        recipeCards.innerHTML = '<p class="error-message">An error occurred while fetching recipes. Please try again.</p>';
    }
}

async function getRandomRecipe() {
    const loading = document.getElementById('loading');
    const recipeCards = document.getElementById('recipe-cards');

    // Show loading state
    loading.classList.remove('hidden');
    recipeCards.innerHTML = '';

    // Check connection first
    const isConnected = await checkConnection();
    if (!isConnected) {
        loading.classList.add('hidden');
        recipeCards.innerHTML = '<p class="error-message">Unable to connect to server. Please try again later.</p>';
        return;
    }

    try {
        // Fetch a random recipe
        const response = await fetch(
            `http://localhost:5000/api/recipes/random`);
        if (!response.ok) throw new Error('Failed to fetch random recipe');

        const recipe = await response.json();

        // Render the random recipe
        renderRecipeCards(recipe);

        // Hide loading state
        loading.classList.add('hidden');
    } catch (error) {
        console.error('Error fetching random recipe:', error);
        loading.classList.add('hidden');
        recipeCards.innerHTML = '<p class="error-message">An error occurred while fetching the recipe. Please try again.</p>';
    }
}

async function getGenerateRecipe(){

    const ingredients = selectedIngredients.map(ing => ing).join(',');
        
        // Get active filter for restrictions
        const activeFilter = Array.from(document.querySelectorAll('.filter-button'))
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('onclick')
            ?.match(/'([^']+)'/)?.[1] || 'all';
        
        // Set restrictions based on active filter
        const restrictions = activeFilter === 'all' ? '' : activeFilter;
    const response = await fetch(
        `http://localhost:5000/api/generate?ingredients=${encodeURIComponent(ingredients)
            }&restrictions=${encodeURIComponent(restrictions)}`);
    if (!response.ok) throw new Error('Failed to fetch random recipe');
    const recipe = await response.json();
sessionStorage.setItem('data', JSON.stringify(recipe));
console.log(recipe);
location.href = `/showAIRecipe.html`;


    
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
        const response = await fetch('http://localhost:5000/api/recipes');
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

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    alert('Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again later.');
            }
        });
    }
});

/* Fix dropdown alignment and visibility */
