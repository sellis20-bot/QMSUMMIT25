/**
 * NCCU Quality Matters Summit 2025 - Registration System
 * Handles form validation, session selection, and confirmation generation
 */

// Registration state management
const Registration = {
    data: {
        firstName: '',
        lastName: '',
        email: '',
        institution: '',
        phone: '',
        lightningTalks: [],
        breakoutSessions: []
    },
    
    validation: {
        errors: {},
        isValid: false
    }
};

/**
 * Update registration data based on form inputs and session selections
 */
function updateRegistrationData() {
    try {
        // Update personal information
        Registration.data.firstName = document.getElementById('firstName')?.value.trim() || '';
        Registration.data.lastName = document.getElementById('lastName')?.value.trim() || '';
        Registration.data.email = document.getElementById('email')?.value.trim() || '';
        Registration.data.institution = document.getElementById('institution')?.value.trim() || '';
        Registration.data.phone = document.getElementById('phone')?.value.trim() || '';
        
        // Update session selections
        Registration.data.lightningTalks = [];
        Registration.data.breakoutSessions = [];
        
        // Collect lightning talk selections
        document.querySelectorAll('input[id^="lt"]').forEach(checkbox => {
            if (checkbox.checked) {
                Registration.data.lightningTalks.push(checkbox.id);
            }
        });
        
        // Collect breakout session selections
        document.querySelectorAll('input[id^="bs"]').forEach(checkbox => {
            if (checkbox.checked) {
                Registration.data.breakoutSessions.push(checkbox.id);
            }
        });
        
        console.log('Registration data updated:', Registration.data);
        
    } catch (error) {
        console.error('Error updating registration data:', error);
    }
}

/**
 * Validate registration form
 */
function validateRegistration() {
    Registration.validation.errors = {};
    let isValid = true;
    
    // Validate required fields
    const requiredFields = {
        firstName: 'First name is required',
        lastName: 'Last name is required',
        email: 'Email address is required'
    };
    
    Object.entries(requiredFields).forEach(([field, message]) => {
        const value = Registration.data[field];
        if (!value || value.trim() === '') {
            Registration.validation.errors[field] = message;
            isValid = false;
        }
    });
    
    // Validate email format
    if (Registration.data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Registration.data.email)) {
            Registration.validation.errors.email = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Validate phone number format (if provided)
    if (Registration.data.phone) {
        const phoneRegex = /^[\d\s\-\(\)\+\.]{10,}$/;
        if (!phoneRegex.test(Registration.data.phone)) {
            Registration.validation.errors.phone = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    
    Registration.validation.isValid = isValid;
    return isValid;
}

/**
 * Display validation errors in the form
 */
function displayValidationErrors() {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
    
    // Display new errors
    Object.entries(Registration.validation.errors).forEach(([field, message]) => {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.setAttribute('aria-describedby', `${field}-error`);
        }
    });
}

/**
 * Clear validation errors
 */
function clearValidationErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
    
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.remove('error');
        input.removeAttribute('aria-describedby');
    });
}

/**
 * Submit registration form
 */
function submitRegistration() {
    try {
        console.log('Submitting registration...');
        
        // Update registration data
        updateRegistrationData();
        
        // Validate form
        if (!validateRegistration()) {
            displayValidationErrors();
            
            // Scroll to first error
            const firstError = document.querySelector('.error-message.show');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Announce validation errors to screen readers
            announceValidationErrors();
            return;
        }
        
        // Clear any existing errors
        clearValidationErrors();
        
        // Generate confirmation
        displayConfirmation();
        
        // Navigate to confirmation page
        showPage('confirmation');
        
        // Announce success
        announceRegistrationSuccess();
        
        console.log('Registration submitted successfully');
        
    } catch (error) {
        console.error('Registration submission error:', error);
        showError('Registration failed. Please try again.');
    }
}

/**
 * Display registration confirmation
 */
function displayConfirmation() {
    const detailsDiv = document.getElementById('confirmationDetails');
    const sessionsDiv = document.getElementById('selectedSessions');
    
    if (!detailsDiv || !sessionsDiv) {
        console.error('Confirmation elements not found');
        return;
    }
    
    // Generate registration ID
    const registrationId = `QM-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Display personal details
    detailsDiv.innerHTML = `
        <div class="summary-row">
            <strong>Name:</strong>
            <span>${Registration.data.firstName} ${Registration.data.lastName}</span>
        </div>
        <div class="summary-row">
            <strong>Email:</strong>
            <span>${Registration.data.email}</span>
        </div>
        ${Registration.data.institution ? `
            <div class="summary-row">
                <strong>Institution:</strong>
                <span>${Registration.data.institution}</span>
            </div>
        ` : ''}
        ${Registration.data.phone ? `
            <div class="summary-row">
                <strong>Phone:</strong>
                <span>${Registration.data.phone}</span>
            </div>
        ` : ''}
        <div class="summary-row">
            <strong>Registration ID:</strong>
            <span>${registrationId}</span>
        </div>
        <div class="summary-row">
            <strong>Registration Date:</strong>
            <span>${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</span>
        </div>
    `;
    
    // Display selected sessions
    let sessionsHTML = '';
    
    if (Registration.data.lightningTalks.length > 0) {
        sessionsHTML += '<h4 style="margin-top: 20px; color: #8B2635;">Selected Lightning Talks:</h4>';
        Registration.data.lightningTalks.forEach(sessionId => {
            const session = findSessionById(sessionId);
            if (session) {
                sessionsHTML += `
                    <div class="selected-session">
                        <strong>${session.title}</strong><br>
                        <span style="color: #666;">${session.time} - ${session.room}</span><br>
                        <em>Presenter: ${session.presenter}</em>
                    </div>
                `;
            }
        });
    }
    
    if (Registration.data.breakoutSessions.length > 0) {
        sessionsHTML += '<h4 style="margin-top: 20px; color: #8B2635;">Selected Breakout Sessions:</h4>';
        Registration.data.breakoutSessions.forEach(sessionId => {
            const session = findSessionById(sessionId);
            if (session) {
                sessionsHTML += `
                    <div class="selected-session">
                        <strong>${session.title}</strong><br>
                        <span style="color: #666;">${session.time} - ${session.room}</span><br>
                        <em>Presenter: ${session.presenter}</em>
                    </div>
                `;
            }
        });
    }
    
    if (Registration.data.lightningTalks.length === 0 && Registration.data.breakoutSessions.length === 0) {
        sessionsHTML = `
            <div style="text-align: center; padding: 30px; background: #f8f9fa; border-radius: 8px; margin-top: 20px;">
                <p style="color: #666; font-style: italic; margin: 0;">
                    No specific sessions selected. You are registered for general attendance and can participate in any available sessions.
                </p>
            </div>
        `;
    }
    
    sessionsDiv.innerHTML = sessionsHTML;
    
    // Store registration ID for download
    Registration.data.registrationId = registrationId;
}

/**
 * Find session by ID
 */
function findSessionById(sessionId) {
    if (App.sessionData) {
        const allSessions = [
            ...App.sessionData.lightningTalks,
            ...App.sessionData.breakoutSessions
        ];
        return allSessions.find(session => session.id === sessionId);
    }
    return null;
}

/**
 * Download registration confirmation
 */
function downloadConfirmation() {
    try {
        const confirmationHTML = generateConfirmationHTML();
        downloadHTMLFile(confirmationHTML, 'QM_Summit_2025_Registration_Confirmation.html');
        
        // Track download for analytics (if needed)
        console.log('Confirmation downloaded:', Registration.data.registrationId);
        
    } catch (error) {
        console.error('Download error:', error);
        showError('Unable to download confirmation. Please try printing instead.');
    }
}

/**
 * Generate confirmation HTML for download
 */
function generateConfirmationHTML() {
    const selectedLightning = Registration.data.lightningTalks
        .map(id => findSessionById(id))
        .filter(session => session !== null);
        
    const selectedBreakouts = Registration.data.breakoutSessions
        .map(id => findSessionById(id))
        .filter(session => session !== null);
        
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QM Summit 2025 Registration Confirmation</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: white;
        }
        .header { 
            background: linear-gradient(135deg, #8B2635, #A73145); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 8px; 
            margin-bottom: 30px;
        }
        .header h1 { 
            margin: 0 0 10px 0; 
            font-size: 2rem; 
        }
        .header h2 { 
            margin: 0 0 20px 0; 
            font-weight: 300; 
            font-size: 1.2rem; 
        }
        .event-details { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
            border-left: 4px solid #8B2635;
        }
        .attendee-info { 
            background: white; 
            padding: 25px; 
            border: 2px solid #8B2635; 
            border-radius: 8px; 
            margin: 20px 0;
        }
        .session-section { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
        }
        .session-item { 
            background: white; 
            padding: 15px; 
            margin: 10px 0; 
            border-left: 4px solid #8B2635; 
            border-radius: 4px;
        }
        .footer { 
            background: #8B2635; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            border-radius: 8px; 
            margin-top: 30px;
        }
        .reg-id { 
            text-align: center; 
            font-size: 1.2rem; 
            font-weight: bold; 
            color: #8B2635; 
            margin: 20px 0;
            padding: 15px;
            background: #f0f8ff;
            border-radius: 8px;
        }
        .important-info {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        @media print {
            body { margin: 0; padding: 10px; }
            .header { background: #8B2635 !important; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>UNC Quality Matters Summit 2025</h1>
        <h2>Registration Confirmation</h2>
        <p>Empowering Educators: Transforming Teaching through Quality Matters</p>
    </div>

    <div class="reg-id">
        Registration ID: ${Registration.data.registrationId}
    </div>

    <div class="event-details">
        <h3 style="color: #8B2635; margin-top: 0;">Event Details</h3>
        <p><strong>Address:</strong> 500 Nelson St, Durham, NC 27707</p>
    </div>

    <div class="attendee-info">
        <h3 style="color: #8B2635; margin-top: 0;">Attendee Information</h3>
        <p><strong>Name:</strong> ${Registration.data.firstName} ${Registration.data.lastName}</p>
        <p><strong>Email:</strong> ${Registration.data.email}</p>
        ${Registration.data.institution ? `<p><strong>Institution:</strong> ${Registration.data.institution}</p>` : ''}
        ${Registration.data.phone ? `<p><strong>Phone:</strong> ${Registration.data.phone}</p>` : ''}
        <p><strong>Registration Date:</strong> ${currentDate}</p>
    </div>

    ${selectedLightning.length > 0 ? `
    <div class="session-section">
        <h3 style="color: #8B2635; margin-top: 0;">Selected Lightning Talks (10:30-11:45 AM)</h3>
        ${selectedLightning.map(session => `
            <div class="session-item">
                <strong>${session.title}</strong><br>
                <span style="color: #666;">${session.time} | ${session.room}</span><br>
                <em>Presenter: ${session.presenter}</em>
            </div>
        `).join('')}
    </div>` : ''}

    ${selectedBreakouts.length > 0 ? `
    <div class="session-section">
        <h3 style="color: #8B2635; margin-top: 0;">Selected Breakout Sessions (1:30-4:05 PM)</h3>
        ${selectedBreakouts.map(session => `
            <div class="session-item">
                <strong>${session.title}</strong><br>
                <span style="color: #666;">${session.time} | ${session.room}</span><br>
                <em>Presenter: ${session.presenter}</em>
            </div>
        `).join('')}
    </div>` : ''}

    <div class="important-info">
        <h3 style="color: #8B2635; margin-top: 0;">Important Information</h3>
        <p><strong>Check-in:</strong> Please arrive by 9:00 AM for continental breakfast and check-in.</p>
        <p><strong>Bring this confirmation:</strong> Please bring this confirmation (printed or on your mobile device) for check-in.</p>
        <p><strong>Session flexibility:</strong> While you've registered for specific sessions, you may attend other available sessions if space permits.</p>
    </div>

    <div class="session-section">
        <h3 style="color: #8B2635; margin-top: 0;">Parking Information</h3>
        <p><strong>Recommended: Latham Parking Deck</strong></p>
        <p>Address: 701 E Lawson St, Durham, NC 27701</p>
        <p>Free shuttle service runs every 15 minutes to campus</p>
        <p><strong>Alternative: NCCU Student Center Parking</strong></p>
        <p>Reserved for faculty/staff with valid passes (arrive 30-45 minutes early)</p>
        <p><strong>Payment:</strong> Visitors can use metered parking (ParkMobile accepted at Latham Deck)</p>
    </div>

    <div class="footer">
        <h4>Contact Information</h4>
        <p><strong>Event Coordinators:</strong></p>
        <p>Dr. Larrisha McGill-Youngblood: <a href="mailto:lmcgilly@nccu.edu" style="color: white;">lmcgilly@nccu.edu</a></p>
        <p>Dr. Charlotte Russell Cox: <a href="mailto:ccox33@nccu.edu" style="color: white;">ccox33@nccu.edu</a></p>
        <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.9;">
            Generated: ${currentDate} | Registration ID: ${Registration.data.registrationId}
        </p>
    </div>
</body>
</html>`;
}

/**
 * Download HTML file
 */
function downloadHTMLFile(htmlContent, filename) {
    try {
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
}

/**
 * Reset registration form
 */
function resetRegistration() {
    try {
        // Reset registration data
        Registration.data = {
            firstName: '',
            lastName: '',
            email: '',
            institution: '',
            phone: '',
            lightningTalks: [],
            breakoutSessions: [],
            registrationId: ''
        };
        
        // Clear form fields
        const formFields = ['firstName', 'lastName', 'email', 'institution', 'phone'];
        formFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.value = '';
            }
        });
        
        // Clear session selections
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const sessionCards = document.querySelectorAll('.session-card');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        sessionCards.forEach(card => {
            card.classList.remove('selected');
            card.setAttribute('aria-pressed', 'false');
        });
        
        // Clear validation errors
        clearValidationErrors();
        
        // Navigate to registration page
        showPage('register');
        
        console.log('Registration form reset');
        
    } catch (error) {
        console.error('Error resetting registration:', error);
        showError('Unable to reset form. Please refresh the page.');
    }
}

/**
 * Announce validation errors to screen readers
 */
function announceValidationErrors() {
    const errorCount = Object.keys(Registration.validation.errors).length;
    const announcement = document.createElement('div');
    
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Registration form has ${errorCount} error${errorCount !== 1 ? 's' : ''}. Please correct the highlighted fields.`;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 3000);
}

/**
 * Announce registration success to screen readers
 */
function announceRegistrationSuccess() {
    const announcement = document.createElement('div');
    
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Registration completed successfully. You will receive a confirmation email shortly.';
    
    document.body.appendChild(announcement);
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 3000);
}

/**
 * Setup real-time form validation
 */
function setupFormValidation() {
    const formFields = ['firstName', 'lastName', 'email', 'institution', 'phone'];
    
    formFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            // Clear error on input
            field.addEventListener('input', function() {
                const errorElement = document.getElementById(`${fieldName}-error`);
                if (errorElement && errorElement.classList.contains('show')) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('show');
                    field.classList.remove('error');
                    field.removeAttribute('aria-describedby');
                }
            });
            
            // Validate on blur
            field.addEventListener('blur', function() {
                updateRegistrationData();
                validateSingleField(fieldName);
            });
        }
    });
}

/**
 * Validate a single form field
 */
function validateSingleField(fieldName) {
    const value = Registration.data[fieldName];
    let errorMessage = '';
    
    // Required field validation
    const requiredFields = ['firstName', 'lastName', 'email'];
    if (requiredFields.includes(fieldName) && (!value || value.trim() === '')) {
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
    }
    
    // Email format validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone format validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\d\s\-\(\)\+\.]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Display error if any
    if (errorMessage) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.setAttribute('aria-describedby', `${fieldName}-error`);
        }
    }
}

/**
 * Initialize registration system
 */
function initializeRegistration() {
    try {
        // Setup form validation
        setupFormValidation();
        
        // Setup session selection tracking
        document.addEventListener('change', function(event) {
            if (event.target.type === 'checkbox' && (
                event.target.id.startsWith('lt') || 
                event.target.id.startsWith('bs')
            )) {
                updateRegistrationData();
            }
        });
        
        console.log('Registration system initialized');
        
    } catch (error) {
        console.error('Failed to initialize registration system:', error);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeRegistration();
});

// Expose functions globally for HTML onclick handlers
window.submitRegistration = submitRegistration;
window.downloadConfirmation = downloadConfirmation;
window.resetRegistration = resetRegistration;
window.updateRegistrationData = updateRegistrationData;Date:</strong> Friday, September 26, 2025</p>
        <p><strong>Time:</strong> 9:00 AM - 4:30 PM</p>
        <p><strong>Location:</strong> North Carolina Central University Student Center</p>
        <p><strong>