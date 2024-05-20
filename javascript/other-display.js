import { fetchData, createPostElement } from './functions.js';

const highlightDisplay = document.querySelector('.highlight-display');
const mainContents = document.querySelector('.main-contents-display');
const carousel = document.querySelector('[data-carousel]');
const slidesContainer = carousel.querySelector('[data-slides]');
const blog = 'https://v2.api.noroff.dev/blog/posts/panpae';
const accessToken = localStorage.getItem('accessToken');

fetchData(blog, 12, 1, '', '', accessToken)
    .then(({ posts }) => {
        // Highlight Posts
        const highlightPosts = posts.slice(7, 11);
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
        const moreRecipes = posts.slice(0, 6);
        moreRecipes.forEach(post => {
            const postElement = createPostElement(post);
            mainContents.appendChild(postElement);
        });

        // Latest Posts for Carousel
        const latestPosts = posts.slice(0, 3);
        latestPosts.forEach((post, index) => {
            const slideId = `slide-${index + 1}`;
            const slide = slidesContainer.querySelector(`#${slideId}`);
            const slideTitle = slide.querySelector('.slide-title');
            const slideText = slide.querySelector('.slide-text');
            const tagsString = post.tags.join(',');

            slide.setAttribute('href', `single-post.html?id=${post.id}&tags=${tagsString}`);
            slideTitle.textContent = post.title;
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
        mainContents.appendChild(errorElement);
    });
