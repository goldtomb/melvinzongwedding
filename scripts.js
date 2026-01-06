const time = document.querySelector('.time');
const daysLeft = document.querySelector('.days-left');
const weddingDate = new Date("2026-04-10T17:00:00").getTime();
const toggleMenu = document.querySelector('.toggle-menu')
const navList = document.querySelector('.nav-list')
const navLinks = document.querySelectorAll('.nav-link')
const icon = document.getElementsByTagName('i');

// Hero slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slideshow .slide');
const totalSlides = slides.length;

function showNextSlide() {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Move to next slide
    currentSlide = (currentSlide + 1) % totalSlides;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
}

// Start slideshow if slides exist
if (slides.length > 0) {
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

toggleMenu.addEventListener('click', () => {
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

// RSVP Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const attendanceSelect = document.getElementById('attendance');
    const attendanceDetails = document.getElementById('attendance-details');
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
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

    // Generate guest name inputs for after party
    function generateAfterPartyGuestInputs() {
        const totalAfterPartyGuests = parseInt(afterPartyAdults.value || 0);
        afterPartyGuestList.innerHTML = '';
        
        for (let i = 1; i <= totalAfterPartyGuests; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'after-party-guest-input';
            
            const labelText = currentLanguage === 'es' ? `Invitado Fiesta ${i} Nombre Completo:` : `After Party Guest ${i} Full Name:`;
            const placeholderText = currentLanguage === 'es' ? 'Nombre y Apellido (solo 21+)' : 'First and Last Name (21+ only)';
            
            inputDiv.innerHTML = `
                <label for="after-party-guest-${i}">${labelText}</label>
                <input type="text" id="after-party-guest-${i}" name="after_party_guest_${i}" placeholder="${placeholderText}" required>
            `;
            afterPartyGuestList.appendChild(inputDiv);
            
            // Add name formatting to the newly created input
            const newInput = inputDiv.querySelector('input');
            addNameFormatting(newInput);
        }
    }

    // Event listeners for guest count changes
    adultsInput.addEventListener('input', generateGuestInputs);
    
    if (afterPartyAdults) {
        afterPartyAdults.addEventListener('input', generateAfterPartyGuestInputs);
    }

    // Handle wedding RSVP form submission
    weddingForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        e.stopPropagation(); // Stop event bubbling
        
        // Disable submit button to prevent double submissions
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Get the primary name for the after party form
        const primaryName = document.getElementById('primary-name').value;
        
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
            // Hide main form and show after party form regardless
            mainRsvpForm.style.display = 'none';
            afterPartyRsvpForm.style.display = 'block';
            
            // Set the primary name in after party form
            document.getElementById('after-party-primary-name').value = primaryName;
            
            // Scroll to after party form
            afterPartyRsvpForm.scrollIntoView({ behavior: 'smooth' });
        }).catch(error => {
            console.error('Error:', error);
            // Still show after party form - the submission likely went through
            mainRsvpForm.style.display = 'none';
            afterPartyRsvpForm.style.display = 'block';
            document.getElementById('after-party-primary-name').value = primaryName;
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
        childrenInput.value = '';
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
let currentLanguage = 'en'; // Initial state is English

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
        'attire-text': 'Attire: We kindly request that our guests adhere to a formal dress code for our wedding celebration',
        'children-text': "Children Policy: We love your children, we have kid's room reserved up to 30 of your kiddos",
        'gifts-text': 'Gifts: Your presence is the greatest gift we could ask for. If you wish to honor us with a gift, we kindly request no boxed gifts',
        'refreshments-text': 'Refreshments: Snacks and refreshments, including cocktails and signature drinks, will be available in the lobby starting at 5:00 PM',
        'rsvp-request-text': 'RSVP Request: Please RSVP by November 25th to ensure we can plan accordingly for your presence',
        
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
        'children-label': 'Number of Children:',
        'children-placeholder': 'How many children total?',
        'guest-names-title': 'Please provide first and last names of all attending guests:',
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
        'attire-text': 'Vestimenta: Pedimos cordialmente que nuestros invitados sigan un código de vestimenta formal para nuestra celebración de bodas',
        'children-text': 'Política de Niños: Amamos a sus niños, tenemos una sala para niños reservada para hasta 30 de sus pequeños',
        'gifts-text': 'Regalos: Su presencia es el regalo más grande que podríamos pedir. Si desean honrarnos con un regalo, pedimos cordialmente que no sean regalos empacados',
        'refreshments-text': 'Refrescos: Bocadillos y refrescos, incluyendo cocteles y bebidas especiales, estarán disponibles en el vestíbulo a partir de las 5:00 PM',
        'rsvp-request-text': 'Solicitud de RSVP: Por favor confirme su asistencia antes del 25 de noviembre para que podamos planificar adecuadamente',
        
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
        'children-label': 'Número de Niños:',
        'children-placeholder': '¿Cuántos niños en total?',
        'guest-names-title': 'Por favor proporciona nombres y apellidos de todos los invitados que asistirán:',
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