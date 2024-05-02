const avatarImage = document.getElementsByClassName('avatar-img')[0];
const authorName = document.getElementsByClassName('author-name')[0];
const authorBio = document.getElementsByClassName('bio')[0];
const title = document.querySelector('.title');
const image = document.querySelector('.img');
const dateAndTime = document.querySelector('.date-time');
const body = document.querySelector('.content-body');

function getQueryParamValue(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}

const postId = getQueryParamValue('id'); // Ensure that the parameter name matches the one in the URL
const blog = "https://v2.api.noroff.dev/blog/posts/panpae";

if (postId) {
    fetch(`${blog}${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const selectedPost = data.data;
            console.log(selectedPost);

            if (selectedPost) {
                title.textContent = selectedPost.title;

                dateAndTime.textContent = selectedPost.created;
                function formatDateTime(dateAndTime) {
                    const date = new Date(dateAndTime);
                    return date.toLocaleString(); // Convert date to local date and time format
                }

                image.classList.add('content-image');
                image.style.backgroundImage = `url(${selectedPost.media.url})`;
                image.style.backgroundRepeat = 'no-repeat';
                image.style.backgroundSize = 'cover';
                image.style.backgroundPosition = 'center';

                body.textContent = selectedPost.body;

                avatarImage.style.backgroundImage = `url(${selectedPost.author.avatar.url})`;
                avatarImage.style.backgroundRepeat = 'no-repeat';
                avatarImage.style.backgroundSize = 'cover';
                avatarImage.style.backgroundPosition = 'center';
                authorName.textContent = selectedPost.author.name;
                authorBio.textContent = selectedPost.author.bio;
            } else {
                console.error('Selected post not found');
            }
        })
        .catch(error => {
            console.error('Error fetching post:', error);
        });
} else {
    console.error('Post ID not found in URL parameters');
}

