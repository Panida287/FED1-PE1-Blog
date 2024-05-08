const postsContainer = document.getElementById('posts-container');
const accessToken = localStorage.getItem('accessToken');


fetch('https://v2.api.noroff.dev/blog/posts/panpae')
    .then(res => res.json())
    .then(data => {
        const posts = data.data;

        posts.forEach(post => {
            const contents = document.createElement('div');
            contents.classList.add('post');

            postsContainer.appendChild(contents);

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
            dateAndTime.innerHTML = formatDateTime(post.created);

            userContainer.appendChild(dateAndTime);

            const btnsContainer = document.createElement('div');
            btnsContainer.classList.add('btns-container');
            contents.appendChild(btnsContainer);

            btnsContainer.innerHTML = `
        <button class="btn-black view-post-btn" aria-label="click to view post">
            view post
        </button>
        <button class="btn-black edit-btn"  aria-label="click to edit post">
            edit
        </button>
        <button class="btn-red delete-btn" aria-label="click to delete post">
            delete
        </button>`;

            const viewPost = contents.querySelector('.view-post-btn');
            viewPost.addEventListener('click', (e) => {
                e.preventDefault();
                const tagsString = post.tags[0];
                const postId = post.id;
                const url = `single-post.html?id=${postId}&tags=${tagsString}`;
                window.open(url, '_blank');
            });

            const editPost = contents.querySelector('.edit-btn');
            editPost.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = post.id;
                const tagsString = post.tags[0];
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
                    const postId = post.id;
                    const deleteConfirmBtn = document.getElementById('delete');
                    const overlay = document.getElementById('overlay');

                    deleteConfirmBtn.style.display = 'none';
                    overlay.style.display = 'none';
                    deletePost(postId)
                        .then(() => {
                            contents.remove();
                        })
                });


            });

            const deleteAbortBtn = document.getElementById('delete-abort');
            deleteAbortBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const overlay = document.getElementById('overlay');
                const deleteDialog = document.getElementById('delete-dialog');
                deleteDialog.style.display = 'none';
                overlay.style.display = 'none';

            })

            function deletePost(postId) {
                return fetch(`https://v2.api.noroff.dev/blog/posts/panpae/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                })
                    .then(data => {
                        console.log('Post deleted successfully:', data);
                    });
            }
        });
    })
    .catch(error => {
        console.error('Error fetching or processing data:', error.message);
        const errorElement = document.createElement('div');
        errorElement.textContent = error.message;

        postsContainer.appendChild(errorElement);
    });

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // Convert date to local date and time format
}

const postNew = document.getElementById('post-new');
postNew.addEventListener('click', () => {
    window.location.href = 'new-post.html';
})


