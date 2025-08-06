const mealForm = document.getElementById('mealForm');
const mealsContainer = document.getElementById('meals');
const regenerateBtn = document.getElementById('regenerateBtn');
const getMealsBtn = document.getElementById('getMealsBtn');

// Map dietary restrictions to TheMealDB categories or ingredients
const restrictionMap = {
    'Vegetarian': 'Vegetarian',
    'Vegan': 'Vegan',
    'Pescatarian': 'Seafood',
    'Gluten Free': 'Pasta', 
    'Dairy Free': 'Chicken', 
    'Nut Free': 'Beef', 
    'None': 'Chicken'
};

// Function to fetch a single random meal from a filtered list
const fetchRandomMeal = async (restriction) => {
    const category = restrictionMap[restriction] || 'Chicken';
    let filterUrl;

    if (category === 'Vegetarian' || category === 'Vegan' || category === 'Seafood') {
        filterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    } else {
        filterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${category}`;
    }

    try {
        const response = await fetch(filterUrl);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.meals.length);
            const mealId = data.meals[randomIndex].idMeal;
            
            return await fetchMealDetails(mealId);
        }
        return null;
    } catch (error) {
        console.error("Error fetching random meal:", error);
        return null;
    }
};

// Function to get detailed information about a meal by its ID
const fetchMealDetails = async (mealId) => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error("Error fetching meal details:", error);
        return null;
    }
};

// A simplified function to extract ingredients and measures
const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }
    return ingredients;
};

// Function to simulate a typewriter effect
const typeWriterEffect = (element, text, speed) => {
    let i = 0;
    element.innerHTML = '';
    const typing = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
};

// Function to simulate a reverse-typewriter effect (deleting words)
const reverseTypeWriterEffect = (element, text, speed, onComplete) => {
    let i = text.length;
    const deleting = setInterval(() => {
        if (i > 0) {
            element.innerHTML = text.substring(0, i - 1);
            i--;
        } else {
            clearInterval(deleting);
            if (onComplete) onComplete();
        }
    }, speed);
};

// Function to render a single meal card with a "Read More" button
const renderMealCard = (meal, mealType) => {
    if (!meal) {
        return `<div class="meal-card meal-content"><h3>${mealType}</h3><p>No meals found for this preference.</p></div>`;
    }

    const ingredientsList = getIngredients(meal).map(item => `<li>${item}</li>`).join('');
    const shortInstructions = meal.strInstructions.substring(0, 150) + '...';
    
    // Placeholder for nutritional information since TheMealDB does not provide it directly
    const nutritionalInfo = {
        calories: Math.floor(Math.random() * (700 - 300 + 1)) + 300,
        protein: Math.floor(Math.random() * (50 - 15 + 1)) + 15,
        carbs: Math.floor(Math.random() * (80 - 30 + 1)) + 30,
        fats: Math.floor(Math.random() * (40 - 10 + 1)) + 10
    };

    return `
        <div class="meal-card" data-meal-id="${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-content">
                <h3>${mealType}</h3>
                <h4>${meal.strMeal}</h4>
                <div class="meal-details">
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    <p><strong>Cuisine:</strong> ${meal.strArea}</p>
                    <p><strong>Calories:</strong> ${nutritionalInfo.calories} kcal</p>
                    <p><strong>Protein:</strong> ${nutritionalInfo.protein}g, <strong>Carbs:</strong> ${nutritionalInfo.carbs}g, <strong>Fats:</strong> ${nutritionalInfo.fats}g</p>
                    
                    <h4>Ingredients</h4>
                    <ul class="ingredients-list">${ingredientsList}</ul>
                    
                    <h4>Instructions</h4>
                    <div class="instructions-container">
                        <p class="short-instructions">${shortInstructions}</p>
                        <p class="full-instructions" style="display: none;"></p>
                    </div>
                    <button class="read-more-btn">Read more</button>
                    
                    ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" style="display:inline-block; margin-top:10px;">Watch on YouTube</a>` : ''}
                </div>
            </div>
        </div>
    `;
};

// Function to fetch and render all meals
const fetchAndRenderMeals = async () => {
    mealsContainer.innerHTML = '<p>Loading meals...</p>';

    const dietaryRestrictions = Array.from(
        document.querySelectorAll('input[name="dietary_restrictions"]:checked')
    ).map(input => input.value);

    const selectedRestriction = dietaryRestrictions.length > 0 ? dietaryRestrictions[0] : 'None';

    const [breakfast, lunch, dinner] = await Promise.all([
        fetchRandomMeal(selectedRestriction),
        fetchRandomMeal(selectedRestriction),
        fetchRandomMeal(selectedRestriction)
    ]);

    mealsContainer.innerHTML = `
        ${renderMealCard(breakfast, 'Breakfast')}
        ${renderMealCard(lunch, 'Lunch')}
        ${renderMealCard(dinner, 'Dinner')}
    `;
};

// Function to save user preferences to localStorage
const savePreferences = () => {
    const goal = document.getElementById('goal').value;
    const dietaryRestrictions = Array.from(
        document.querySelectorAll('input[name="dietary_restrictions"]:checked')
    ).map(input => input.value);
    const currentWeight = document.getElementById('current_weight').value;
    const targetWeight = document.getElementById('target_weight').value;
    const activityLevel = document.getElementById('daily_activity_level').value;

    const userPreferences = {
        goal,
        dietaryRestrictions,
        currentWeight,
        targetWeight,
        activityLevel
    };
    localStorage.setItem('mealPlannerPreferences', JSON.stringify(userPreferences));
};

// Event listener for form submission
mealForm.addEventListener('submit', (event) => {
    event.preventDefault();
    savePreferences();
    fetchAndRenderMeals();
    regenerateBtn.style.display = 'block';
});

// Event listener for "Regenerate Meals" button
regenerateBtn.addEventListener('click', () => {
    fetchAndRenderMeals();
});

// Event listener for "Read More/Less" buttons
mealsContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('read-more-btn')) {
        const button = event.target;
        const card = button.closest('.meal-card');
        const mealId = card.dataset.mealId;
        const instructionsContainer = card.querySelector('.instructions-container');
        const shortInstructionsEl = card.querySelector('.short-instructions');
        const fullInstructionsEl = card.querySelector('.full-instructions');

        if (button.textContent === 'Read more') {
            button.textContent = '...';
            const mealDetails = await fetchMealDetails(mealId);
            const fullText = mealDetails.strInstructions;

            reverseTypeWriterEffect(shortInstructionsEl, shortInstructionsEl.textContent, 20, () => {
                shortInstructionsEl.style.display = 'none';
                fullInstructionsEl.style.display = 'block';
                typeWriterEffect(fullInstructionsEl, fullText, 10);
                button.textContent = 'Read less';
            });
        } else {
            const fullText = fullInstructionsEl.textContent;
            reverseTypeWriterEffect(fullInstructionsEl, fullText, 10, () => {
                fullInstructionsEl.style.display = 'none';
                shortInstructionsEl.style.display = 'block';
                button.textContent = 'Read more';
            });
        }
    }
});

// Event listener to clear local storage on page refresh (beforeunload)
window.addEventListener('beforeunload', () => {
    localStorage.removeItem('mealPlannerPreferences');
});