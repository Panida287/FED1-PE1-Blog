import { isValidUrl, capitalizeFirstLetter, getQueryParamValue } from './utils.js';

export function fetchData(blog, limit, page, tag, searchTerm, accessToken) {
    const apiUrl = `${blog}?${searchTerm ? '' : `limit=${limit}&page=${page}`}${tag ? `&_tag=${tag}` : ''}`;
    return fetch(apiUrl, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            let posts = data.data;
            if (searchTerm) {
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                posts = posts.filter(post =>
                    post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                    post.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
                );
            }
            return { posts, meta: data.meta };
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error.message);
            return { posts: [], meta: {} };
        });
}

export function displayPosts(posts, container) {
    container.innerHTML = '';
    posts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

function createPostElementCommon(post, type = 'user') {
    const postElement = document.createElement('div');
    postElement.classList.add(type === 'admin' ? 'post' : 'main-contents-container');

    const thumbnail = document.createElement('a');
    const tagsString = post.tags.join(',');
    thumbnail.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
    thumbnail.classList.add(type === 'admin' ? 'img' : 'main-contents-thumbnail');
    thumbnail.style.backgroundImage = `url(${post.media.url})`;
    thumbnail.style.backgroundRepeat = 'no-repeat';
    thumbnail.style.backgroundSize = 'cover';
    thumbnail.style.backgroundPosition = 'center';
    postElement.appendChild(thumbnail);

    if (type !== 'admin') {
        const overlay = document.createElement('div');
        overlay.classList.add('main-contents-overlay');
        thumbnail.appendChild(overlay);
    }

    const contentTitle = document.createElement('h4');
    contentTitle.textContent = post.title;
    thumbnail.appendChild(contentTitle);

    const contentBody = document.createElement('p');
    const words = post.body.split(' ');
    const truncatedText = words.slice(0, 10).join(' ');
    contentBody.innerHTML = truncatedText + '...<br><br>';
    postElement.appendChild(contentBody);

    if (type !== 'admin') {
        const readMoreButton = document.createElement('button');
        readMoreButton.textContent = 'Read more';
        readMoreButton.classList.add('btn-black', 'read-more');
        readMoreButton.addEventListener('click', () => {
            window.location.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
        });
        postElement.appendChild(readMoreButton);
    } else {
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details');
        postElement.appendChild(detailsContainer);
        detailsContainer.appendChild(contentTitle);
        detailsContainer.appendChild(contentBody);

        const userContainer = document.createElement('div');
        userContainer.classList.add('user');
        detailsContainer.appendChild(userContainer);

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.style.backgroundImage = `url(${post.author.avatar.url})`;
        avatar.style.backgroundRepeat = 'no-repeat';
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        userContainer.appendChild(avatar);

        const username = document.createElement('p');
        username.classList.add('username');
        username.innerHTML = post.author.name;
        userContainer.appendChild(username);

        const dateAndTime = document.createElement('p');
        dateAndTime.classList.add('date-time');
        dateAndTime.innerHTML = new Date(post.created).toLocaleString();
        userContainer.appendChild(dateAndTime);

        const btnsContainer = document.createElement('div');
        btnsContainer.classList.add('btns-container');
        postElement.appendChild(btnsContainer);

        btnsContainer.innerHTML = `
            <button class="btn-black view-post-btn" aria-label="click to view post">
                view post
            </button>
            <button class="btn-black edit-btn" aria-label="click to edit post">
                edit
            </button>
            <button class="btn-red delete-btn" aria-label="click to delete post">
                delete
            </button>`;

        const viewPost = postElement.querySelector('.view-post-btn');
        viewPost.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`single-post.html?id=${post.id}&tags=${tagsString}`, '_blank');
        });

        const editPost = postElement.querySelector('.edit-btn');
        editPost.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `edit-post.html?id=${post.id}&tags=${tagsString}`;
        });

        const deleteDialog = postElement.querySelector('.delete-btn');
        deleteDialog.addEventListener('click', (e) => {
            e.preventDefault();
            const deleteConfirmBtn = document.getElementById('delete-dialog');
            const overlay = document.getElementById('overlay');
            deleteConfirmBtn.style.display = 'flex';
            overlay.style.display = 'flex';
            const deleteConfirm = document.getElementById('delete-confirm');
            deleteConfirm.addEventListener('click', () => {
                deleteConfirmBtn.style.display = 'none';
                overlay.style.display = 'none';
                deletePost(post.id)
                    .then(() => {
                        postElement.remove();
                    });
            });
        });

        const deleteAbortBtn = document.getElementById('delete-abort');
        deleteAbortBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = document.getElementById('overlay');
            const deleteDialog = document.getElementById('delete-dialog');
            deleteDialog.style.display = 'none';
            overlay.style.display = 'none';
        });
    }

    return postElement;
}

export function createPostElement(post) {
    return createPostElementCommon(post, 'user');
}

export function createPostElementAdmin(post) {
    return createPostElementCommon(post, 'admin');
}

function deletePost(postId) {
    const accessToken = localStorage.getItem('accessToken');
    return fetch(`https://v2.api.noroff.dev/blog/posts/panpae/${postId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });
}

// Apply pagination functionality
export function applyPagination(nextBtn, prevBtn, fetchAndDisplay, searchInput, updatePage) {
    nextBtn.addEventListener('click', () => {
        if (!searchInput.value) {
            updatePage(1);
            fetchAndDisplay();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (!searchInput.value) {
            updatePage(-1);
            fetchAndDisplay();
        }
    });
}

// Apply filter functionality
export function applyFilter(filterButtons, callback) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.id;
            callback(tag);
        });
    });
}

export function applySearch(searchBtn, searchInput, fetchAndDisplay) {
    const search = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const header = document.getElementById('header');
        const noRecipeFound = document.getElementById('no-recipe-found');
        if (searchTerm) {
            header.style.display = 'none';
            fetchAndDisplay('', searchTerm).then(result => {
                if(result.posts.length === 0){
                    header.style.display = 'none';
                    noRecipeFound.style.display = 'block';
                    noRecipeFound.textContent = 'No recipes found';
                } else {
                    noRecipeFound.style.display = 'none';
                }
            });
        } else {
            header.style.display = 'flex';
            noRecipeFound.style.display = 'none';
            fetchAndDisplay();
        }
    };


    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            search();
        }
    });
}

export function seeMore() {
    const seeMoreBtn = document.querySelector('.see-more');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            window.location.href = 'browse.html';
        });
    }
}

export function initializeAdminPanel() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const avatar = document.getElementById("admin-avatar");
    const username = document.getElementById("admin-username");
    const logoutBtn = document.getElementById("logout-btn");
    const logoutConfirm = document.getElementById("logout-confirm");
    const logoutAbort = document.getElementById("logout-abort");
    const logoutBox = document.getElementById("logout-box");
    const overlay = document.getElementById('overlay');

    if (userData && userData.data && userData.data.avatar && userData.data.avatar.url) {
        avatar.style.backgroundImage = `url(${userData.data.avatar.url})`;
        avatar.style.backgroundPosition = 'center';
        avatar.style.backgroundRepeat = 'no-repeat';
        avatar.style.backgroundSize = 'cover';
    }

    if (userData && userData.data && userData.data.name) {
        username.textContent = userData.data.name;
    }

    logoutBtn.addEventListener('click', () => {
        logoutBox.style.display = 'flex';
        overlay.style.display = 'flex';
    });

    logoutConfirm.addEventListener('click', () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");
        window.location.href = 'login.html';
    });

    logoutAbort.addEventListener('click', () => {
        logoutBox.style.display = 'none';
        overlay.style.display = 'none';
    });
}

export function setupNewPostButton() {
    const newPostButton = document.getElementById('post-new');
    if (newPostButton) {
        newPostButton.addEventListener('click', () => {
            window.location.href = 'new-post.html';
        });
    }
}

export function editPostForm() {
    const postId = getQueryParamValue('id');
    if (postId) {
        fetch(`https://v2.api.noroff.dev/blog/posts/panpae/${postId}`)
            .then(response => response.ok ? response.json() : Promise.reject(new Error('Network response was not ok')))
            .then(data => {
                const selectedPost = data.data;
                console.log(selectedPost);

                if (selectedPost) {
                    document.getElementById('title').value = selectedPost.title;
                    document.getElementById('body').value = selectedPost.body;
                    document.getElementById('tags').value = selectedPost.tags.join(', ');
                    document.getElementById('imageUrl').value = selectedPost.media.url; // Corrected property name
                }
            })
            .catch(error => {
                console.error('Error fetching or processing data:', error.message);
                const errorElement = document.createElement('div');
                errorElement.classList.add('error', 'fetching-data');
                errorElement.textContent = error.message;
                document.body.appendChild(errorElement); // Append the error message to the body or a specific container
            });
    }
}

export function setupBackToAdminButton() {
    const backToAdmin = document.getElementById('back-to-admin');
    if (backToAdmin) {
        backToAdmin.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }
}

export function handleFormSubmission(method, postId = null) {
    return function(event) {
        event.preventDefault();

        const titleData = document.getElementById('title').value;
        const bodyData = document.getElementById('body').value;
        const tagsData = document.getElementById('tags').value;
        const imageData = document.getElementById('imageUrl').value;
        const postSuccess = document.getElementById('post-success');
        const overlay = document.getElementById('overlay');

        const postData = {
            title: titleData,
            body: bodyData.trim() !== "" ? bodyData : undefined,
            tags: tagsData.trim() !== "" ? [tagsData] : undefined,
            media: isValidUrl(imageData) ? { url: imageData } : undefined,
        };

        let url = postId ? `${apiUrl}/${postId}` : apiUrl;
        const accessToken = localStorage.getItem('accessToken');

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.ok ? response.json() : Promise.reject(new Error('Network response was not ok')))
            .then(data => {
                console.log('Success:', data);
                formData.reset();
                postSuccess.style.display = 'flex';
                overlay.style.display = 'flex';
            })
            .catch(error => {
                console.error('Error:', error.message);
            });

        document.getElementById('success-close-btn').addEventListener('click', () => {
            postSuccess.style.display = 'none';
            overlay.style.display = 'none';
            window.location.href = 'admin.html';
        });
    };
}

export function setupFormHandlers() {
    const previewBtn = document.getElementById('preview-btn');
    const postNewBtn = document.getElementById('new-post');
    const editPostBtn = document.getElementById('edit-post');

    const handleSubmission = (method, postId = '') => handleFormSubmission(method, postId);

    if (postNewBtn) {
        postNewBtn.addEventListener('click', handleSubmission('POST'));
    }

    if (editPostBtn) {
        const postId = getQueryParamValue('id'); // Retrieve postId from query params
        editPostBtn.addEventListener('click', handleSubmission('PUT', postId));
    }

    previewBtn.addEventListener('click', event => {
        event.preventDefault();
        const titleData = document.getElementById('title').value;
        const bodyData = document.getElementById('body').value;
        const imageData = document.getElementById('imageUrl').value;

        const overlay = document.getElementById('overlay');
        const previewContent = document.getElementById('preview');
        document.getElementById('preview-title').textContent = titleData;
        document.getElementById('preview-body').textContent = bodyData;
        const previewImage = document.getElementById('preview-img');
        previewImage.style.backgroundImage = `url(${imageData})`;
        previewImage.style.backgroundRepeat = 'no-repeat';
        previewImage.style.backgroundSize = 'cover';
        previewImage.style.backgroundPosition = 'center';

        overlay.style.display = 'flex';
        previewContent.style.display = 'flex';

        document.getElementById('preview-close-btn').addEventListener('click', () => {
            previewContent.style.display = 'none';
            overlay.style.display = 'none';
        });
    });
}

export function fetchAndDisplayPosts(blog, limit, page, tag, searchTerm, accessToken, postsContainer) {
    fetchData(blog, limit, page, tag, searchTerm, accessToken)
        .then(({ posts, meta }) => {
            displayPosts(posts, postsContainer, createPostElementAdmin);

            // Update pagination
            const currentPageNumber = document.getElementById('current-page');
            currentPageNumber.innerText = meta.currentPage || 1;

            document.getElementById('previous').disabled = meta.isFirstPage || !!searchTerm;
            document.getElementById('next').disabled = meta.isLastPage || !!searchTerm;
        })
        .catch(error => console.error('Error:', error));
}

export function setupFilterButtons(filterBtn, dropdown, filterButtons, fetchAndDisplayPosts, capitalizeFirstLetter, postsContainer) {
    filterBtn.addEventListener('click', e => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', e => {
        if (!filterBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    applyFilter(filterButtons, tag => {
        const currentTag = tag;
        document.querySelector('.post-header').innerText = capitalizeFirstLetter(currentTag);
        const currentSearchTerm = '';
        postsContainer.innerHTML = '';
        fetchAndDisplayPosts(currentTag, currentSearchTerm);
        dropdown.style.display = 'none';
    });

    document.getElementById('view-all').addEventListener('click', () => {
        postsContainer.innerHTML = '';
        document.querySelector('.post-header').innerText = 'all recipes';
        fetchAndDisplayPosts();
        dropdown.style.display = 'none';
    });
}

export function setupAdminPage() {
    const postsContainer = document.getElementById('posts-container');
    const accessToken = localStorage.getItem('accessToken');
    const blog = 'https://v2.api.noroff.dev/blog/posts/panpae';
    const limit = 6;
    let page = 1;
    let currentSearchTerm = '';
    let currentTag = '';

    fetchAndDisplayPosts(blog, limit, page, currentTag, currentSearchTerm, accessToken, postsContainer);

    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('previous');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const updatePage = increment => {
        page += increment;
    };

    applyPagination(nextBtn, prevBtn, () => fetchAndDisplayPosts(blog, limit, page, currentTag, currentSearchTerm, accessToken, postsContainer), searchInput, updatePage);

    const filterBtn = document.getElementById('filter');
    const dropdown = document.getElementById('filter-dropdown');
    const filterButtons = document.querySelectorAll('#filter-dropdown button:not(#view-all)');

    setupFilterButtons(filterBtn, dropdown, filterButtons, (tag, searchTerm) => fetchAndDisplayPosts(blog, limit, page, tag, searchTerm, accessToken, postsContainer), capitalizeFirstLetter, postsContainer);

    // Function to handle search
    const handleSearch = () => {
        currentSearchTerm = searchInput.value.trim().toLowerCase();
        fetchAndDisplayPosts(blog, limit, page, currentTag, currentSearchTerm, accessToken, postsContainer);
    };

    // Add event listener for the search button
    searchBtn.addEventListener('click', handleSearch);

    // Add event listener for pressing Enter in the search input
    searchInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Apply search functionality
    applySearch(searchBtn, searchInput, () => fetchAndDisplayPosts(blog, limit, page, currentTag, currentSearchTerm, accessToken, postsContainer));
}

export function login() {
    const form = document.getElementById('form');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('https://v2.api.noroff.dev/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json().then(data => {
                if (!response.ok) {
                    const errorMessage = data.errors && data.errors.length > 0
                        ? data.errors[0].message
                        : 'Failed to login';
                    throw new Error(errorMessage);
                }
                return data;
            }))
            .then(data => {
                console.log(data);
                localStorage.setItem('userData', JSON.stringify(data));
                localStorage.setItem('accessToken', data.data.accessToken);
                window.location.href = 'admin.html';
            })
            .catch(error => {
                console.error('Error:', error.message);
                document.getElementById('message').textContent = error.message;
            });
    });
}

export function register() {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOM fully loaded and parsed');
        const form = document.getElementById('form');
        const messageDiv = document.getElementById('message');
        const overlay = document.querySelector('.overlay');
        const successfulMessage = document.querySelector('.successful');
        const goToLoginButton = document.getElementById('go-to-login');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log('Form submit event triggered');

            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const repeatPassword = document.getElementById('repeat-password').value;
            const avatar = document.getElementById('avatar').value;
            const bio = document.getElementById('bio').value;

            if (password !== repeatPassword) {
                messageDiv.textContent = 'Passwords do not match';
                console.log('Passwords do not match');
                return;
            }

            const emailPattern = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
            if (!emailPattern.test(email)) {
                messageDiv.textContent = 'Email must be @stud.noroff.no';
                console.log('Email format is incorrect');
                return;
            }

            const payload = {
                name: username,
                email: email,
                password: password,
                ...(bio && { bio }),
                ...(avatar && { avatar: { url: avatar, alt: '' } })
            };

            console.log('Payload:', payload);

            fetch('https://v2.api.noroff.dev/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(response => response.json().then(data => {
                    if (!response.ok) {
                        const errorMessage = data.errors && data.errors.length > 0
                            ? data.errors[0].message
                            : 'Failed to register';
                        throw new Error(errorMessage);
                    }
                    return data;
                }))
                .then(data => {
                    overlay.style.display = 'block';
                    successfulMessage.style.display = 'flex';
                })
                .catch(error => {
                    console.error('Registration error:', error.message);
                    messageDiv.textContent = `Registration failed: ${error.message}`;
                });
        });

        goToLoginButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    });
}

export function displayPostDetails() {
    const avatarImage = document.querySelector('.avatar-img');
    const authorName = document.querySelector('.author-name');
    const authorBio = document.querySelector('.bio');
    const title = document.querySelector('.title');
    const recipeTitle = document.querySelector('.recipe-title');
    const image = document.querySelector('.content-img');
    const recipeImage = document.querySelector('.recipe-img');
    const dateAndTime = document.querySelector('.date-time');
    const body = document.querySelector('.content-body');

    const postId = getQueryParamValue('id');
    const blog = "https://v2.api.noroff.dev/blog/posts/";

    if (postId) {
        fetch(`${blog}panpae/${postId}`)
            .then(response => response.ok ? response.json() : Promise.reject(new Error('Network response was not ok')))
            .then(data => {
                const selectedPost = data.data;
                console.log(selectedPost);

                if (selectedPost) {
                    title.textContent = selectedPost.title;
                    recipeTitle.textContent = selectedPost.title;

                    dateAndTime.textContent = formatDateTime(selectedPost.created);

                    setElementBackground(image, selectedPost.media.url, 'content-image');
                    setElementBackground(recipeImage, selectedPost.media.url, 'recipe-image');

                    body.textContent = selectedPost.body;

                    if (avatarImage) {
                        setElementBackground(avatarImage, selectedPost.author.avatar.url);
                    } else {
                        console.error('Avatar image element not found');
                    }

                    if (authorName) {
                        authorName.textContent = selectedPost.author.name;
                    } else {
                        console.error('Author name element not found');
                    }

                    if (authorBio) {
                        authorBio.textContent = selectedPost.author.bio;
                    } else {
                        console.error('Author bio element not found');
                    }
                } else {
                    console.error('Selected post not found');
                }
            })
            .catch(error => {
                console.error('Error fetching or processing data:', error.message);
                const errorElement = document.createElement('div');
                errorElement.classList.add('error', 'fetching-data');
                errorElement.textContent = error.message;
                document.body.appendChild(errorElement);
            });

        function formatDateTime(dateTimeString) {
            const date = new Date(dateTimeString);
            return date.toLocaleString();
        }

        function setElementBackground(element, url, className = '') {
            if (className) {
                element.classList.add(className);
            }
            element.style.backgroundImage = `url(${url})`;
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundSize = 'cover';
            element.style.backgroundPosition = 'center';
        }
    }
}

export function displayBlogContents() {
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
                const words = post.body.split(' ');
                slideText.textContent = words.length > 15 ? words.slice(0, 15).join(' ') + '...' : post.body;

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
}

export function displayRelatedPostsSection() {
    const relatedContent = document.querySelector('.related-content');
    const blogUrl = 'https://v2.api.noroff.dev/blog/posts/panpae';

    const postId = getQueryParamValue('id');

    if (postId) {
        fetchCurrentPost(postId)
            .then(tags => tags.length > 0 ? fetchRelatedPosts(tags, postId) : Promise.reject(new Error('No tags found for the current post')))
            .then(relatedPosts => displayRelatedPosts(relatedPosts, relatedContent))
            .catch(error => console.error('Error displaying related posts:', error.message));
    } else {
        console.error('Post ID is missing');
    }

    function fetchCurrentPost(postId) {
        const apiUrl = `${blogUrl}/${postId}`;
        return fetch(apiUrl)
            .then(response => response.ok ? response.json() : Promise.reject(new Error('Failed to fetch the current post')))
            .then(data => data.data.tags)
            .catch(error => console.error('Error fetching the current post:', error.message));
    }

    function fetchRelatedPosts(tags, currentPostId) {
        const apiUrl = `${blogUrl}`;
        return fetch(apiUrl)
            .then(response => response.ok ? response.json() : Promise.reject(new Error('Failed to fetch related posts')))
            .then(data => data.data.filter(post => post.id !== currentPostId && post.tags.some(tag => tags.includes(tag))))
            .catch(error => {
                console.error('Error fetching related posts:', error.message);
                const errorElement = document.createElement('div');
                errorElement.classList.add('error-fetching-data');
                errorElement.textContent = error.message;
                relatedContent.appendChild(errorElement);
                return [];
            });
    }

    function displayRelatedPosts(relatedPosts, container) {
        container.innerHTML = '';

        if (relatedPosts.length === 0) {
            container.innerHTML = '<p>No related recipes found</p>';
            return;
        }

        relatedPosts.slice(0, 4).forEach(post => {
            const tagsString = post.tags.join(', ');
            const relatedPostImage = document.createElement('a');
            relatedPostImage.classList.add('related-thumbnail');
            relatedPostImage.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
            setElementBackground(relatedPostImage, post.media.url);

            const relatedPostTitle = document.createElement('h2');
            relatedPostTitle.textContent = post.title;

            container.appendChild(relatedPostImage);
            container.appendChild(relatedPostTitle);
        });
    }

    function setElementBackground(element, url) {
        element.style.backgroundImage = `url(${url})`;
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
    }
}

export function setupBrowsePage(blog, limit, accessToken) {
    const mainContents = document.querySelector('.main-contents-display');
    if (!mainContents) {
        console.error('Main contents container not found');
        return;
    }

    let page = 1;

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
    fetchAndDisplay();

    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('previous');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const viewAllButton = document.getElementById('view-all');
    const filterButtons = document.querySelectorAll('.category-container button');

    const updatePage = increment => {
        page += increment;
        fetchAndDisplay();
    };

    // Custom applyPagination to correctly call updatePage
    const applyPagination = (nextBtn, prevBtn, searchInput) => {
        nextBtn.addEventListener('click', () => {
            if (!searchInput.value) {
                updatePage(1);
            }
        });

        prevBtn.addEventListener('click', () => {
            if (!searchInput.value) {
                updatePage(-1);
            }
        });
    };

    applyPagination(nextBtn, prevBtn, searchInput);

    applyFilter(filterButtons, async tag => {
        page = 1; // Reset page to 1
        const header = document.getElementById('header');
        header.innerText = capitalizeFirstLetter(tag);
        await fetchAndDisplay(tag); // Handle promise with await
    });

    if (viewAllButton) {
        viewAllButton.addEventListener('click', async () => {
            mainContents.innerHTML = '';
            const header = document.getElementById('header');
            header.innerText = 'All recipes';
            page = 1; // Reset page to 1
            await fetchAndDisplay(); // Handle promise with await
        });
    }

    if (searchBtn) {
        applySearch(searchBtn, searchInput, fetchAndDisplay);
    }

    // Add event listener for pressing Enter in the search input
    searchInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            fetchAndDisplay('', searchInput.value.trim().toLowerCase());
        }
    });
}