import { fetchData, displayPosts, applyFilter, applyPagination, applySearch } from './functions.js';
import { capitalizeFirstLetter, } from './utils.js';

const mainContents = document.querySelector('.main-contents-display');
const blog = 'https://v2.api.noroff.dev/blog/posts/panpae';
const limit = 12;
let page = 1;
const accessToken = localStorage.getItem('accessToken');

const fetchAndDisplay = (tag = '', searchTerm = '') => {
    return fetchData(blog, limit, page, tag, searchTerm, accessToken)
        .then(({ posts, meta }) => {
            displayPosts(posts, mainContents);
            const header = document.getElementById('header');
            const noRecipeFound = document.getElementById('no-recipe-found');
            header.style.display = 'flex';
            noRecipeFound.style.display = 'none';


            // Update pagination
            const currentPageNumber = document.getElementById('current-page');
            currentPageNumber.innerText = meta.currentPage || 1;

            document.getElementById('previous').disabled = meta.isFirstPage || !!searchTerm;
            document.getElementById('next').disabled = meta.isLastPage || !!searchTerm;

            return { posts, meta };
        })
        .catch(error => {
            console.error('Error:', error);
            return { posts: [], meta: {} };
        });
};

// Initial fetch and display
fetchAndDisplay().then()

const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('previous');
const searchInput = document.getElementById('search-input');

const updatePage = (increment) => {
    page += increment;
};

applyPagination(nextBtn, prevBtn, fetchAndDisplay, searchInput, updatePage);

const filterButtons = document.querySelectorAll('.category-container button');
applyFilter(filterButtons, async (tag) => {
    page = 1;  // Reset page to 1
    const header = document.getElementById('header');
    header.innerText = capitalizeFirstLetter(tag);
    await fetchAndDisplay(tag); // Handle promise with await
});

const viewAllButton = document.getElementById('view-all');
viewAllButton.addEventListener('click', async () => {
    mainContents.innerHTML = '';
    const header = document.getElementById('header');
    header.innerText = 'All recipes';
    page = 1;  // Reset page to 1
    await fetchAndDisplay(); // Handle promise with await
});

const searchBtn = document.getElementById('search-btn');
applySearch(searchBtn, searchInput, fetchAndDisplay);
