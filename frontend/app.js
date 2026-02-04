const API = "https://obscure-enigma-pjw96r4pgrw7c9wpr-3000.app.github.dev/api/movies";
const $data = document.getElementById("movies");

async function loadMovies() {
    const response = await fetch(API);
    const data = await response.json();
    console.log(data);
    $data.innerHTML = data;
}
loadMovies();

