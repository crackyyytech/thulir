// Volunteer Registration JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const volunteerForm = document.getElementById('volunteerForm');
    
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const skills = formData.getAll('skills');
            
            if (skills.length === 0) {
                alert('Please select at least one area of interest.');
                return;
            }
            
            const volunteerData = {
                name: formData.get('volName'),
                email: formData.get('volEmail'),
                phone: formData.get('volPhone'),
                address: formData.get('volAddress'),
                age: formData.get('volAge'),
                occupation: formData.get('volOccupation'),
                skills: skills,
                availability: formData.get('volAvailability'),
                hours: formData.get('volHours'),
                experience: formData.get('volExperience'),
                motivation: formData.get('volMotivation')
            };
            
            // Validate required fields
            if (!volunteerData.name || !volunteerData.email || !volunteerData.phone || 
                !volunteerData.availability || !volunteerData.motivation) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(volunteerData.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Phone validation
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(volunteerData.phone)) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }
            
            // Submit to backend
            submitVolunteerApplication(volunteerData);
        });
    }
});

// Submit volunteer application
async function submitVolunteerApplication(data) {
    // Show loading state
    const submitBtn = document.querySelector('#volunteerForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
        // In production, send to your backend
        // const response = await fetch('/api/volunteer/register', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        
        // For now, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showVolunteerSuccess(data);
        
        // Reset form
        document.getElementById('volunteerForm').reset();
        
    } catch (error) {
        console.error('Error submitting application:', error);
        alert('Error submitting application. Please try again or contact us directly.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Show success message
function showVolunteerSuccess(data) {
    const successHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; color: #25D366; margin-bottom: 1rem;">✓</div>
            <h2 style="color: var(--primary-blue); margin-bottom: 1rem;">Application Received!</h2>
            <p style="font-size: 1.125rem; margin-bottom: 1rem;">Thank you, ${data.name}!</p>
            <p style="color: var(--gray); margin-bottom: 2rem;">
                We have received your volunteer application. Our team will review it and contact you within 2-3 business days.
            </p>
            <p style="color: var(--gray); margin-bottom: 2rem; font-size: 0.875rem;">
                A confirmation email has been sent to ${data.email}
            </p>
            <div style="margin-top: 2rem;">
                <a href="index.html" class="btn btn-primary">Return to Home</a>
            </div>
        </div>
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'volunteer-success-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    `;
    
    content.innerHTML = successHTML;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--gray);
        cursor: pointer;
        line-height: 1;
    `;
    closeBtn.addEventListener('click', () => modal.remove());
    content.style.position = 'relative';
    content.appendChild(closeBtn);
}
