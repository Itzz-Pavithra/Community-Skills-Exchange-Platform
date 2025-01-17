<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Community Skills Exchange</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <i class="fas fa-handshake"></i>
            <span>SkillShare Community</span>
        </div>
        <div class="nav-links">
            <a href="#" class="active">Dashboard</a>
            <a href="#" id="profileLink">My Profile</a>
            <a href="#" id="logoutBtn">Logout</a>
        </div>
    </nav>

    <main class="dashboard">
        <div class="container">
            <div class="dashboard-header animate__animated animate__fadeIn">
                <h1>Welcome, <span id="userName">User</span>!</h1>
                <p class="last-login">Last login: <span id="lastLoginTime">Loading...</span></p>
            </div>

            <div class="dashboard-grid">
                <!-- Stats Cards -->
                <div class="stats-section animate__animated animate__fadeInUp">
                    <div class="stats-card">
                        <i class="fas fa-users"></i>
                        <div class="stats-info">
                            <h3>Total Requests</h3>
                            <p id="totalRequests">0</p>
                        </div>
                    </div>
                    <div class="stats-card">
                        <i class="fas fa-check-circle"></i>
                        <div class="stats-info">
                            <h3>Completed Exchanges</h3>
                            <p id="completedExchanges">0</p>
                        </div>
                    </div>
                    <div class="stats-card">
                        <i class="fas fa-star"></i>
                        <div class="stats-info">
                            <h3>Skills Offered</h3>
                            <p id="skillsOffered">0</p>
                        </div>
                    </div>
                </div>

                <!-- Chart Section -->
                <div class="chart-section animate__animated animate__fadeInUp">
                    <div class="chart-card">
                        <h2>Skills Request Distribution</h2>
                        <canvas id="skillsChart"></canvas>
                    </div>
                </div>

                <!-- Search Section -->
                <div class="search-section animate__animated animate__fadeInUp">
                    <h2>Find Skills</h2>
                    <div class="search-container">
                        <div class="search-input">
                            <input type="text" id="searchInput" placeholder="Search for skills or location...">
                            <button id="searchBtn">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        <div class="search-filters">
                            <select id="filterSkillLevel">
                                <option value="">Any Skill Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                            </select>
                            <select id="filterDistance">
                                <option value="">Any Distance</option>
                                <option value="5">Within 5 km</option>
                                <option value="10">Within 10 km</option>
                                <option value="20">Within 20 km</option>
                                <option value="50">Within 50 km</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Search Results -->
                <div id="searchResults" class="search-results animate__animated animate__fadeInUp">
                    <!-- Profile cards will be dynamically inserted here -->
                </div>
            </div>
        </div>
    </main>

    <!-- Profile Card Template -->
    <template id="profileCardTemplate">
        <div class="profile-card animate__animated animate__fadeIn">
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="profile-info">
                    <h3 class="profile-name"></h3>
                    <p class="profile-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span></span>
                    </p>
                </div>
            </div>
            <div class="profile-skills">
                <!-- Skills will be dynamically inserted here -->
            </div>
            <div class="profile-actions">
                <button class="btn-contact">
                    <i class="fas fa-envelope"></i>
                    Contact
                </button>
                <button class="btn-view-profile">
                    <i class="fas fa-user"></i>
                    View Profile
                </button>
            </div>
        </div>
    </template>

    <script src="assets/js/dashboard.js"></script>
</body>
</html>