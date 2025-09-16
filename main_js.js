/**
 * NCCU Quality Matters Summit 2025 - Main Application Logic
 * Core functionality for navigation, modals, and user interface
 */

// Application State
const App = {
    initialized: false,
    currentPage: 'home',
    sessionData: {},
    filteredSpeakers: []
};

/**
 * Initialize the application
 */
function initializeApp() {
    try {
        console.log('Initializing NCCU QM Summit application...');
        
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Initialize session data
        initializeSessionData();
        
        // Populate speakers grid
        populateSpeakersGrid();
        
        // Set up session cards
        setupSessionCards();
        
        // Initialize search functionality
        initializeSearch();
        
        // Set up event listeners
        setupEventListeners();
        
        // Set application as initialized
        App.initialized = true;
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to load the application. Please refresh the page.');
    }
}

/**
 * Hide the loading indicator
 */
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 300);
    }
}

/**
 * Navigation function - switches between pages
 */
function showPage(pageId) {
    try {
        console.log('Navigating to page:', pageId);
        
        // Validate page ID
        const validPages = ['home', 'register', 'speakers', 'confirmation', 'agenda', 'keynote', 'parking', 'survey'];
        if (!validPages.includes(pageId)) {
            throw new Error(`Invalid page ID: ${pageId}`);
        }
        
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
            page.setAttribute('aria-hidden', 'true');
        });
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.setAttribute('aria-hidden', 'false');
            
            // Update current page state
            App.currentPage = pageId;
            
            // Update page title
            updatePageTitle(pageId);
            
            // Focus management for accessibility
            const mainHeading = targetPage.querySelector('h2, h3');
            if (mainHeading) {
                mainHeading.focus();
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } else {
            throw new Error(`Page element not found: ${pageId}`);
        }
    } catch (error) {
        console.error('Navigation error:', error);
        showError('Navigation failed. Please try again.');
    }
}

/**
 * Update page title based on current page
 */
function updatePageTitle(pageId) {
    const titles = {
        home: 'UNC Quality Matters Summit 2025',
        register: 'Registration - UNC QM Summit 2025',
        speakers: 'Speakers - UNC QM Summit 2025',
        confirmation: 'Registration Confirmed - UNC QM Summit 2025',
        agenda: 'Agenda - UNC QM Summit 2025',
        keynote: 'Keynote Speaker - UNC QM Summit 2025',
        parking: 'Parking & Venue - UNC QM Summit 2025',
        survey: 'Survey - UNC QM Summit 2025'
    };
    
    document.title = titles[pageId] || 'UNC Quality Matters Summit 2025';
}

/**
 * Initialize session data structure
 */
function initializeSessionData() {
    App.sessionData = {
        lightningTalks: [
            {
                id: 'lt1',
                title: 'Student Know the Way: Exploring Student Experience in Online Courses',
                time: '10:30-10:45 AM',
                room: 'Room 2128',
                moderator: 'Dr. Erezi Ogbo-Gebhardt',
                presenter: 'Dr. Colleen M. Smith, Ed.D',
                presenterKey: 'colleen_smith',
                description: 'Exploring student perspectives and experiences in online learning environments.'
            },
            {
                id: 'lt2',
                title: 'Statistically Speaking: How BSS 3600 is Rethinking Learning Support',
                time: '10:30-10:45 AM',
                room: 'Room 2201',
                moderator: 'Dr. Penny Carroll',
                presenter: 'Arlena Nwosu, MPA',
                presenterKey: 'arlena_nwosu',
                description: 'Innovative approaches to supporting student success in behavioral and social sciences.'
            },
            {
                id: 'lt3',
                title: 'Collaboration Success with Quality Matters and Student Wellbeing',
                time: '10:30-10:45 AM',
                room: 'Room 2211',
                moderator: 'Kima Ellis',
                presenter: 'Amy Olsen & Brittany Denning',
                presenterKeys: ['amy_olsen', 'brittany_denning'],
                description: 'Integrating Quality Matters standards with student wellness initiatives.'
            },
            {
                id: 'lt4',
                title: 'Faculty Fellows Panel Discussion',
                time: '10:30-11:45 AM',
                room: 'Room 2319',
                presenter: 'Panel: Dr. Pia Anderson Duncan, Jamie Ronan, Dr. Dan Fisher',
                presenterKeys: ['pia_duncan', 'jamie_ronan', 'dan_fisher'],
                description: 'Distinguished faculty fellows sharing insights on quality course design and implementation.'
            }
        ],
        breakoutSessions: [
            {
                id: 'bs1',
                title: 'Mastering the Art of Prompting & Claude Artifacts for Impact',
                time: '1:30-2:15 PM',
                room: 'Room 2319 - AI Track',
                moderator: 'Dr. Marquita Lyons-Smith',
                presenter: 'Alanna Cates & Kima Ellis',
                presenterKeys: ['alanna_cates', 'kima_ellis'],
                description: 'Advanced techniques for AI integration in educational design and course development.'
            },
            {
                id: 'bs2',
                title: 'QM Standards to Optimize Meaningful Learning',
                time: '1:30-2:15 PM',
                room: 'Room 2211 - Course Design',
                moderator: 'Dr. Mijon Knight',
                presenter: 'To Be Announced',
                description: 'Implementing Quality Matters standards for enhanced learning outcomes.'
            },
            {
                id: 'bs3',
                title: 'Building AI-Powered Learning Partners',
                time: '2:30-3:15 PM',
                room: 'Room 2319 - AI Track',
                moderator: 'Dr. Marquita Lyons-Smith',
                presenter: 'Atty. Dana G. Jones',
                presenterKey: 'dana_jones',
                description: 'Leveraging artificial intelligence to create supportive learning environments.'
            },
            {
                id: 'bs4',
                title: 'From Review to Relationship: Cultivating Faculty Trust',
                time: '2:30-3:15 PM',
                room: 'Room 2211 - Course Design',
                moderator: 'Dr. Mijon Knight',
                presenter: 'Dr. Michele Leverett',
                presenterKey: 'michele_leverett',
                description: 'Building collaborative relationships between instructional designers and faculty.'
            }
        ]
    };
}

/**
 * Setup session cards in registration page
 */
function setupSessionCards() {
    setupLightningTalks();
    setupBreakoutSessions();
}

/**
 * Setup lightning talks section
 */
function setupLightningTalks() {
    const container = document.getElementById('lightningTalksGrid');
    if (!container) return;
    
    container.innerHTML = App.sessionData.lightningTalks.map(session => 
        createSessionCard(session, 'lightning-talk')
    ).join('');
}

/**
 * Setup breakout sessions section
 */
function setupBreakoutSessions() {
    const container = document.getElementById('breakoutSessionsGrid');
    if (!container) return;
    
    container.innerHTML = App.sessionData.breakoutSessions.map(session => 
        createSessionCard(session, 'breakout-session')
    ).join('');
}

/**
 * Create a session card HTML
 */
function createSessionCard(session, type) {
    const presenterInfo = getPresenterInfo(session);
    
    return `
        <div class="session-card" onclick="toggleSession(this, '${session.id}')" 
             role="button" tabindex="0" aria-label="Select session: ${session.title}">
            <input type="checkbox" id="${session.id}" aria-hidden="true">
            <div class="session-title">${session.title}</div>
            <div class="session-details">
                <span class="session-time">${session.time}</span>
                <span class="session-room">${session.room}</span>
                ${session.moderator ? `<br>Moderator: ${session.moderator}` : ''}
            </div>
            <div class="presenter-info">
                <div class="presenter-name">${session.presenter}</div>
                ${presenterInfo.title ? `<div class="presenter-title">${presenterInfo.title}</div>` : ''}
                ${presenterInfo.institution ? `<div class="presenter-institution">${presenterInfo.institution}</div>` : ''}
                <div class="bio-preview">
                    ${session.description}
                    ${presenterInfo.bioLinks ? `<br>${presenterInfo.bioLinks}` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Get presenter information for session card
 */
function getPresenterInfo(session) {
    if (!session.presenterKey && !session.presenterKeys) {
        return { title: '', institution: '', bioLinks: '' };
    }
    
    // Handle single presenter
    if (session.presenterKey) {
        const presenter = window.presenterBios && window.presenterBios[session.presenterKey];
        if (presenter) {
            return {
                title: presenter.title,
                institution: presenter.institution,
                bioLinks: `<button class="view-full-bio" onclick="showBio(event, '${session.presenterKey}')">View Full Bio</button>`
            };
        }
    }
    
    // Handle multiple presenters
    if (session.presenterKeys && Array.isArray(session.presenterKeys)) {
        const links = session.presenterKeys
            .filter(key => window.presenterBios && window.presenterBios[key])
            .map(key => {
                const presenter = window.presenterBios[key];
                return `<button class="view-full-bio" onclick="showBio(event, '${key}')">View ${presenter.name.split(' ')[0]}'s Bio</button>`;
            })
            .join(' | ');
        
        const firstPresenter = window.presenterBios && window.presenterBios[session.presenterKeys[0]];
        return {
            title: firstPresenter ? firstPresenter.title : '',
            institution: firstPresenter ? firstPresenter.institution : '',
            bioLinks: links
        };
    }
    
    return { title: '', institution: '', bioLinks: '' };
}

/**
 * Toggle session selection
 */
function toggleSession(card, sessionId) {
    try {
        const checkbox = document.getElementById(sessionId);
        if (!checkbox) return;
        
        // Toggle checkbox state
        checkbox.checked = !checkbox.checked;
        
        // Update visual state
        if (checkbox.checked) {
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
        } else {
            card.classList.remove('selected');
            card.setAttribute('aria-pressed', 'false');
        }
        
        // Update registration data if registration module is loaded
        if (typeof updateRegistrationData === 'function') {
            updateRegistrationData();
        }
        
        // Announce selection to screen readers
        announceSessionSelection(sessionId, checkbox.checked);
        
    } catch (error) {
        console.error('Error toggling session:', error);
    }
}

/**
 * Announce session selection for accessibility
 */
function announceSessionSelection(sessionId, selected) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Session ${selected ? 'selected' : 'deselected'}`;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Populate speakers grid
 */
function populateSpeakersGrid() {
    const speakersGrid = document.getElementById('speakersGrid');
    if (!speakersGrid || !window.presenterBios) return;
    
    try {
        // Create array of speakers for easier manipulation
        const speakers = Object.entries(window.presenterBios).map(([key, speaker]) => ({
            key,
            ...speaker
        }));
        
        // Store speakers in app state
        App.filteredSpeakers = speakers;
        
        // Render speakers
        renderSpeakers(speakers);
        
        // Populate institution filter
        populateInstitutionFilter(speakers);
        
    } catch (error) {
        console.error('Error populating speakers grid:', error);
        speakersGrid.innerHTML = '<p>Unable to load speakers. Please refresh the page.</p>';
    }
}

/**
 * Render speakers in the grid
 */
function renderSpeakers(speakers) {
    const speakersGrid = document.getElementById('speakersGrid');
    if (!speakersGrid) return;
    
    if (speakers.length === 0) {
        speakersGrid.innerHTML = '<p>No speakers found matching your criteria.</p>';
        return;
    }
    
    const speakersHTML = speakers.map(speaker => `
        <div class="speaker-card" role="listitem">
            <div class="speaker-header">
                <div class="speaker-photo" aria-hidden="true">
                    ${speaker.name.split(' ').slice(-1)[0]} Photo
                </div>
                <div class="speaker-info">
                    <h4>${speaker.name}</h4>
                    <div class="title">${speaker.title}</div>
                    <div class="institution">${speaker.institution}</div>
                </div>
            </div>
            <div class="speaker-bio">
                ${speaker.bio.substring(0, 200)}...
                <br><br>
                <button class="view-full-bio" onclick="showBio(event, '${speaker.key}')" 
                        aria-label="View full biography of ${speaker.name}">
                    View Full Bio
                </button>
            </div>
        </div>
    `).join('');
    
    speakersGrid.innerHTML = speakersHTML;
}

/**
 * Populate institution filter dropdown
 */
function populateInstitutionFilter(speakers) {
    const institutionFilter = document.getElementById('institutionFilter');
    if (!institutionFilter) return;
    
    // Get unique institutions
    const institutions = [...new Set(speakers.map(s => s.institution))].sort();
    
    // Clear existing options except "All Institutions"
    institutionFilter.innerHTML = '<option value="">All Institutions</option>';
    
    // Add institution options
    institutions.forEach(institution => {
        const option = document.createElement('option');
        option.value = institution;
        option.textContent = institution;
        institutionFilter.appendChild(option);
    });
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('speakerSearch');
    const institutionFilter = document.getElementById('institutionFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterSpeakers, 300));
    }
    
    if (institutionFilter) {
        institutionFilter.addEventListener('change', filterSpeakers);
    }
}

/**
 * Filter speakers based on search criteria
 */
function filterSpeakers() {
    const searchTerm = document.getElementById('speakerSearch')?.value.toLowerCase() || '';
    const selectedInstitution = document.getElementById('institutionFilter')?.value || '';
    
    if (!window.presenterBios) return;
    
    const allSpeakers = Object.entries(window.presenterBios).map(([key, speaker]) => ({
        key,
        ...speaker
    }));
    
    const filtered = allSpeakers.filter(speaker => {
        const matchesSearch = !searchTerm || 
            speaker.name.toLowerCase().includes(searchTerm) ||
            speaker.title.toLowerCase().includes(searchTerm) ||
            speaker.institution.toLowerCase().includes(searchTerm) ||
            speaker.bio.toLowerCase().includes(searchTerm);
        
        const matchesInstitution = !selectedInstitution || 
            speaker.institution === selectedInstitution;
        
        return matchesSearch && matchesInstitution;
    });
    
    App.filteredSpeakers = filtered;
    renderSpeakers(filtered);
}

/**
 * Show bio modal
 */
function showBio(event, speakerKey) {
    event.stopPropagation();
    
    if (!window.presenterBios || !window.presenterBios[speakerKey]) {
        showError('Speaker information not available.');
        return;
    }
    
    const speaker = window.presenterBios[speakerKey];
    const bioContent = document.getElementById('bioContent');
    const bioModal = document.getElementById('bioModal');
    
    if (!bioContent || !bioModal) return;
    
    bioContent.innerHTML = `
        <div class="speaker-header">
            <div class="speaker-photo" aria-hidden="true">
                ${speaker.name.split(' ').slice(-1)[0]} Photo
            </div>
            <div class="speaker-info">
                <h4 id="bioModalTitle">${speaker.name}</h4>
                <div class="title">${speaker.title}</div>
                <div class="institution">${speaker.institution}</div>
            </div>
        </div>
        <div class="speaker-bio" style="margin-top: 20px;">
            ${speaker.bio}
        </div>
    `;
    
    // Show modal
    bioModal.classList.add('active');
    bioModal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const closeButton = bioModal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.focus();
    }
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Close bio modal
 */
function closeBioModal() {
    const bioModal = document.getElementById('bioModal');
    if (!bioModal) return;
    
    bioModal.classList.remove('active');
    bioModal.setAttribute('aria-hidden', 'true');
    
    // Restore body scrolling
    document.body.style.overflow = '';
}

/**
 * Show error modal
 */
function showError(message) {
    const errorModal = document.getElementById('errorModal');
    const errorContent = document.getElementById('errorContent');
    
    if (!errorModal || !errorContent) {
        alert(message); // Fallback
        return;
    }
    
    errorContent.innerHTML = `<p>${message}</p>`;
    errorModal.classList.add('active');
    errorModal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const closeButton = errorModal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.focus();
    }
}

/**
 * Close error modal
 */
function closeErrorModal() {
    const errorModal = document.getElementById('errorModal');
    if (!errorModal) return;
    
    errorModal.classList.remove('active');
    errorModal.setAttribute('aria-hidden', 'true');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Keyboard navigation for session cards
    document.addEventListener('keydown', function(event) {
        const target = event.target;
        
        // Handle Enter/Space on session cards
        if (target.classList.contains('session-card')) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                target.click();
            }
        }
        
        // Handle Escape key for modals
        if (event.key === 'Escape') {
            closeBioModal();
            closeErrorModal();
        }
    });
    
    // Click outside modal to close
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            closeBioModal();
            closeErrorModal();
        }
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', function(event) {
        const page = event.state?.page || 'home';
        showPage(page);
    });
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format text for accessibility
 */
function formatForAccessibility(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    if (!App.initialized) {
        showError('An error occurred while loading the application. Please refresh the page.');
    }
});

// Expose functions globally for HTML onclick handlers
window.showPage = showPage;
window.toggleSession = toggleSession;
window.showBio = showBio;
window.closeBioModal = closeBioModal;
window.closeErrorModal = closeErrorModal;