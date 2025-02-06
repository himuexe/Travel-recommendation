// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');
const resultsSection = document.getElementById('results');
const recommendationsContainer = document.getElementById('recommendations');

// Store data globally after fetching
let travelData = null;

// Fetch data when page loads
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        travelData = await response.json();
        console.log('Data loaded successfully:', travelData);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load travel recommendations. Please try again later.');
    }
}

// Search functionality
function searchRecommendations() {
    if (!travelData) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }

    let results = [];

    // Search for beaches
    if (searchTerm.includes('beach')) {
        results = travelData.beaches;
    }
    // Search for temples
    else if (searchTerm.includes('temple')) {
        results = travelData.temples;
    }
    // Search for countries
    else if (searchTerm.includes('country') || searchTerm.includes('countries')) {
        // For countries, we need to process cities
        travelData.countries.forEach(country => {
            country.cities.forEach(city => {
                results.push({
                    id: `${country.id}-${city.name}`,
                    name: city.name,
                    imageUrl: city.imageUrl,
                    description: city.description
                });
            });
        });
    }
    // Search by specific country name
    else {
        const matchingCountry = travelData.countries.find(
            country => country.name.toLowerCase().includes(searchTerm)
        );
        if (matchingCountry) {
            results = matchingCountry.cities;
        }
    }

    displayResults(results);
}

// Display results
function displayResults(results) {
    recommendationsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsSection.style.display = 'block';
        recommendationsContainer.innerHTML = '<p class="no-results">No recommendations found. Try searching for beaches, temples, or countries.</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
        `;
        recommendationsContainer.appendChild(card);
    });

    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Reset functionality
function resetSearch() {
    searchInput.value = '';
    resultsSection.style.display = 'none';
    recommendationsContainer.innerHTML = '';
}

// Event listeners
searchBtn.addEventListener('click', searchRecommendations);
resetBtn.addEventListener('click', resetSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchRecommendations();
    }
});

// Initialize data fetch
document.addEventListener('DOMContentLoaded', fetchTravelData);