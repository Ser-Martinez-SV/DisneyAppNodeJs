
// app.js - ES Module-like structure with DEMO MODE

// CONFIGURATION
// Since we are now serving frontend from the backend, we can use relative path!
// But if you run them separately, you might need the full URL.
const API_URLS = [
    "/api/movies", // Preferred: Relative path (works when served by Backend)
    "https://obscure-enigma-pjw96r4pgrw7c9wpr-3000.app.github.dev/api/movies", // Your specific Codespace
    "http://localhost:3000/api/movies" // Local Fallback
];

let API_BASE = API_URLS[0];

// STATE
const state = {
    allMovies: [],
    filteredMovies: [],
    filters: {
        search: "",
        franchise: null,
        category: null
    },
    activeMovie: null
};

// CACHE DOM ELEMENTS
const $app = document.getElementById("app");

// ---------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------
async function init() {
    console.log("Initializing App...");
    await fetchMovies();
    renderApp();

    // Remove loading screen
    document.querySelector(".loading-screen")?.remove();
}

async function fetchMovies() {
    // Try multiple URLs if needed, or just default to relative
    // For simplicity in this demo, we'll try the first one, then fallback to demo mode.
    // NOTE: If you are running Frontend on port 5500 and Backend on 3000, 
    // relative path "/api/movies" tries to hit port 5500 and fails.

    // Let's try to detect if we are on the backend port or not.
    // But simplest is to just try fetching.

    try {
        console.log("Fetching from:", API_BASE);
        let res = await fetch(API_BASE);

        // If relative failed (e.g. 404 from Live Server), try the Codespace URL
        if (!res.ok && res.status === 404) {
            console.log("Relative path failed, trying Codespace URL...");
            API_BASE = API_URLS[1];
            res = await fetch(API_BASE);
        }

        if (!res.ok) throw new Error("API status " + res.status);

        const data = await res.json();
        if (data.ok) {
            state.allMovies = data.movies;
            applyFilters();
        } else {
            throw new Error("API Data Error");
        }
    } catch (e) {
        console.warn("Backend unavailable. ACTIVATING DEMO MODE.", e);
        // Fallback to local data so the user can see the UI design
        state.allMovies = getDemoData();
        applyFilters();
    }
}

function getDemoData() {
    return [
        {
            id: 1,
            title: "Avatar: The Way of Water",
            franchise: "disney",
            category: "Sci-Fi",
            rating: 4.8,
            year: 2022,
            synopsis: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
            poster_url: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
            backdrop_url: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
            is_trending: true
        },
        {
            id: 2,
            title: "Guardians of the Galaxy Vol. 3",
            franchise: "marvel",
            category: "Action",
            rating: 4.7,
            year: 2023,
            synopsis: "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own.",
            poster_url: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
            backdrop_url: "https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
            is_trending: true
        },
        {
            id: 3,
            title: "The Mandalorian",
            franchise: "starwars",
            category: "Adventure",
            rating: 4.9,
            year: 2019,
            synopsis: "After the fall of the Galactic Empire, lawlessness has spread throughout the galaxy. A lone gunfighter makes his way through the outer reaches, earning his keep as a bounty hunter.",
            poster_url: "https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1R07JHLZs.jpg",
            backdrop_url: "https://image.tmdb.org/t/p/original/6Lw54zxia6h7Gq36RNF3hXPScDB.jpg",
            is_new: true
        },
        {
            id: 4,
            title: "Toy Story 4",
            franchise: "pixar",
            category: "Animation",
            rating: 4.5,
            year: 2019,
            synopsis: "Woody has always been confident about his place in the world and that his priority is taking care of his kid, whether that's Andy or Bonnie.",
            poster_url: "https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg",
            backdrop_url: "https://image.tmdb.org/t/p/original/m67smI1IIMmYzCl9axvKNULVKLr.jpg",
            is_trending: false
        },
        {
            id: 5,
            title: "Inside Out 2",
            franchise: "pixar",
            category: "Animation",
            rating: 4.9,
            year: 2024,
            synopsis: "Joy, Sadness, Anger, Fear and Disgust have been running a successful operation by all accounts. However, when Anxiety shows up, they aren't sure how to feel.",
            poster_url: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
            backdrop_url: "https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg",
            is_new: true
        },
        {
            id: 6,
            title: "Loki",
            franchise: "marvel",
            category: "Fantasy",
            rating: 4.6,
            year: 2021,
            synopsis: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of 'Avengers: Endgame'.",
            poster_url: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg",
            backdrop_url: "https://image.tmdb.org/t/p/original/cm683db98rQpD8w42j74JzP5U7p.jpg"
        },
        {
            id: 7,
            title: "Limitless with Chris Hemsworth",
            franchise: "natgeo",
            category: "Documentary",
            rating: 4.7,
            year: 2022,
            synopsis: "A different way to live better for longer. Chris Hemsworth takes on an epic mission to discover the full potential of the human body.",
            poster_url: "https://image.tmdb.org/t/p/w500/ms2K926e82B9yYF0FhOXy8v0U84.jpg",
            backdrop_url: "https://image.tmdb.org/t/p/original/f2t4JbUvQKwD5NuY9S45R7UaJb.jpg"
        },
        {
            id: 8,
            title: "Star Wars: Andor",
            franchise: "starwars",
            category: "Sci-Fi",
            rating: 4.8,
            year: 2022,
            synopsis: "The prequel to Rogue One. In an era filled with danger, deception and intrigue, Cassian will embark on the path that is destined to turn him into a rebel hero.",
            poster_url: "https://image.tmdb.org/t/p/w500/59SVNwSmV7C2jqGX90Yl1x05QO.jpg",
            backdrop_url: "https://image.tmdb.org/t/p/original/ajztm40qDPqMONnPJQjek5C16I0.jpg"
        }
    ];
}

// ---------------------------------------------------------
// LOGIC & FILTERING
// ---------------------------------------------------------
function applyFilters() {
    let result = state.allMovies || [];

    if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        result = result.filter(m =>
            m.title.toLowerCase().includes(q) ||
            (m.synopsis && m.synopsis.toLowerCase().includes(q))
        );
    }

    if (state.filters.franchise) {
        result = result.filter(m => m.franchise === state.filters.franchise);
    }

    if (state.filters.category) {
        result = result.filter(m => m.category === state.filters.category);
    }

    state.filteredMovies = result;
    renderGrid();
}

function setFilter(type, value) {
    if (state.filters[type] === value && type !== 'search') {
        // Toggle off if clicking same filter
        state.filters[type] = null;
    } else {
        state.filters[type] = value;
    }

    applyFilters();
    updateUIState(); // Update active buttons
}

// ---------------------------------------------------------
// RENDERING
// ---------------------------------------------------------
function renderApp() {
    $app.innerHTML = `
        ${renderNavbar()}
        <div class="main-wrapper">
            ${renderHero()}
            ${renderFranchiseNav()}
            ${renderFilters()}
            <div id="movies-container">
                <!-- Grid Content -->
            </div>
        </div>
        ${renderModal()}
    `;

    // Initial partial render
    renderGrid();
    setupEventListeners();
}

function renderNavbar() {
    return `
        <nav class="navbar">
            <div class="nav-logo">
                <h1>DISNEY+ CLONE</h1>
            </div>
            <div class="search-container">
                <span class="search-icon">🔍</span>
                <input type="text" class="search-input" placeholder="Search by title, character, or genre" id="search-input">
            </div>
            <div class="user-block">
                <div class="user-avatar"></div>
            </div>
        </nav>
    `;
}

// HERO CAROUSEL LOGIC
let heroInterval;
let activeHeroIndex = 0;
let heroMovies = [];

function startHeroCarousel() {
    clearInterval(heroInterval);
    heroInterval = setInterval(() => {
        nextHero();
    }, 5000); // 5 Seconds auto-rotation
}

// Global exposure for buttons
window.nextHero = nextHero;
window.prevHero = prevHero;

function nextHero() {
    changeHeroSlide(activeHeroIndex + 1);
}

function prevHero() {
    changeHeroSlide(activeHeroIndex - 1);
}

function changeHeroSlide(newIndex) {
    if (heroMovies.length === 0) return;

    // Handle Wrapping
    if (newIndex >= heroMovies.length) newIndex = 0;
    if (newIndex < 0) newIndex = heroMovies.length - 1;

    // DOM Updates
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    // Current slide moves UP (becomes 'prev')
    slides[activeHeroIndex].classList.remove('active');
    slides[activeHeroIndex].classList.add('prev');

    // New slide enters (becomes 'active')
    // We need to ensure the new slide starts from bottom if going next, or top if going prev?
    // For simplicity of the CSS (which just has .prev go up and .active be center), 
    // we simply swap classes. To make it perfect 2-way might require more complex CSS logic.
    // Given the requested "top to bottom" style, let's reset the 'prev' class to avoid clutter.

    // Clean up old 'prev' classes from others
    slides.forEach((s, i) => {
        if (i !== activeHeroIndex && i !== newIndex) {
            s.classList.remove('active', 'prev');
        }
    });

    // Animate
    setTimeout(() => {
        slides[newIndex].classList.remove('prev');
        slides[newIndex].classList.add('active');
    }, 50); // Small delay to allow CSS to pick up position if needed? 
    // Actually, with the CSS I wrote: .active is translateY(0), default is translateY(100%), .prev is translateY(-100%)
    // This creates a flow from Bottom -> Center -> Top.

    activeHeroIndex = newIndex;

    // Restart timer on manual interaction
    clearInterval(heroInterval);
    startHeroCarousel();
}


function renderHero() {
    // 1. Get 5 Random Movies
    // If we have enough movies, pick random. If not, take first 5.
    if (!state.allMovies || state.allMovies.length === 0) return '';

    // Shuffle copy
    const shuffled = [...state.allMovies].sort(() => 0.5 - Math.random());
    heroMovies = shuffled.slice(0, 5);
    activeHeroIndex = 0;

    // Start Auto Play
    setTimeout(startHeroCarousel, 100);

    return `
        <div class="hero-slider">
            ${heroMovies.map((movie, index) => `
                <div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${movie.backdrop_url || movie.poster_url}')">
                    <div class="hero-content">
                        <div class="hero-logo">${movie.title}</div>
                        <p class="hero-desc">${movie.synopsis}</p>
                        <button class="btn-play" onclick="window.openDetail(${movie.id})">WATCH NOW</button>
                    </div>
                </div>
            `).join('')}
            
            <div class="hero-controls">
                <button class="control-btn" onclick="window.prevHero()">
                    <!-- Up Arrow -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 15L12 9L6 15" />
                    </svg>
                </button>
                <button class="control-btn" onclick="window.nextHero()">
                    <!-- Down Arrow -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9L12 15L18 9" />
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function renderFranchiseNav() {
    const brands = [
        { id: 'disney', label: 'Disney' },
        { id: 'pixar', label: 'Pixar' },
        { id: 'marvel', label: 'Marvel' },
        { id: 'starwars', label: 'Star Wars' },
        { id: 'natgeo', label: 'National Geographic' }
    ];

    return `
        <div class="franchise-nav">
            ${brands.map(brand => `
                <div class="franchise-card" data-brand="${brand.id}" onclick="window.filterByFranchise('${brand.id}')">
                    <div class="franchise-logo">${brand.label}</div>
                    <!-- Could add video hover background here -->
                </div>
            `).join('')}
        </div>
    `;
}

function renderFilters() {
    // Extract unique categories
    const categories = state.allMovies ? [...new Set(state.allMovies.map(m => m.category))].filter(Boolean) : [];

    return `
        <div class="filter-bar">
            <div class="filter-chip active" onclick="window.clearFilters()">All</div>
            ${categories.map(cat => `
                <div class="filter-chip" data-category="${cat}" onclick="window.filterByCategory('${cat}')">${cat}</div>
            `).join('')}
        </div>
    `;
}

function renderGrid() {
    const container = document.getElementById("movies-container");
    if (!container) return;

    if (!state.filteredMovies || state.filteredMovies.length === 0) {
        container.innerHTML = `<div style="padding:40px; text-align:center; color:#666;">No movies found.</div>`;
        return;
    }

    container.innerHTML = `
        <h2 class="section-title">
            ${state.filters.franchise ? state.filters.franchise.toUpperCase() : 'Recommended For You'}
        </h2>
        <div class="movies-grid">
            ${state.filteredMovies.map(movie => `
                <div class="movie-card" onclick="window.openDetail(${movie.id})">
                    <img src="${movie.poster_url}" alt="${movie.title}" loading="lazy">
                </div>
            `).join('')}
        </div>
    `;
}

function renderModal() {
    return `
        <div class="modal-overlay" id="detail-modal" onclick="window.closeDetail(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="window.closeDetail(event)">×</button>
                <div id="modal-inner">
                    <!-- Dynamic Content -->
                </div>
            </div>
        </div>
    `;
}

function updateUIState() {
    // Update active classes on filters
    document.querySelectorAll('.filter-chip').forEach(el => {
        if (el.dataset.category === state.filters.category) {
            el.classList.add('active');
        } else if (!state.filters.category && el.textContent === 'All') {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update franchises
    document.querySelectorAll('.franchise-card').forEach(el => {
        if (el.dataset.brand === state.filters.franchise) {
            el.style.borderColor = '#fff';
            el.style.transform = 'scale(1.05)';
        } else {
            el.style.borderColor = 'rgba(255,255,255,0.1)';
            el.style.transform = '';
        }
    });
}


// ---------------------------------------------------------
// EVENTS & GLOBAL EXPORTS
// ---------------------------------------------------------

function setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    let timeout;
    searchInput?.addEventListener("input", (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            state.filters.search = e.target.value;
            applyFilters();
        }, 300);
    });
}

// Expose functions to window for HTML onclick handlers
window.filterByFranchise = (brand) => {
    setFilter('franchise', brand);
};

window.filterByCategory = (cat) => {
    setFilter('category', cat);
};

window.clearFilters = () => {
    state.filters.franchise = null;
    state.filters.category = null;
    state.filters.search = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    applyFilters();
    updateUIState();
};

window.openDetail = (id) => {
    const movie = state.allMovies.find(m => m.id === id);
    if (!movie) return;

    const modal = document.getElementById("detail-modal");
    const inner = document.getElementById("modal-inner");

    inner.innerHTML = `
        <div class="modal-header" style="background-image: url('${movie.backdrop_url || movie.poster_url}')"></div>
        <div class="modal-body">
            <h2 class="modal-title">${movie.title}</h2>
            <div class="modal-meta">
                <span>${movie.year}</span>
                <span>•</span>
                <span>${movie.category}</span>
                <span>•</span>
                <span>⭐ ${movie.rating}</span>
            </div>
            <p class="modal-description">${movie.synopsis}</p>
            <button class="btn-play">PLAY MOVIE</button>
        </div>
    `;

    modal.classList.add("open");
};

window.closeDetail = (e) => {
    const modal = document.getElementById("detail-modal");
    modal.classList.remove("open");
};

// Start
init();
