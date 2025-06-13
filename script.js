const apiKey = "06122997d01e4dc2a58032995dff8f13";

function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}

function searchRecipe() {
  const query = document.getElementById('search').value.trim();
  const diet = document.getElementById('diet').value;
  const cuisine = document.getElementById('cuisine').value;
  const container = document.getElementById('recipes-container');
  container.innerHTML = '';

  if (query === '') {
    alert('Please enter a search term');
    return;
  }

  showLoader();

  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&diet=${diet}&cuisine=${cuisine}&number=10&apiKey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      hideLoader();

      if (data.results && data.results.length > 0) {
        data.results.forEach(meal => {
          const card = document.createElement('div');
          card.classList.add('recipe-card');
          card.innerHTML = `
            <img src="${meal.image}" alt="${meal.title}">
            <h3>${meal.title}</h3>
          `;
          card.onclick = () => getRecipeDetails(meal.id);
          container.appendChild(card);
        });
      } else {
        container.innerHTML = `<p>No recipes found for "${query}".</p>`;
      }
    })
    .catch(error => {
      hideLoader();
      console.error('Error fetching data:', error);
      container.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    });
}


function getRecipeDetails(id) {
  const container = document.getElementById('recipes-container');
  container.innerHTML = '';
  showLoader();

  fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      hideLoader();

      const ingredientsList = data.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('');
      container.innerHTML = `
        <div class="recipe-details">
          <h2>${data.title}</h2>
          <img src="${data.image}" alt="${data.title}" />
          <h3>Ingredients:</h3>
          <ul>${ingredientsList}</ul>
          <h3>Instructions:</h3>
          <p>${data.instructions || "No instructions available."}</p>
          <button onclick="searchRecipe()">🔙 Back to Search</button>
        </div>
      `;
    })
    .catch(error => {
      hideLoader();
      console.error('Error fetching recipe details:', error);
      container.innerHTML = `<p>Failed to load recipe details.</p>`;
    });
}

