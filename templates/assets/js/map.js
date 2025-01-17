// Map initialization
let map;
let marker;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Try to get user's location
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13);
            setMarker([latitude, longitude]);
        });
    }

    // Handle map clicks
    map.on('click', function(e) {
        setMarker([e.latlng.lat, e.latlng.lng]);
    });

    // Initialize form handlers
    initializeSkillsHandler();
    initializeFormSubmission();
});

function setMarker(latlng) {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker(latlng).addTo(map);
    
    // Update hidden inputs
    document.getElementById('latitude').value = latlng[0];
    document.getElementById('longitude').value = latlng[1];
}

function initializeSkillsHandler() {
    const skillsList = document.getElementById('skillsList');
    const addSkillBtn = document.getElementById('addSkill');

    addSkillBtn.addEventListener('click', function() {
        const skillEntry = document.createElement('div');
        skillEntry.className = 'skill-entry animate__animated animate__fadeIn';
        
        skillEntry.innerHTML = `
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
            <button type="button" class="remove-skill">
                <i class="fas fa-times"></i>
            </button>
        `;

        skillsList.appendChild(skillEntry);
        
        // Show remove button for all skill entries if there's more than one
        if (skillsList.children.length > 1) {
            skillsList.querySelectorAll('.remove-skill').forEach(btn => {
                btn.hidden = false;
            });
        }
    });

    // Handle skill removal
    skillsList.addEventListener('click', function(e) {
        if (e.target.closest('.remove-skill')) {
            const skillEntry = e.target.closest('.skill-entry');
            skillEntry.classList.add('animate__fadeOut');
            
            setTimeout(() => {
                skillEntry.remove();
                // Hide remove buttons if only one skill remains
                if (skillsList.children.length <= 1) {
                    skillsList.querySelector('.remove-skill').hidden = true;
                }
            }, 300);
        }
    });
}

function initializeFormSubmission() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Gather form data
        const formData = new FormData(form);
        const profileData = {
            username: formData.get('username'),
            email: formData.get('email'),
            address: formData.get('address'),
            location: {
                type: 'Point',
                coordinates: [
                    parseFloat(formData.get('longitude')),
                    parseFloat(formData.get('latitude'))
                ]
            },
            skills: Array.from(formData.getAll('skills')).map((skill, index) => ({
                name: skill,
                level: formData.getAll('skillLevels')[index]
            }))
        };

        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                const result = await response.json();
                // Show success message
                showNotification('Profile created successfully!', 'success');
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            } else {
                throw new Error('Profile creation failed');
            }
        } catch (error) {
            showNotification('Error creating profile. Please try again.', 'error');
            console.error('Error:', error);
        }
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type} animate__animated animate__fadeInDown`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.replace('animate__fadeInDown', 'animate__fadeOutUp');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}