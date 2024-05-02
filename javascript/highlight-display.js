const highlightDisplay = document.querySelector('.highlight-display');

// Fetch data from API
fetch('https://v2.api.noroff.dev/blog/posts/panpae')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        const posts = data.data.slice(4, 8);

        // Iterate over the posts
        posts.forEach(post => {
            const highlightContent = document.createElement('div');
            highlightContent.classList.add('highlight-content');

            const thumbnailLink = document.createElement('a');
            thumbnailLink.classList.add('highlight-thumbnail');
            thumbnailLink.href = `post.html?id=${post.id}`;
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
    })
    .catch(error => {
        console.error('Error fetching or processing data:', error.message);
        const errorElement = document.createElement('div');
        errorElement.classList.add('error fetching data');
        errorElement.textContent = error.message;
        // Append the error message to the highlight display area
        highlightDisplay.appendChild(errorElement);
    });

