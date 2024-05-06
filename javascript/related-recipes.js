const relatedContent = document.querySelector('.related-content');

// Function to extract query parameter value
function getQueryParamValue(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.getAll(parameter); // Use getAll to retrieve all values for a parameter
    return Array.isArray(paramValue) ? paramValue : [paramValue]; // Ensure it always returns an array
}

// Extract the 'tags' query parameter value
const postTags = getQueryParamValue('tags');

// Function to fetch related posts with similar tags
function fetchRelatedPosts(tags, currentPostId) {
    console.log('Fetching related posts with tags:', tags);
    const apiUrl = `${blog}panpae`;
    const tagQuery = `tags_like=${tags.join('&tags_like=')}`; // Use 'tags_like' to match similar tags
    return fetch(`${apiUrl}?${tagQuery}`) // Fetch posts with similar tags
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched related posts:', data);
            return data.data.filter(post => post.id !== currentPostId && post.tags.some(tag => tags.includes(tag)));
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error.message);
            const errorElement = document.createElement('div');
            errorElement.classList.add('error-fetching-data');
            errorElement.textContent = error.message;
            // Append the error message to the display area
            relatedContent.appendChild(errorElement);
            return []; // Return an empty array in case of error
        });
}

// Function to display related posts
function displayRelatedPosts(relatedPosts) {
    console.log('Displaying related posts:', relatedPosts);

    // Clear existing content in the relatedContent element
    relatedContent.innerHTML = '';

    const slicedRelatedPosts = relatedPosts.slice(0, 4);

    // Loop through the related posts and display them
    slicedRelatedPosts.forEach(post => {
        const tagsString = post.tags.join(',');
        const relatedPostImage = document.createElement('a');
        relatedPostImage.classList.add('related-thumbnail');
        relatedPostImage.href = `post.html?id=${post.id}&tags=${tagsString}`;
        relatedPostImage.style.backgroundImage = `url(${post.media.url})`;
        relatedPostImage.style.backgroundRepeat = 'no-repeat';
        relatedPostImage.style.backgroundSize = 'cover';
        relatedPostImage.style.backgroundPosition = 'center';

        relatedContent.appendChild(relatedPostImage);

        const relatedPostTitle = document.createElement('h2');
        relatedPostTitle.textContent = post.title;

        relatedContent.appendChild(relatedPostTitle);
    });
}

// Fetch and display related posts
if (postTags) {
    console.log('Post tags found:', postTags);
    fetchRelatedPosts(postTags, postId) // Pass the ID of the current post
        .then(relatedPosts => {
            // Display the related posts
            displayRelatedPosts(relatedPosts);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error.message);
            const errorElement = document.createElement('div');
            errorElement.classList.add('error-fetching-data');
            errorElement.textContent = error.message;
            // Append the error message to the display area
            relatedContent.appendChild(errorElement);
        });
} else {
    console.error('Post tags not found');
}

