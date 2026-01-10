const time = document.querySelector('.time');
const daysLeft = document.querySelector('.days-left');
const weddingDate = new Date("2026-04-10T17:00:00").getTime();
const toggleMenu = document.querySelector('.toggle-menu')
const navList = document.querySelector('.nav-list')
const navLinks = document.querySelectorAll('.nav-link')
const icon = document.getElementsByTagName('i');

// Initialize form security tracking
let formLoadTime = Date.now();
let submissionAttempts = 0;
const maxSubmissionAttempts = 3;
const minFormFillTime = 5000; // 5 seconds minimum

// Initialize language variable
let currentLanguage = 'en';

// Language selection overlay handling
const languageOverlay = document.getElementById('language-overlay');
const languageButtons = document.querySelectorAll('.lang-btn');

// Check if we should show the language overlay
function shouldShowLanguageOverlay() {
    // Don't show on RSVP page
    if (window.location.pathname.includes('rsvp.html')) {
        console.log('Overlay not shown - on RSVP page');
        return false;
    }
    
    // Don't show if user has already selected language in this session
    if (sessionStorage.getItem('languageSelected') === 'true') {
        console.log('Overlay not shown - language already selected this session');
        return false;
    }
    
    // Show overlay on home page for first-time visitors or fresh page loads
    console.log('Overlay should show - first time visitor or fresh load');
    return true;
}

// Initialize language overlay visibility when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking overlay...');
    console.log('Language overlay element:', languageOverlay);
    
    if (languageOverlay) {
        if (shouldShowLanguageOverlay()) {
            console.log('Showing language overlay');
            languageOverlay.classList.add('show');
        } else {
            console.log('Hiding language overlay');
            languageOverlay.classList.add('hidden');
            
            // If returning user, restore their language preference
            const savedLang = sessionStorage.getItem('selectedLanguage') || 'en';
            currentLanguage = savedLang;
            translatePage(currentLanguage);
            
            // Update language toggle button to match saved preference
            updateLanguageToggleButton();
        }
    } else {
        console.log('Language overlay element not found!');
    }
});

// Function to update language toggle button
function updateLanguageToggleButton() {
    const langFlag = document.querySelector('.lang-flag');
    const langText = document.querySelector('.lang-text');
    if (langFlag && langText) {
        if (currentLanguage === 'es') {
            langFlag.className = 'lang-flag flag-us';
            langText.textContent = 'EN';
        } else {
            langFlag.className = 'lang-flag flag-gt';
            langText.textContent = 'ES';
        }
    }
}

// Handle language selection from overlay
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedLang = button.getAttribute('data-lang');
        currentLanguage = selectedLang;
        translatePage(currentLanguage);
        
        // Save language selection to session storage
        sessionStorage.setItem('languageSelected', 'true');
        sessionStorage.setItem('selectedLanguage', selectedLang);
        
        // Update flag and text to match selection
        updateLanguageToggleButton();
        
        // Hide overlay with animation
        languageOverlay.classList.add('hidden');
    });
});

// Hero slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slideshow .slide');
const totalSlides = slides.length;
let slideOrder = [];
let slideIndex = 0;

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create initial shuffled order
function createNewSlideOrder() {
    const indices = Array.from({length: totalSlides}, (_, i) => i);
    slideOrder = shuffleArray(indices);
    slideIndex = 0;
}

function showNextSlide() {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // If we've shown all slides in current shuffle, create new order
    if (slideIndex >= slideOrder.length) {
        createNewSlideOrder();
    }
    
    // Get next slide from shuffled order
    currentSlide = slideOrder[slideIndex];
    slideIndex++;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
}

// Start slideshow if slides exist
if (slides.length > 0) {
    // Create initial shuffle order
    createNewSlideOrder();
    // Start with first slide in shuffle
    currentSlide = slideOrder[0];
    slideIndex = 1;
    slides[currentSlide].classList.add('active');
    
    // Change slide every 4 seconds
    setInterval(showNextSlide, 4000);
}
// const date = new Date();
// console.log(date);\
// Update the countdown every second
const countdownFunction = setInterval(() => {
    // Get the current date and time
    const now = new Date().getTime();

    // Calculate the distance between now and the wedding date
    const distance = weddingDate - now;

    // Time calculations for days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the countdown div
    time.innerHTML = 
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // If the countdown is over, display a message
    if (distance <= 0) {
        clearInterval(countdownFunction);
        time.innerHTML = "The big day has arrived!";
        daysLeft.classList.add('hidden');
    }
}, 1000);

toggleMenu.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    navList.classList.toggle('open');
    toggleMenu.firstElementChild.classList.toggle('fa-bars');
    toggleMenu.firstElementChild.classList.toggle('fa-x');
})

// Close menu when any nav link is clicked
navLinks.forEach(navLink => {
    navLink.addEventListener('click', () => {
        navList.classList.remove('open');
        toggleMenu.firstElementChild.classList.remove('fa-x');
        toggleMenu.firstElementChild.classList.add('fa-bars');
    })
})

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navBar = document.querySelector('.nav-bar');
    const navList = document.querySelector('.nav-list');
    const toggleMenu = document.querySelector('.toggle-menu');
    
    // Check if click is outside the navigation area
    if (navList && navList.classList.contains('open')) {
        if (!navBar.contains(e.target)) {
            navList.classList.remove('open');
            if (toggleMenu && toggleMenu.firstElementChild) {
                toggleMenu.firstElementChild.classList.remove('fa-x');
                toggleMenu.firstElementChild.classList.add('fa-bars');
            }
        }
    }
})

// RSVP Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const attendanceSelect = document.getElementById('attendance');
    const attendanceDetails = document.getElementById('attendance-details');
    const adultsInput = document.getElementById('adults');
    const childrenUnder10Input = document.getElementById('children-under-10');
    const children10PlusInput = document.getElementById('children-10-plus');
    const guestList = document.getElementById('guest-list');
    
    // After party form elements
    const afterPartyAttendance = document.getElementById('after-party-attendance');
    const afterPartyDetails = document.getElementById('after-party-details');
    const afterPartyAdults = document.getElementById('after-party-adults');
    const afterPartyGuestList = document.getElementById('after-party-guest-list');
    
    // Form containers
    const mainRsvpForm = document.getElementById('main-rsvp-form');
    const afterPartyRsvpForm = document.getElementById('after-party-rsvp-form');
    const finalSuccess = document.getElementById('final-success');
    
    // Wedding RSVP form
    const weddingForm = document.getElementById('wedding-rsvp');
    const afterPartyForm = document.getElementById('after-party-rsvp');

    // Show/hide attendance details based on selection
    attendanceSelect.addEventListener('change', function() {
        if (this.value === 'yes') {
            attendanceDetails.style.display = 'block';
        } else {
            attendanceDetails.style.display = 'none';
            resetMainForm();
        }
    });

    // Show/hide after party details based on selection
    if (afterPartyAttendance) {
        afterPartyAttendance.addEventListener('change', function() {
            if (this.value === 'yes') {
                afterPartyDetails.style.display = 'block';
            } else {
                afterPartyDetails.style.display = 'none';
                afterPartyAdults.value = '';
                afterPartyGuestList.innerHTML = '';
            }
        });
    }

    // Generate guest name inputs for main wedding
    function generateGuestInputs() {
        const adultCount = parseInt(adultsInput.value || 0);
        guestList.innerHTML = '';
        
        // Generate adult inputs only (children count is just a number)
        if (adultCount > 0) {
            // Add adults section header
            const adultsHeader = document.createElement('h4');
            adultsHeader.style.marginTop = '20px';
            adultsHeader.style.marginBottom = '10px';
            adultsHeader.style.color = 'var(--sage)';
            adultsHeader.textContent = currentLanguage === 'es' ? 'Nombres de Adultos:' : 'Adult Names:';
            guestList.appendChild(adultsHeader);
            
            for (let i = 1; i <= adultCount; i++) {
                const inputDiv = document.createElement('div');
                inputDiv.className = 'guest-input';
                
                const labelText = currentLanguage === 'es' ? `Adulto ${i} Nombre Completo:` : `Adult ${i} Full Name:`;
                const placeholderText = currentLanguage === 'es' ? 'Nombre y Apellido' : 'First and Last Name';
                
                inputDiv.innerHTML = `
                    <label for="adult-${i}">${labelText}</label>
                    <input type="text" id="adult-${i}" name="adult_${i}" placeholder="${placeholderText}" required>
                `;
                guestList.appendChild(inputDiv);
                
                // Add name formatting to the newly created input
                const newInput = inputDiv.querySelector('input');
                addNameFormatting(newInput);
            }
        }
    }

    // Store adult names for after party selection
    let adultNames = [];

    // Generate guest name inputs for after party with checkboxes
    function generateAfterPartyGuestInputs() {
        afterPartyGuestList.innerHTML = '';
        
        // If we have adult names from the wedding form, show them as checkboxes
        if (adultNames.length > 0) {
            const headerText = currentLanguage === 'es' ? 'Seleccione quién asistirá a la fiesta después (solo 21+):' : 'Select who will attend the after party (21+ only):';
            const header = document.createElement('h4');
            header.style.marginTop = '10px';
            header.style.marginBottom = '15px';
            header.textContent = headerText;
            afterPartyGuestList.appendChild(header);
            
            adultNames.forEach((name, index) => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'after-party-checkbox';
                checkboxDiv.style.marginBottom = '10px';
                
                checkboxDiv.innerHTML = `
                    <label style="display: flex; align-items: center; font-size: 1.5rem; cursor: pointer;">
                        <input type="checkbox" class="after-party-guest-checkbox" value="${name}" name="after_party_guest_${index + 1}" style="margin-right: 10px; width: 20px; height: 20px; cursor: pointer;">
                        ${name}
                    </label>
                `;
                afterPartyGuestList.appendChild(checkboxDiv);
            });
            
            // Update count when checkboxes change
            const checkboxes = afterPartyGuestList.querySelectorAll('.after-party-guest-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateAfterPartyCount);
            });
        }
        
        // Add section for additional guests
        const additionalGuestsSection = document.createElement('div');
        additionalGuestsSection.id = 'additional-guests-section';
        additionalGuestsSection.style.marginTop = '30px';
        
        const addGuestButtonText = currentLanguage === 'es' ? '+ Agregar Invitado Adicional' : '+ Add Additional Guest';
        additionalGuestsSection.innerHTML = `
            <div id="additional-guests-list" style="margin-top: 20px;"></div>

            <button type="button" id="add-guest-btn" class="btn-link" style="margin: 0; padding: 10px 20px; font-size: 1.3rem;">
                ${addGuestButtonText}
            </button>
        `;
        afterPartyGuestList.appendChild(additionalGuestsSection);
        
        // Add guest button handler
        document.getElementById('add-guest-btn').addEventListener('click', addAdditionalGuest);
    }
    
    function addAdditionalGuest() {
        const additionalGuestsList = document.getElementById('additional-guests-list');
        const currentCount = additionalGuestsList.querySelectorAll('.additional-guest-input').length;
        const guestNumber = currentCount + 1;
        const guestIndex = adultNames.length + guestNumber;
        
        const labelText = currentLanguage === 'es' ? `Invitado Adicional ${guestNumber}:` : `Additional Guest ${guestNumber}:`;
        const placeholderText = currentLanguage === 'es' ? 'Nombre y Apellido' : 'First and Last Name';
        
        const guestDiv = document.createElement('div');
        guestDiv.className = 'additional-guest-input';
        guestDiv.style.marginBottom = '15px';
        guestDiv.innerHTML = `
            <label for="after-party-guest-${guestIndex}" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 5px; display: block;">${labelText}</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="text" id="after-party-guest-${guestIndex}" name="after_party_guest_${guestIndex}" placeholder="${placeholderText}" class="additional-guest-name" style="flex: 1; padding: 18px; font-size: 1.6rem; border: 2px solid var(--battleship-gray); border-radius: 5px; width: 100%;" required>
                <button type="button" class="remove-guest-btn" style="padding: 6px; background: #d32f2f; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.85rem; width: 30px; height: 30px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">✕</button>
            </div>
        `;
        
        additionalGuestsList.appendChild(guestDiv);
        
        // Add name formatting
        const newInput = guestDiv.querySelector('input');
        addNameFormatting(newInput);
        newInput.addEventListener('input', updateAfterPartyCount);
        
        // Remove button handler
        guestDiv.querySelector('.remove-guest-btn').addEventListener('click', function() {
            guestDiv.remove();
            renumberAdditionalGuests();
            updateAfterPartyCount();
        });
        
        updateAfterPartyCount();
    }
    
    function renumberAdditionalGuests() {
        const additionalGuestsList = document.getElementById('additional-guests-list');
        const guestDivs = additionalGuestsList.querySelectorAll('.additional-guest-input');
        
        guestDivs.forEach((div, index) => {
            const guestNumber = index + 1;
            const guestIndex = adultNames.length + guestNumber;
            const labelText = currentLanguage === 'es' ? `Invitado Adicional ${guestNumber}:` : `Additional Guest ${guestNumber}:`;
            
            // Update label
            const label = div.querySelector('label');
            label.textContent = labelText;
            label.setAttribute('for', `after-party-guest-${guestIndex}`);
            
            // Update input id and name
            const input = div.querySelector('input');
            input.id = `after-party-guest-${guestIndex}`;
            input.name = `after_party_guest_${guestIndex}`;
        });
    }
    
    function updateAfterPartyCount() {
        const checkedCount = document.querySelectorAll('.after-party-guest-checkbox:checked').length;
        const additionalGuestsCount = document.querySelectorAll('.additional-guest-input').length;
        const totalCount = checkedCount + additionalGuestsCount;
        afterPartyAdults.value = totalCount;
    }

    // Event listeners for guest count changes
    adultsInput.addEventListener('input', generateGuestInputs);

    // Handle wedding RSVP form submission
    weddingForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        e.stopPropagation(); // Stop event bubbling
        
        // Bot protection: Check form fill time
        const formFillTime = Date.now() - formLoadTime;
        if (formFillTime < minFormFillTime) {
            console.log('Suspicious: Form filled too quickly');
            return false;
        }
        
        // Rate limiting: Check submission attempts
        submissionAttempts++;
        if (submissionAttempts > maxSubmissionAttempts) {
            console.log('Too many submission attempts');
            return false;
        }
        
        // Disable submit button to prevent double submissions
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton.disabled) {
            return false; // Already submitting
        }
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Get the primary name for the after party form
        const primaryName = document.getElementById('primary-name').value;
        
        // Collect all adult names for after party selection
        adultNames = [];
        const adultCount = parseInt(adultsInput.value || 0);
        for (let i = 1; i <= adultCount; i++) {
            const adultInput = document.getElementById(`adult-${i}`);
            if (adultInput && adultInput.value) {
                adultNames.push(adultInput.value);
            }
        }
        
        // Submit the form data
        const formData = new FormData(this);
        
        // Send the wedding RSVP with timeout
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));
        
        Promise.race([
            fetch(this.action, {
                method: 'POST',
                body: formData
            }),
            timeoutPromise
        ]).then(response => {
            // Check if submission was rejected due to bot protection
            if (response && response.ok) {
                response.json().then(result => {
                    if (result.success === false) {
                        console.log('Submission rejected:', result.error);
                        // Re-enable submit button
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                        return;
                    }
                });
            }
            
            // Hide main form and show after party form regardless
            mainRsvpForm.style.display = 'none';
            afterPartyRsvpForm.style.display = 'block';
            
            // Reset form load time for after-party form
            formLoadTime = Date.now();
            
            // Set the primary name in after party form
            document.getElementById('after-party-primary-name').value = primaryName;
            
            // Generate after party checkboxes with the adult names
            generateAfterPartyGuestInputs();
            
            // Scroll to after party form
            afterPartyRsvpForm.scrollIntoView({ behavior: 'smooth' });
        }).catch(error => {
            console.error('Error:', error);
            // Still show after party form - the submission likely went through
            mainRsvpForm.style.display = 'none';
            afterPartyRsvpForm.style.display = 'block';
            document.getElementById('after-party-primary-name').value = primaryName;
            generateAfterPartyGuestInputs();
            afterPartyRsvpForm.scrollIntoView({ behavior: 'smooth' });
        });
        
        return false; // Additional prevention of default form submission
    });

    // Handle after party RSVP form submission
    if (afterPartyForm) {
        afterPartyForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            e.stopPropagation(); // Stop event bubbling
            
            // Disable submit button to prevent double submissions
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton.disabled) {
                return false; // Already submitting
            }
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            // Submit the form data
            const formData = new FormData(this);
            
            // Send the after party RSVP
            fetch(this.action, {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.ok) {
                    // Hide after party form and show final success
                    afterPartyRsvpForm.style.display = 'none';
                    finalSuccess.style.display = 'block';
                    
                    // Scroll to final success message
                    finalSuccess.scrollIntoView({ behavior: 'smooth' });
                } else {
                    alert('There was an error submitting your after party RSVP. Please try again.');
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }).catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your after party RSVP. Please try again.');
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
            
            return false; // Additional prevention of default form submission
        });
    }

    function resetMainForm() {
        adultsInput.value = '';
        childrenUnder10Input.value = '';
        children10PlusInput.value = '';
        guestList.innerHTML = '';
    }

    // Name formatting function
    function formatProperCase(str) {
        if (!str) return '';
        
        return str.toLowerCase()
            .split(/(\s|-|')/) // Split on spaces, hyphens, and apostrophes
            .map(word => {
                if (word.match(/\s|-|'/)) return word; // Keep separators as-is
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
    }

    // Add formatting to input fields
    function addNameFormatting(input) {
        input.addEventListener('blur', function() {
            this.value = formatProperCase(this.value.trim());
        });
        
        // Also format on Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.value = formatProperCase(this.value.trim());
            }
        });
    }

    // Format primary name input
    const primaryNameInput = document.getElementById('primary-name');
    if (primaryNameInput) {
        addNameFormatting(primaryNameInput);
    }
});

// Language Toggle Functionality
// currentLanguage already declared at top of file

const translations = {
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-countdown': 'Countdown',
        'nav-story': 'Our Story',
        'nav-qa': 'Q / A',
        'nav-parking': 'Parking',
        'nav-itinerary': 'Itinerary',
        'nav-rsvp': 'RSVP',
        
        // Hero Section
        'hero-title': "Melvin & Zong's Big Day",
        'hero-subtitle': 'Celebrate with us in Sacramento!',
        'rsvp-button': 'RSVP',
        
        // Countdown
        'countdown-text': 'UNTIL THE BIG DAY',
        
        // Story
        'our-story-title': 'Our Story',
        'story-paragraph1': 'Their story began in the least romantic of places: a computer lab. Between glowing screens and quiet focus, something unexpected clicked, more than just the keyboards. That spark soon climbed higher, quite literally, into a treehouse where laughter came easily and a simple hangout turned into the beginning of something real.',
        'story-paragraph2': 'Their love learned to travel early, winding along the coast with the ocean as their witness and adventure as their guide. Life, of course, had plans of its own. Sending them miles apart to build careers, chase dreams, and grow into the people they were meant to be.',
        'story-paragraph3': 'Distance tried its best, but love proved stubborn, patient, and very good at long-distance communication. What started with shared screens and shared dreams has become one life, one promise, and one forever. The best stories don\'t follow a straight line, but always find their way home.',
        
        // Q&A Section
        'qa-title': 'You have questions? We have answers;',
        'attire-text': 'Attire: We kindly request that our guests adhere to a formal dress code for our wedding celebration. Please refrain from wearing white.',
        'children-text': "Children Policy: We love your children, we have kid's room reserved up to 70 of your kiddos",
        'gifts-text': 'Gifts: Your presence is the greatest gift we could ask for. If you wish to honor us with a gift, we kindly request no boxed gifts',
        'refreshments-text': 'Refreshments: Snacks and refreshments, including cocktails and signature drinks, will be available in the lobby starting at 5:00 PM',
        'rsvp-request-text': 'RSVP Request: Please RSVP by February 28th to ensure we can plan accordingly for your presence',
        
        // Parking
        'parking-title': 'Parking:',
        'parking-info': 'The following map shows the Metropolis parking Garage (red star) and arrows around the building to get to the main Galleria entrance indicated by the green star',
        
        // Itinerary
        'itinerary-title': 'Tentative Itinerary:',
        'cerveza-time': 'Cerveza y Tragos con Mariachis',
        'dinner-time': 'Dinner and DJ for those that can\'t wait to hit the dancing floor',
        'banda-time': 'Banda',
        'closing-time': 'Closing hour, get those last few dance moves in w/ our DJ music',
        'bartending-info': 'There will be two bartending stations. (Melvin doesn\'t like waiting in line to get his drinks so hopefully this helps)',
        
        // RSVP
        'rsvp-title': 'RSVP',
        'wedding-rsvp-title': 'Wedding Celebration RSVP',
        'primary-name-label': 'Primary Contact Name:',
        'primary-name-placeholder': 'Your full name',
        'attendance-label': 'Will you attend our wedding?',
        'please-select': 'Please select',
        'attendance-yes': 'Yes, I\'ll be there!',
        'attendance-no': 'Sorry, can\'t make it',
        'adults-label': 'Number of Adults:',
        'adults-placeholder': 'How many adults total?',
        'children-under-10-label': 'Number of Children Under 10: (no seat provided)',
        'children-under-10-placeholder': 'Children under 10 years old',
        'children-10-plus-label': 'Number of Children 10 and Over: (seat provided)',
        'children-10-plus-placeholder': 'Children 10+ years old',
        'guest-names-title': 'Please provide first and last names of all attending adults:',
        'submit-wedding': 'Submit Wedding RSVP',
        'wedding-success-title': '✅ Thank you for your wedding RSVP!',
        'wedding-success-message': 'We\'re excited to celebrate with you!',
        
        // After Party
        'after-party-title': 'After Party RSVP (Adults 21+ Only)',
        'after-party-info': 'If enough guests show interest for after party, it\'ll be held at Cilantro\'s Mexican Restaurant & Bar (0.2 miles from our event, ~4 minute walk). We\'ll confirm closer to date for those that are interested. Cilantro\'s will continue with Banda and DJ music.',
        'after-party-interest': 'Are you interested in the after party?',
        'after-party-yes': 'Yes, I\'m interested!',
        'after-party-no': 'No, just the wedding for me',
        'after-party-adults-label': 'Number of Adults 21+ for After Party:',
        'after-party-adults-placeholder': 'Adults 21+ attending after party',
        'after-party-names-title': 'Please provide first and last names of all after party attendees (21+ only):',
        'submit-after-party': 'Submit After Party RSVP',
        'final-success-title': '🎉 All RSVPs Complete!',
        'final-success-message1': 'Thank you for taking the time to RSVP. We can\'t wait to celebrate with you!',
        'final-success-message2': 'We\'ll be in touch with more details as the date approaches.'
    },
    es: {
        // Navigation
        'nav-home': 'Inicio',
        'nav-countdown': 'Cuenta Regresiva',
        'nav-story': 'Nuestra Historia',
        'nav-qa': 'Preguntas',
        'nav-parking': 'Estacionamiento',
        'nav-itinerary': 'Itinerario',
        'nav-rsvp': 'RSVP',
        
        // Hero Section
        'hero-title': 'El Gran Día de Melvin y Zong',
        'hero-subtitle': '¡Celebra con nosotros en Sacramento!',
        'rsvp-button': 'Confirmar',
        
        // Countdown
        'countdown-text': 'HASTA EL GRAN DÍA',
        
        // Story
        'our-story-title': 'Nuestra Historia',
        'story-paragraph1': 'Su historia comenzó en el lugar menos romántico: un laboratorio de computadoras. Entre pantallas brillantes y concentración silenciosa, algo inesperado hizo clic, más que solo los teclados. Esa chispa pronto subió más alto, literalmente, a una casa del árbol donde la risa vino fácilmente y una simple reunión se convirtió en el comienzo de algo real.',
        'story-paragraph2': 'Su amor aprendió a viajar temprano, serpenteando por la costa con el océano como testigo y la aventura como guía. La vida, por supuesto, tenía sus propios planes. Los envió millas de distancia para construir carreras, perseguir sueños y crecer hasta convertirse en las personas que estaban destinados a ser.',
        'story-paragraph3': 'La distancia hizo su mejor esfuerzo, pero el amor demostró ser terco, paciente y muy bueno en la comunicación a larga distancia. Lo que comenzó con pantallas compartidas y sueños compartidos se ha convertido en una vida, una promesa y un para siempre. Las mejores historias no siguen una línea recta, pero siempre encuentran su camino a casa.',
        
        // Q&A Section
        'qa-title': '¿Tienes preguntas? Tenemos respuestas;',
        'attire-text': 'Vestimenta: Pedimos cordialmente que nuestros invitados sigan un código de vestimenta formal para nuestra celebración de bodas. Por favor absténganse de usar blanco.',
        'children-text': 'Política de Niños: Amamos a sus niños, tenemos una sala para niños reservada para hasta 70 de sus pequeños',
        'gifts-text': 'Regalos: Su presencia es el regalo más grande que podríamos pedir. Si desean honrarnos con un regalo, pedimos cordialmente que no sean regalos empacados',
        'refreshments-text': 'Refrescos: Bocadillos y refrescos, incluyendo cocteles y bebidas especiales, estarán disponibles en el vestíbulo a partir de las 5:00 PM',
        'rsvp-request-text': 'Solicitud de RSVP: Por favor confirme su asistencia antes del 28 de febrero para que podamos planificar adecuadamente',
        
        // Parking
        'parking-title': 'Estacionamiento:',
        'parking-info': 'El siguiente mapa muestra el Garage de Estacionamiento Metropolis (estrella roja) y flechas alrededor del edificio para llegar a la entrada principal de la Galería indicada por la estrella verde',
        
        // Itinerary
        'itinerary-title': 'Itinerario Tentativo:',
        'cerveza-time': 'Cerveza y Tragos con Mariachis',
        'dinner-time': 'Cena y DJ para aquellos que no pueden esperar a llegar a la pista de baile',
        'banda-time': 'Banda',
        'closing-time': 'Hora de cierre, últimos bailes con nuestra música de DJ',
        'bartending-info': 'Habrá dos estaciones de bar. (A Melvin no le gusta hacer fila para sus bebidas, así que esperamos que esto ayude)',
        
        // RSVP
        'rsvp-title': 'Confirmar Asistencia',
        'wedding-rsvp-title': 'Confirmación de Celebración de Boda',
        'primary-name-label': 'Nombre del Contacto Principal:',
        'primary-name-placeholder': 'Tu nombre completo',
        'attendance-label': '¿Asistirás a nuestra boda?',
        'please-select': 'Por favor selecciona',
        'attendance-yes': '¡Sí, ahí estaré!',
        'attendance-no': 'Lo siento, no puedo ir',
        'adults-label': 'Número de Adultos:',
        'adults-placeholder': '¿Cuántos adultos en total?',
        'children-under-10-label': 'Número de Niños Menores de 10: (sin asiento)',
        'children-under-10-placeholder': 'Niños menores de 10 años',
        'children-10-plus-label': 'Número de Niños de 10 y Mayores: (asiento incluido)',
        'children-10-plus-placeholder': 'Niños de 10+ años',
        'guest-names-title': 'Por favor proporciona nombres y apellidos de todos los adultos que asistirán:',
        'submit-wedding': 'Enviar Confirmación de Boda',
        'wedding-success-title': '✅ ¡Gracias por confirmar tu asistencia a la boda!',
        'wedding-success-message': '¡Estamos emocionados de celebrar contigo!',
        
        // After Party
        'after-party-title': 'RSVP Fiesta Post-Boda (Solo Adultos 21+)',
        'after-party-info': 'Si suficientes invitados muestran interés en la fiesta posterior, se realizará en Cilantro\'s Mexican Restaurant & Bar (0.2 millas de nuestro evento, ~4 minutos caminando). Confirmaremos más cerca de la fecha para aquellos interesados. Cilantro\'s continuará con música de Banda y DJ.',
        'after-party-interest': '¿Estás interesado en la fiesta posterior?',
        'after-party-yes': '¡Sí, estoy interesado!',
        'after-party-no': 'No, solo la boda para mí',
        'after-party-adults-label': 'Número de Adultos 21+ para la Fiesta Posterior:',
        'after-party-adults-placeholder': 'Adultos 21+ que asistirán a la fiesta posterior',
        'after-party-names-title': 'Por favor proporciona nombres y apellidos de todos los asistentes a la fiesta posterior (solo 21+):',
        'submit-after-party': 'Enviar Confirmación Fiesta Posterior',
        'final-success-title': '🎉 ¡Todas las Confirmaciones Completadas!',
        'final-success-message1': 'Gracias por tomarte el tiempo de confirmar tu asistencia. ¡No podemos esperar a celebrar contigo!',
        'final-success-message2': 'Nos pondremos en contacto contigo con más detalles mientras se acerca la fecha.'
    }
};

// Function to translate page content
function translatePage(language) {
    // Translate regular text elements
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
    
    // Translate placeholders
    const placeholders = document.querySelectorAll('[data-translate-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[language] && translations[language][key]) {
            element.placeholder = translations[language][key];
        }
    });
    
    // Translate dynamically generated guest name inputs
    updateDynamicGuestInputs(language);
}

// Function to update dynamically generated guest inputs with translations
function updateDynamicGuestInputs(language) {
    // Update main wedding guest inputs
    const guestInputs = document.querySelectorAll('#guest-list input');
    guestInputs.forEach((input, index) => {
        const guestNumber = index + 1;
        if (language === 'es') {
            input.placeholder = 'Nombre y Apellido';
        } else {
            input.placeholder = 'First and Last Name';
        }
    });
    
    // Update after party guest inputs
    const afterPartyInputs = document.querySelectorAll('#after-party-guest-list input');
    afterPartyInputs.forEach((input, index) => {
        const guestNumber = index + 1;
        if (language === 'es') {
            input.placeholder = 'Nombre y Apellido (solo 21+)';
        } else {
            input.placeholder = 'First and Last Name (21+ only)';
        }
    });
}

// Language toggle event listener
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('language-toggle');
    if (!languageToggle) return;
    
    const langFlag = languageToggle.querySelector('.lang-flag');
    const langText = languageToggle.querySelector('.lang-text');
    
    languageToggle.addEventListener('click', function() {
        if (currentLanguage === 'en') {
            currentLanguage = 'es';
            // Switch to show US flag (can switch back to English)
            langFlag.className = 'lang-flag flag-us';
            langText.textContent = 'EN';
            translatePage('es');
        } else {
            currentLanguage = 'en';
            // Switch to show Guatemalan flag (can switch to Spanish)
            langFlag.className = 'lang-flag flag-gt';
            langText.textContent = 'ES';
            translatePage('en');
        }
        
        // Save language selection to session storage
        sessionStorage.setItem('languageSelected', 'true');
        sessionStorage.setItem('selectedLanguage', currentLanguage);
        
        // Close mobile menu after language toggle (same as nav links)
        const navList = document.querySelector('.nav-list');
        const toggleMenu = document.querySelector('.toggle-menu');
        if (navList && navList.classList.contains('open')) {
            navList.classList.remove('open');
            if (toggleMenu && toggleMenu.firstElementChild) {
                toggleMenu.firstElementChild.classList.remove('fa-x');
                toggleMenu.firstElementChild.classList.add('fa-bars');
            }
        }
    });
});