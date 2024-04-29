    const carousel = document.querySelector('.carousel[data-carousel]');
    const slidesContainer = carousel.querySelector('[data-slides]');

    // Fetch data from API
    fetch('https://v2.api.noroff.dev/blog/posts/panpae')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(responseData => {
            const data = responseData.data; // Access the "data" property
            // Get the 3 latest posts
            const latestPosts = data.slice(0, 3);

            // Iterate over the latest posts and populate slides
            latestPosts.forEach((post, index) => {
                const slideId = `slide-${index + 1}`;
                const slide = slidesContainer.querySelector(`#${slideId}`);
                const slideTitle = slide.querySelector('.slide-title');
                const slideText = slide.querySelector('.slide-text');

                // Populate slide with post data
                slide.setAttribute('href', '#');
                slideTitle.textContent = post.title;
                // Truncate text to 200 characters and add "..." if necessary
                slideText.textContent = post.body.length > 200 ? post.body.substring(0, 200) + '...' : post.body;

                // Set image URL
                if (post.media && post.media.url) {
                    slide.style.backgroundImage = `url(${post.media.url})`;
                    slide.style.backgroundRepeat = 'no-repeat';
                    slide.style.backgroundSize = 'cover';
                    slide.style.backgroundPosition = 'center';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error.message);
        });

