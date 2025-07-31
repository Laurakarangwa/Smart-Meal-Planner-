document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mealForm');
  if (!form) {
    console.error('Form not found!');
    console.log(form)
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data, including all checked dietary_restrictions
    const formData = new FormData(e.target);
    const data = {
      goal: formData.get('goal'),
      dietary_restrictions: Array.from(
        form.querySelectorAll('input[name="dietary_restrictions"]:checked')
      ).map(cb => cb.value),
      current_weight: Number(formData.get('current_weight')),
      target_weight: Number(formData.get('target_weight')),
      daily_activity_level: formData.get('daily_activity_level'),
      lang: 'en'
    };

    // RapidAPI request
const url = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/analyzeFoodPlate?imageUrl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fb%2Fbd%2FBreakfast_foods.jpg&lang=en&noqueue=1';
const options = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': 'd39a81d69fmsh77e541f5a1b9a8bp1d6b24jsn83cfb28c88a1',
		'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
		'Content-Type': 'application/x-www-form-urlencoded'
	},
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);

      // Render plan cards if result is valid
      if (result && result.result) {
        renderPlanCards(result);
      } else {
        document.getElementById('mealResults').innerHTML = `<p style="color:red;">No plan data received.</p>`;
      }
    } catch (error) {
      console.error(error);
      document.getElementById('mealResults').innerHTML = `<p style="color:red;">Failed to load plan. Please try again.</p>`;
    }
  });
});

// Function to render the plan cards
function renderPlanCards(data) {
  const planDiv = document.getElementById('mealResults');
  if (!planDiv) return;

  const { exercise_name, description, goal, calories_per_day, macronutrients, meal_suggestions } = data.result;

  planDiv.innerHTML = `
    <div class="plan-card">
      <h2>${exercise_name}</h2>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Goal:</strong> ${goal}</p>
      <p><strong>Calories per day:</strong> ${calories_per_day}</p>
      <div class="macros">
        <strong>Macronutrients:</strong>
        <ul>
          <li>Carbohydrates: ${macronutrients.carbohydrates}</li>
          <li>Proteins: ${macronutrients.proteins}</li>
          <li>Fats: ${macronutrients.fats}</li>
        </ul>
      </div>
      <div class="meals-section">
        <h3>Meal Suggestions</h3>
        ${meal_suggestions.map(ms => `
          <div class="meal-card">
            <h4>${ms.meal}</h4>
            ${ms.suggestions.map(s => `
              <div class="suggestion-card">
                <strong>${s.name}</strong>
                <ul>
                  ${s.ingredients.map(i => `<li>${i}</li>`).join('')}
                </ul>
                <span class="calories">${s.calories} kcal</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Example usage (remove/comment out in production):
// renderPlanCards(yourJsonData);
