export function checkIfLoggedIn() {
    // Retrieve the accessToken and userData from localStorage
    const accessToken = localStorage.getItem('accessToken');
    const userDataString = localStorage.getItem('userData');

    if (!accessToken || !userDataString) {
        // If either the accessToken or userData is missing, redirect to login
        window.location.href = 'login.html';
        return;
    }

    // If everything is fine, you can continue with your application logic
    console.log('Access token is valid.');
}

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

export function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('main-contents-container');

    const thumbnail = document.createElement('a');
    const tagsString = post.tags.join(',');
    thumbnail.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
    thumbnail.classList.add('main-contents-thumbnail');
    thumbnail.style.backgroundImage = `url(${post.media.url})`;
    thumbnail.style.backgroundRepeat = 'no-repeat';
    thumbnail.style.backgroundSize = 'cover';
    thumbnail.style.backgroundPosition = 'center';
    postElement.appendChild(thumbnail);

    const overlay = document.createElement('div');
    overlay.classList.add('main-contents-overlay');
    thumbnail.appendChild(overlay);

    const contentTitle = document.createElement('h4');
    contentTitle.textContent = post.title;
    thumbnail.appendChild(contentTitle);

    const contentBody = document.createElement('p');
    const words = post.body.split(' ');
    const truncatedText = words.slice(0, 10).join(' ');
    contentBody.innerHTML = truncatedText + '...<br><br>';
    postElement.appendChild(contentBody);

    const readMoreButton = document.createElement('button');
    readMoreButton.textContent = 'Read more';
    readMoreButton.classList.add('btn-black');
    readMoreButton.classList.add('read-more');
    readMoreButton.addEventListener('click', () => {
        window.location.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
    });
    postElement.appendChild(readMoreButton);

    return postElement;
}

export function displayPostsAdmin(posts, container) {
    container.innerHTML = '';
    posts.forEach(post => {
        const postElement = createPostElementAdmin(post);
        container.appendChild(postElement);
    });
}

function createPostElementAdmin(post) {
    const contents = document.createElement('div');
    contents.classList.add('post');

    const image = document.createElement('div');
    image.classList.add('img');
    image.style.backgroundImage = `url(${post.media.url})`;
    image.style.backgroundRepeat = 'no-repeat';
    image.style.backgroundSize = 'cover';
    image.style.backgroundPosition = 'center';
    contents.appendChild(image);

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('details');
    contents.appendChild(detailsContainer);

    const contentTitle = document.createElement('div');
    contentTitle.classList.add('title');
    contentTitle.innerHTML = post.title;
    detailsContainer.appendChild(contentTitle);

    const contentBody = document.createElement('div');
    contentBody.classList.add('body');
    const words = post.body.split(' ');
    if (words.length > 20) {
        const truncatedText = words.slice(0, 20).join(' ');
        contentBody.innerHTML = truncatedText + '...<br><br>';
    } else {
        contentBody.innerHTML = post.body;
    }
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
    contents.appendChild(btnsContainer);

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

    const viewPost = contents.querySelector('.view-post-btn');
    viewPost.addEventListener('click', (e) => {
        e.preventDefault();
        const tagsString = post.tags.join(',');
        const postId = post.id;
        const url = `single-post.html?id=${postId}&tags=${tagsString}`;
        window.open(url, '_blank');
    });

    const editPost = contents.querySelector('.edit-btn');
    editPost.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = post.id;
        const tagsString = post.tags.join(',');
        window.location.href = `edit-post.html?id=${postId}&tags=${tagsString}`;
    });

    const deleteDialog = contents.querySelector('.delete-btn');
    deleteDialog.addEventListener('click', (e) => {
        e.preventDefault();
        const deleteConfirmBtn = document.getElementById('delete-dialog');
        const overlay = document.getElementById('overlay');
        deleteConfirmBtn.style.display = 'flex';
        overlay.style.display = 'flex';
        const deleteConfirm = document.getElementById('delete-confirm');
        deleteConfirm.addEventListener('click', () => {
            const deleteConfirmBtn = document.getElementById('delete');
            const overlay = document.getElementById('overlay');
            deleteConfirmBtn.style.display = 'none';
            overlay.style.display = 'none';
            deletePost(post.id, accessToken)
                .then(() => {
                    contents.remove();
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

    return contents;
}

function deletePost(postId, accessToken) {
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

// Search functionality
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
        seeMoreBtn.addEventListener('click', (e) => {
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

    logoutBtn.addEventListener('click', function() {
        logoutBox.style.display = 'flex';
        overlay.style.display = 'flex';
    });

    logoutConfirm.addEventListener("click", function() {
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");
        window.location.href = 'login.html';
    });

    logoutAbort.addEventListener('click', function() {
        logoutBox.style.display = 'none';
        overlay.style.display = 'none';
    });
}

seeMore()


