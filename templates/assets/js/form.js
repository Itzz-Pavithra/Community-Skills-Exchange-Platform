document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);

    fetch('save_profile.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            alert(data.message);
            // Redirect to profile page
            window.location.href = `profile.php?id=${data.userId}`;
        } else {
            // Show error message
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving the profile. Please try again.');
    });
});