const avatarImage = document.getElementsByClassName('avatar-img');
const authorName = document.getElementsByClassName('author-name');
const authorBio = document.getElementsByClassName('bio');
const title = document.querySelector('.title');
const image = document.querySelector('.img');
const dateAndTime = document.querySelector('.date-time');
const body = document.querySelector('.content-body');

function getQueryParamValue(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}

const postId = getQueryParamValue('ID');
const blog = "https://v2.api.noroff.dev/blog/posts/panpae";


fetch(`${blog}${postId}`)
.then(response => response.json())
.then(data => {
    const posts = data.data;
    const selectedPost = posts.find(post => post.id === postId);

    if (selectedPost) {
        title.textContent = selectedPost.title;

        dateAndTime.textContent = selectedPost.created;
        function formatDateTime(dateAndTime) {
            const date = new Date(dateAndTime);
            return date.toLocaleString(); // Convert date to local date and time format
        }

        Image.classList.add('content-image');
        Image.style.backgroundImage = `url(${selectedPost.media.url})`;
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
    }

})
