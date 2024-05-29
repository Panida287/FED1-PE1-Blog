
// Function to format date and time
export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}

// Function to capitalize the first letter of a string
export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to validate URL
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

export function checkIfLoggedIn() {
    // Retrieve the accessToken and userData from localStorage
    const accessToken = localStorage.getItem('accessToken');
    const userDataString = localStorage.getItem('userData');

    if (!accessToken || !userDataString) {
        // If either the accessToken or userData is missing, redirect to login
        window.location.href = 'login.html';
    }
}

export function getQueryParamValue(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}

export function setupCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) {
        console.error('Carousel container not found');
        return;
    }

    const slides = carouselContainer.querySelectorAll('.slide');
    const prevButton = carouselContainer.querySelector('[data-carousel-button="prev"]');
    const nextButton = carouselContainer.querySelector('[data-carousel-button="next"]');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function goToSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        showSlide(currentIndex);
    }

    prevButton.addEventListener('click', function() {
        goToSlide(currentIndex - 1);
    });

    nextButton.addEventListener('click', function() {
        goToSlide(currentIndex + 1);
    });

    // Initial setup
    showSlide(currentIndex);
}


