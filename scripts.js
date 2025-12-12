const time = document.querySelector('.time');
const daysLeft = document.querySelector('.days-left');
const weddingDate = new Date("2026-04-10T17:00:00").getTime();
const toggleMenu = document.querySelector('.toggle-menu')
const navList = document.querySelector('.nav-list')
const navLinks = document.querySelectorAll('.nav-link')
const icon = document.getElementsByTagName('i');
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