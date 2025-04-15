document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const dropdown = document.getElementById('dropdown');
    const selectedIngredients = document.querySelector('.selected-ingredients');

    // Function to hide dropdown with animation
    function hideDropdown() {
        dropdown.classList.add('hidden');
        // Wait for the animation to complete before removing from DOM flow
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 200); // Match this with the CSS transition duration
    }

    // Function to show dropdown with animation
    function showDropdown() {
        dropdown.style.display = 'block';
        // Force a reflow to ensure the transition works
        dropdown.offsetHeight;
        dropdown.classList.remove('hidden');
    }

    // Handle input focus
    searchInput.addEventListener('focus', function() {
        showDropdown();
    });

    // Handle input changes
    searchInput.addEventListener('input', function(e) {
        const value = e.target.value.trim();
        if (value.length > 0) {
            showDropdown();
            // Here you would typically filter your dropdown items based on the input value
            // For now, we'll just show the dropdown
        } else {
            hideDropdown();
        }
    });

    // Handle dropdown item selection
    dropdown.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            const selectedValue = e.target.textContent.trim();
            
            // Create new ingredient tag
            const ingredientTag = document.createElement('div');
            ingredientTag.className = 'ingredient-tag';
            ingredientTag.innerHTML = `
                ${selectedValue}
                <button class="remove-ingredient">&times;</button>
            `;

            // Add remove functionality
            const removeButton = ingredientTag.querySelector('.remove-ingredient');
            removeButton.addEventListener('click', function() {
                ingredientTag.remove();
            });

            // Add the new tag to selected ingredients
            selectedIngredients.appendChild(ingredientTag);

            // Clear input and hide dropdown with animation
            searchInput.value = '';
            hideDropdown();
        }
    });

    // Handle click outside with animation
    document.addEventListener('click', function(e) {
        const isClickInside = searchInput.contains(e.target) || dropdown.contains(e.target);
        if (!isClickInside) {
            hideDropdown();
        }
    });

    // Prevent dropdown from closing when clicking inside it
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}); 