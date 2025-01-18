document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    const skillsList = document.getElementById('skillsList');
    const addSkillBtn = document.getElementById('addSkill');

    // Handle adding new skill fields
    addSkillBtn.addEventListener('click', function() {
        const skillEntry = document.querySelector('.skill-entry').cloneNode(true);
        const inputs = skillEntry.querySelectorAll('input, select');
        inputs.forEach(input => input.value = '');
        
        const removeBtn = skillEntry.querySelector('.remove-skill');
        removeBtn.hidden = false;
        
        skillsList.appendChild(skillEntry);
    });

    // Handle removing skill fields
    skillsList.addEventListener('click', function(e) {
        if (e.target.closest('.remove-skill')) {
            const skillEntry = e.target.closest('.skill-entry');
            if (skillsList.children.length > 1) {
                skillEntry.remove();
            }
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        try {
            const formData = new FormData(form);
            const response = await fetch('save_profile.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                alert(result.message);
                form.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});