<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Profile - Community Skills Exchange</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <i class="fas fa-handshake"></i>
            <span>SkillShare Community</span>
        </div>
    </nav>

    <main class="profile-creation">
        <div class="container">
            <h1 class="animate__animated animate__fadeIn">Create Your Profile</h1>
            
            <form id="profileForm" class="profile-form animate__animated animate__fadeInUp">
                <div class="form-section personal-info">
                    <h2>Personal Information</h2>
                    
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email ID</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                </div>

                <div class="form-section skills-section">
                    <h2>Skills Information</h2>
                    <div id="skillsList">
                        <div class="skill-entry">
                            <div class="form-group">
                                <label>Skill Name</label>
                                <input type="text" name="skills[]" required>
                            </div>
                            <div class="form-group">
                                <label>Skill Level</label>
                                <select name="skillLevels[]" required>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                            <button type="button" class="remove-skill" hidden>
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <button type="button" id="addSkill" class="btn-secondary">
                        <i class="fas fa-plus"></i> Add Another Skill
                    </button>
                </div>

                <div class="form-section location-section">
                    <h2>Location Information</h2>
                    
                    <div class="form-group">
                        <label for="address">Address</label>
                        <textarea id="address" name="address" required></textarea>
                    </div>

                    <div class="form-group">
                        <label>Select Location on Map</label>
                        <div id="map" class="map-container"></div>
                        <input type="hidden" id="latitude" name="latitude">
                        <input type="hidden" id="longitude" name="longitude">
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-primary create-profile">
                        Create Profile
                    </button>
                </div>
            </form>
        </div>
    </main>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="assets/js/map.js"></script>
</body>
</html>