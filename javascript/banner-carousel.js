document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('[data-carousel-button="prev"]');
    const nextButton = document.querySelector('[data-carousel-button="next"]');
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
});
