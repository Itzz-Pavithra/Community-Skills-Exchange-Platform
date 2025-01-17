// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize all components
    await initializeDashboard();
    initializeSearchHandlers();
    initializeContactHandlers();
});

// Main dashboard initialization
async function initializeDashboard() {
    try {
        showLoadingState(true);
        await Promise.all([
            loadUserData(),
            loadUserStats(),
            loadSkillsAnalytics()
        ]);
        showLoadingState(false);
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showError('Error loading dashboard. Please refresh the page.');
        showLoadingState(false);
    }
}

// Load user's basic data
async function loadUserData() {
    try {
        const response = await fetch('/api/users/current');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();

        // Update UI elements
        document.getElementById('userName').textContent = userData.username;
        document.getElementById('lastLoginTime').textContent = 
            new Date(userData.lastLogin).toLocaleString();
        
        // Store user data for later use
        window.currentUser = {
            id: userData._id,
            username: userData.username
        };
    } catch (error) {
        console.error('Error loading user data:', error);
        throw error;
    }
}

// Load user statistics
async function loadUserStats() {
    try {
        const response = await fetch('/api/users/stats');
        if (!response.ok) throw new Error('Failed to fetch user stats');
        const stats = await response.json();

        // Update stats display
        document.getElementById('totalRequests').textContent = stats.totalRequests;
        document.getElementById('completedExchanges').textContent = stats.completedExchanges;
        document.getElementById('skillsOffered').textContent = stats.skillsOffered;

        // Store stats for chart visibility decision
        window.userStats = stats;
    } catch (error) {
        console.error('Error loading user stats:', error);
        throw error;
    }
}

// Load and display skills analytics
async function loadSkillsAnalytics() {
    const chartSection = document.querySelector('.chart-section');
    
    // Only proceed if user has skills and exchanges
    if (!window.userStats || 
        window.userStats.skillsOffered === 0 || 
        window.userStats.completedExchanges === 0) {
        chartSection.style.display = 'none';
        return;
    }

    try {
        const response = await fetch('/api/users/analytics/skills');
        if (!response.ok) throw new Error('Failed to fetch skills analytics');
        const analyticsData = await response.json();

        if (analyticsData.length === 0) {
            chartSection.style.display = 'none';
            return;
        }

        // Create the chart
        const ctx = document.getElementById('skillsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: analyticsData.map(item => item._id),
                datasets: [{
                    data: analyticsData.map(item => item.count),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20
                        }
                    },
                    title: {
                        display: true,
                        text: 'Skills Distribution',
                        padding: 20
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating skills chart:', error);
        chartSection.style.display = 'none';
    }
}

// Initialize search functionality
function initializeSearchHandlers() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const filterSkillLevel = document.getElementById('filterSkillLevel');
    const filterDistance = document.getElementById('filterDistance');

    // Search on button click
    searchBtn.addEventListener('click', performSearch);

    // Search on enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Auto-search on filter change
    filterSkillLevel.addEventListener('change', performSearch);
    filterDistance.addEventListener('change', performSearch);
}

// Perform search with current filters
async function performSearch() {
    const searchResults = document.getElementById('searchResults');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Searching...';
    
    try {
        searchResults.innerHTML = '';
        searchResults.appendChild(loadingIndicator);

        const query = document.getElementById('searchInput').value;
        const skillLevel = document.getElementById('filterSkillLevel').value;
        const distance = document.getElementById('filterDistance').value;

        // Get user's location
        const position = await getUserLocation();
        
        const searchParams = new URLSearchParams({
            query,
            skillLevel,
            distance,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

        const response = await fetch(`/api/users/search?${searchParams}`);
        if (!response.ok) throw new Error('Search failed');
        
        const results = await response.json();
        displaySearchResults(results);

    } catch (error) {
        console.error('Search error:', error);
        showError('Error performing search. Please try again.');
    } finally {
        loadingIndicator.remove();
    }
}

// Display search results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No matches found</p>';
        return;
    }

    const template = document.getElementById('profileCardTemplate');
    
    results.forEach(result => {
        const card = template.content.cloneNode(true);
        
        // Set user info
        card.querySelector('.profile-name').textContent = result.username;
        card.querySelector('.profile-location span').textContent = 
            `${result.address}${result.distance ? ` (${result.distance}km away)` : ''}`;
        
        // Add skills
        const skillsContainer = card.querySelector('.profile-skills');
        result.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = `${skill.name} (${skill.level})`;
            skillsContainer.appendChild(skillTag);
        });

        // Set up contact button
        const contactBtn = card.querySelector('.btn-contact');
        contactBtn.addEventListener('click', () => initiateContact(result.id));

        searchResults.appendChild(card);
    });
}

// Initialize contact functionality
function initializeContactHandlers() {
    // Contact modal elements setup would go here
    // Add event listeners for contact form submission
}

// Initiate contact with another user
async function initiateContact(userId) {
    try {
        const response = await fetch('/api/users/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });

        if (!response.ok) throw new Error('Contact request failed');

        showSuccess('Contact request sent successfully!');
    } catch (error) {
        console.error('Contact error:', error);
        showError('Error sending contact request. Please try again.');
    }
}

// Utility Functions
function showLoadingState(isLoading) {
    // Implement loading state UI
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = isLoading ? 'flex' : 'none';
    }
}

function showError(message) {
    // Implement error message display
    alert(message); // Replace with better UI
}

function showSuccess(message) {
    // Implement success message display
    alert(message); // Replace with better UI
}

async function getUserLocation() {
    try {
        return await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    } catch (error) {
        console.error('Location error:', error);
        throw new Error('Could not get your location. Please enable location services.');
    }
}