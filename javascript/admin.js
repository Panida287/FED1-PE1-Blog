import { fetchData, displayPostsAdmin, applyPagination, applyFilter, applySearch } from './functions.js';
import { capitalizeFirstLetter } from './utils.js';


const postsContainer = document.getElementById('posts-container');
const accessToken = localStorage.getItem('accessToken');
const blog = 'https://v2.api.noroff.dev/blog/posts/panpae';
const limit = 6;
let page = 1;
let currentSearchTerm = '';
let currentTag = '';

const fetchAndDisplay = (tag = '', searchTerm = '') => {
    fetchData(blog, limit, page, tag, searchTerm, accessToken)
        .then(({ posts, meta }) => {
            displayPostsAdmin(posts, postsContainer);

            // Update pagination
            const currentPageNumber = document.getElementById('current-page');
            currentPageNumber.innerText = meta.currentPage || 1;

            document.getElementById('previous').disabled = meta.isFirstPage || !!searchTerm;
            document.getElementById('next').disabled = meta.isLastPage || !!searchTerm;
        })
        .catch(error => console.error('Error:', error));
};

fetchAndDisplay();

const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('previous');
const searchInput = document.getElementById('search-input');

const updatePage = (increment) => {
    page += increment;
};

applyPagination(nextBtn, prevBtn, fetchAndDisplay, searchInput, updatePage);

document.getElementById('post-new').addEventListener('click', () => {
    window.location.href = 'new-post.html';
});

const filterBtn = document.getElementById('filter');
const dropdown = document.getElementById('filter-dropdown');

filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('click', (e) => {
    if (!filterBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

const filterButtons = document.querySelectorAll('#filter-dropdown button:not(#view-all)');
applyFilter(filterButtons, tag => {
    currentTag = tag;
    document.querySelector('.post-header').innerText = capitalizeFirstLetter(currentTag);
    currentSearchTerm = '';
    postsContainer.innerHTML = '';
    page = 1;  // Reset page to 1
    fetchAndDisplay(currentTag);
    dropdown.style.display = 'none';
});

document.getElementById('view-all').addEventListener('click', () => {
    postsContainer.innerHTML = '';
    document.querySelector('.post-header').innerText = 'all recipes';
    currentTag = '';
    currentSearchTerm = '';
    page = 1;  // Reset page to 1
    fetchAndDisplay();
    dropdown.style.display = 'none';
});

const searchBtn = document.getElementById('search-btn');
applySearch(searchBtn, searchInput, fetchAndDisplay);
