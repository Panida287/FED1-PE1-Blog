import { fetchData, displayPosts, capitalizeFirstLetter, applyFilter, applyPagination, applySearch } from './functions.js';

const mainContents = document.querySelector('.main-contents-display');
const blog = 'https://v2.api.noroff.dev/blog/posts/panpae';
const limit = 12;
let page = 1;
const accessToken = localStorage.getItem('accessToken');

const fetchAndDisplay = (tag = '', searchTerm = '') => {
    fetchData(blog, limit, page, tag, searchTerm, accessToken)
        .then(({ posts, meta }) => {
            displayPosts(posts, mainContents);

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

const filterButtons = document.querySelectorAll('.category-container button');
applyFilter(filterButtons, tag => {
    page = 1;  // Reset page to 1
    const header = document.getElementById('header');
    header.innerText = capitalizeFirstLetter(tag);
    fetchAndDisplay(tag);
});

const viewAllButton = document.getElementById('view-all');
viewAllButton.addEventListener('click', () => {
    mainContents.innerHTML = '';
    const header = document.getElementById('header');
    header.innerText = 'All recipes';
    page = 1;  // Reset page to 1
    fetchAndDisplay();
});

const searchBtn = document.getElementById('search-btn');
applySearch(searchBtn, searchInput, fetchAndDisplay);
