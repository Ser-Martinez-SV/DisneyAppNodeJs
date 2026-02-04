
// app.js - ES Module-like structure

const API_BASE = "/api/movies";
// Note: In local development, this relative path works if backend serves frontend.
// If using live server separately, we might need full URL, but let's assume served together.

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
    try {
        // We fetch ALL movies once for this SPA demo to make filtering instant
        // In a huge real app, we would fetch params from server.
        const res = await fetch(API_BASE);
        const data = await res.json();

        if (data.ok) {
            state.allMovies = data.movies;
            applyFilters();
        } else {
            console.error("API Error:", data);
        }
    } catch (e) {
        console.error("Network Error:", e);
        // Fallback for when API is not reachable (e.g. static opening)
    }
}

// ---------------------------------------------------------
// LOGIC & FILTERING
// ---------------------------------------------------------
function applyFilters() {
    let result = state.allMovies;

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
}

function setFilter(type, value) {
    if (state.filters[type] === value && type !== 'search') {
        // Toggle off if clicking same filter
        state.filters[type] = null;
    } else {
        state.filters[type] = value;
    }

    // If setting a franchise, clear category to avoid empty results? Optional.

    applyFilters();
    renderGrid(); // Re-render just the grid
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

function renderHero() {
    // Get trending movies
    const trending = state.allMovies.filter(m => m.is_trending).slice(0, 3);
    if (trending.length === 0) return '';

    return `
        <div class="hero-slider">
            ${trending.map((movie, index) => `
                <div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${movie.backdrop_url || movie.poster_url}')">
                    <div class="hero-content">
                        <div class="hero-logo">${movie.title}</div>
                        <p class="hero-desc">${movie.synopsis}</p>
                        <button class="btn-play" onclick="window.openDetail(${movie.id})">WATCH NOW</button>
                    </div>
                </div>
            `).join('')}
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
    const categories = [...new Set(state.allMovies.map(m => m.category))].filter(Boolean);

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

    if (state.filteredMovies.length === 0) {
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
    // Search Debounce
    const searchInput = document.getElementById("search-input");
    let timeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            state.filters.search = e.target.value;
            applyFilters();
            renderGrid();
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
    document.getElementById("search-input").value = "";
    applyFilters();
    renderGrid();
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
