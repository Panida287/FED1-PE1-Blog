const mainContents = document.querySelector('.main-contents-display');

// Fetch data from API
fetch('https://v2.api.noroff.dev/blog/posts/panpae')
    .then(response => response.json())
    .then(data => {
        const posts = data.data;

        posts.forEach(post => {
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
                    window.location.href = `post.html?id=${post.id}&tags=${tagsString}`;
                });
                contentBody.appendChild(readMoreButton);
            }
            contents.appendChild(contentBody);
        });
    })
    .catch(error => {
        console.error('Error fetching or processing data:', error.message);
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-fetching-data');
        errorElement.textContent = error.message;
        // Append the error message to the main contents display area
        mainContents.appendChild(errorElement);
    });
