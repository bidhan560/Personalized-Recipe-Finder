const apiKey = "ade5a23bc8084307aa374fac971c50aa";
const recipeList = document.getElementById("recipe-list");

document.getElementById("recipe-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ingredients = document.getElementById("ingredients").value;
  const diet = document.getElementById("diet").value;
  await fetchRecipes(ingredients, diet);
});

async function fetchRecipes(ingredients, diet) {
  recipeList.innerHTML = `<p>Loading...</p>`;
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&diet=${diet}&number=5&apiKey=${apiKey}`
    );
    const recipes = await response.json();
    displayRecipes(recipes);
  } catch (error) {
    console.error(error);
    recipeList.innerHTML = `<p>Something went wrong. Please try again.</p>`;
  }
}

function displayRecipes(recipes) {
  recipeList.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeItem = document.createElement("div");
    recipeItem.classList.add("recipe-item");
    recipeItem.innerHTML = `
      <h3 class="recipe-title">${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
      <button class="view-details-button" onclick="toggleDetails(this, ${recipe.id})">View Details</button>
      <div class="details"></div>
    `;
    recipeList.appendChild(recipeItem);
  });
}

async function toggleDetails(button, recipeId) {
  const detailsDiv = button.nextElementSibling;
  if (detailsDiv.innerHTML === "") {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
      );
      const recipe = await response.json();
      detailsDiv.innerHTML = `
        <p><strong>Ingredients:</strong> ${recipe.extendedIngredients
          .map((ing) => ing.original)
          .join(", ")}</p>
        <p><strong>Instructions:</strong> ${
          recipe.instructions || "No instructions available."
        }</p>
      `;
      button.textContent = "Hide Details";
    } catch (error) {
      console.error(error);
      detailsDiv.innerHTML = `<p>Could not load details. Please try again.</p>`;
    }
  }
  detailsDiv.parentNode.classList.toggle("active");
  button.textContent = detailsDiv.parentNode.classList.contains("active")
    ? "Hide Details"
    : "View Details";
}
