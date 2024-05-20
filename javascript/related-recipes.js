
import { getQueryParamValue } from './utils.js';

const relatedContent = document.querySelector('.related-content');
const blogUrl = 'https://v2.api.noroff.dev/blog/posts/panpae';

// Extract the 'id' parameter
const postId = getQueryParamValue('id');

// Function to fetch the current post and get its tags
function fetchCurrentPost(postId) {
    const apiUrl = `${blogUrl}/${postId}`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the current post');
            }
            return response.json();
        })
        .then(data => {
            return data.data.tags;
        })
        .catch(error => {
            console.error('Error fetching the current post:', error.message);
        });
}

// Function to fetch related posts with similar tags
function fetchRelatedPosts(tags, currentPostId) {
    const apiUrl = `${blogUrl}`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch related posts');
            }
            return response.json();
        })
        .then(data => {
            return data.data.filter(post => post.id !== currentPostId && post.tags.some(tag => tags.includes(tag)));
        })
        .catch(error => {
            console.error('Error fetching related posts:', error.message);
            const errorElement = document.createElement('div');
            errorElement.classList.add('error-fetching-data');
            errorElement.textContent = error.message;
            relatedContent.appendChild(errorElement);
            return [];
        });
}

// Function to display related posts
function displayRelatedPosts(relatedPosts) {
    relatedContent.innerHTML = '';

    if (relatedPosts.length === 0) {
        relatedContent.innerHTML = '<p>No related recipes found</p>';
        return;
    }

    relatedPosts.slice(0, 4).forEach(post => {
        const tagsString = post.tags.join(', ');
        const relatedPostImage = document.createElement('a');
        relatedPostImage.classList.add('related-thumbnail');
        relatedPostImage.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
        relatedPostImage.style.backgroundImage = `url(${post.media.url})`;
        relatedPostImage.style.backgroundRepeat = 'no-repeat';
        relatedPostImage.style.backgroundSize = 'cover';
        relatedPostImage.style.backgroundPosition = 'center';

        const relatedPostTitle = document.createElement('h2');
        relatedPostTitle.textContent = post.title;

        relatedContent.appendChild(relatedPostImage);
        relatedContent.appendChild(relatedPostTitle);
    });
}

// Fetch and display related posts based on the current post's tags
if (postId) {
    fetchCurrentPost(postId)
        .then(tags => {
            if (tags && tags.length > 0) {
                return fetchRelatedPosts(tags, postId);
            } else {
                throw new Error('No tags found for the current post');
            }
        })
        .then(relatedPosts => displayRelatedPosts(relatedPosts))
        .catch(error => console.error('Error displaying related posts:', error.message));
} else {
    console.error('Post ID is missing');
}
