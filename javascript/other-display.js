const highlightDisplay = document.querySelector('.highlight-display');
const mainContents = document.querySelector('.main-contents-display');

// Fetch data from API
fetch('https://v2.api.noroff.dev/blog/posts/panpae')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        // Highlight Posts
        const highlightPosts = data.data.slice(7, 11);
        highlightPosts.forEach(post => {
            const highlightContent = document.createElement('div');
            highlightContent.classList.add('highlight-content');

            const thumbnailLink = document.createElement('a');
            thumbnailLink.classList.add('highlight-thumbnail');
            thumbnailLink.href = `single-post.html?id=${post.id}`;
            thumbnailLink.style.backgroundImage = `url(${post.media.url})`;
            thumbnailLink.style.backgroundRepeat = 'no-repeat';
            thumbnailLink.style.backgroundSize = 'cover';
            thumbnailLink.style.backgroundPosition = 'center';

            highlightContent.appendChild(thumbnailLink);

            const titleElement = document.createElement('h4');
            titleElement.classList.add('highlight-title');
            titleElement.textContent = post.title;
            highlightContent.appendChild(titleElement);
            highlightDisplay.appendChild(highlightContent);
        });

        // More recipes
        const moreRecipes = data.data.slice(0, 6);
        moreRecipes.forEach(post => {
            const contents = document.createElement('div');
            contents.classList.add('main-contents-container');

            mainContents.appendChild(contents);

            const tagsString = post.tags[0];
            const thumbnail = document.createElement('a');
            thumbnail.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
            thumbnail.classList.add('main-contents-thumbnail');
            thumbnail.style.backgroundImage = `url(${post.media.url})`;
            thumbnail.style.backgroundRepeat = 'no-repeat';
            thumbnail.style.backgroundSize = 'cover';
            thumbnail.style.backgroundPosition = 'center';
            contents.appendChild(thumbnail);

            const overlay = document.createElement('div');
            overlay.classList.add('main-contents-overlay');
            thumbnail.appendChild(overlay);

            const contentTitle = document.createElement('h4');
            contentTitle.textContent = post.title;
            thumbnail.appendChild(contentTitle);

            const contentBody = document.createElement('p');
            const words = post.body.split(' ');

            if (words.length > 20) {
                const truncatedText = words.slice(0, 10).join(' ');
                contentBody.innerHTML = truncatedText + ['...<br><br>'];

                // Create a button element
                const readMoreButton = document.createElement('button');
                readMoreButton.textContent = 'Read more';
                readMoreButton.addEventListener('click', () => {
                    window.location.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
                });
                contentBody.appendChild(readMoreButton);
            }
            contents.appendChild(contentBody);
        });

        const carousel = document.querySelector('[data-carousel]');
        const slidesContainer = carousel.querySelector('[data-slides]');

        const latestPosts = data.data.slice(0, 3);

        // Iterate over the latest posts and populate slides
        latestPosts.forEach((post, index) => {
            const slideId = `slide-${index + 1}`;
            const slide = slidesContainer.querySelector(`#${slideId}`);
            const slideTitle = slide.querySelector('.slide-title');
            const slideText = slide.querySelector('.slide-text');
            const tagsString = post.tags;

            slide.setAttribute('href', `single-post.html?id=${post.id}&tags=${tagsString}`)
            slideTitle.textContent = post.title;
            // Truncate text to 200 characters and add "..."
            slideText.textContent = post.body.length > 200 ? post.body.substring(0, 200) + '...' : post.body;

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
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-fetching-data');
        errorElement.textContent = error.message;
        // Append the error message to the highlight display area
        mainContents.appendChild(errorElement);
    });
